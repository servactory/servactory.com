---
title: Extensions
description: Expand service functionality with custom extensions using the Stroma hook system
prev: RSpec Migration
next: Internationalization (I18n)
---

# Extensions <Badge type="tip" text="Since 3.0.0" />

Extensions allow you to expand base service functionality through the Stroma hook system.
Define custom behavior that runs before or after service execution stages.

Create extensions in the `app/services/application_service/extensions` directory.

## Quick start

### Generate extension

```shell
rails generate servactory:extension StatusActive
```

This creates `app/services/application_service/extensions/status_active/dsl.rb`.

### Connect extension

::: code-group

```ruby {4-6} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    extensions do
      before :actions, ApplicationService::Extensions::StatusActive::DSL
    end
  end
end
```

:::

### Use in service

```ruby {5}
class PostsService::Create < ApplicationService::Base
  input :user, type: User
  input :title, type: String

  status_active! :user

  make :create_post

  private

  def create_post
    # ...
  end
end
```

## Creating extensions

### Using generator

```shell
rails generate servactory:extension MyExtension
```

Options:

| Option | Default | Description |
|--------|---------|-------------|
| `--path` | `app/services/application_service/extensions` | Output directory |
| `--namespace` | `ApplicationService` | Base namespace |

Examples:

```shell
# Basic
rails generate servactory:extension Auditable

# Nested namespace
rails generate servactory:extension Admin::AuditTrail

# Custom path
rails generate servactory:extension MyExtension --path=lib/extensions
```

### Extension structure

::: code-group

```ruby [app/services/application_service/extensions/my_extension/dsl.rb]
module ApplicationService
  module Extensions
    module MyExtension
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def my_extension!(value)
            stroma.settings[:actions][:my_extension][:value] = value
          end
        end

        module InstanceMethods
          private

          def call!(**)
            value = self.class.stroma.settings[:actions][:my_extension][:value]

            if value.present?
              # Before logic
            end

            super

            # After logic
          end
        end
      end
    end
  end
end
```

:::

### Module structure explanation

| Module | Purpose |
|--------|---------|
| `DSL` | Entry point module, connected via hooks |
| `ClassMethods` | DSL methods called at class definition time |
| `InstanceMethods` | Runtime methods called during service execution |

- `base.extend(ClassMethods)` — adds class-level configuration methods
- `base.include(InstanceMethods)` — adds instance-level runtime behavior

### File organization

For complex extensions, split into separate files:

```
extensions/my_extension/
├── dsl.rb              # Main DSL module with self.included
├── class_methods.rb    # ClassMethods module
└── instance_methods.rb # InstanceMethods module
```

## Connecting extensions

### Hooks: before and after

```ruby
class ApplicationService::Base < Servactory::Base
  extensions do
    before :actions, AuthorizationExtension::DSL
    after :actions, PublishableExtension::DSL
  end
end
```

### Available hook keys

Hooks can be attached to these stages (in execution order):

| Key | Description |
|-----|-------------|
| `:configuration` | Service configuration |
| `:info` | Service info |
| `:context` | Context setup |
| `:inputs` | Input processing |
| `:internals` | Internal attributes |
| `:outputs` | Output processing |
| `:actions` | Action execution |

Most extensions use `:actions` — the main execution point.

### Multiple extensions

```ruby {4-9}
class ApplicationService::Base < Servactory::Base
  extensions do
    # Before hooks (execute in order)
    before :actions, ApplicationService::Extensions::Authorization::DSL
    before :actions, ApplicationService::Extensions::StatusActive::DSL

    # After hooks (execute in order)
    after :actions, ApplicationService::Extensions::Publishable::DSL
    after :actions, ApplicationService::Extensions::PostCondition::DSL
  end
end
```

### Execution order

1. `before` hooks execute in declaration order
2. Service actions (`make` methods)
3. `after` hooks execute in declaration order

### Understanding `super`

Extensions form a call chain. `super` passes execution to the next module:

```ruby
def call!(**)
  # Before logic (runs first)
  validate_something!

  super  # Calls next extension or service actions

  # After logic (runs after service completes)
  log_result!
end
```

| Pattern | `super` placement | Use case |
|---------|-------------------|----------|
| Before | Logic before `super` | Validation, authorization |
| After | Logic after `super` | Logging, publishing |
| Around | Wrap `super` | Transactions, timing |
| Short-circuit | Skip `super` | Caching, early return |

## Stroma settings

Extensions store configuration in Stroma settings.

### Key structure

```
stroma.settings[:registry_key][:extension_name][:setting_key]
```

| Level | Description | Example |
|-------|-------------|---------|
| `registry_key` | Hook target | `:actions` |
| `extension_name` | Extension identifier | `:authorization` |
| `setting_key` | Specific setting | `:method_name` |

### Writing settings

In `ClassMethods`:

```ruby
def authorize_with(method_name)
  stroma.settings[:actions][:authorization][:method_name] = method_name
end
```

### Reading settings

In `InstanceMethods`:

```ruby
def call!(**)
  method_name = self.class.stroma.settings[:actions][:authorization][:method_name]
  # ...
  super
end
```

### Auto-vivification

Nested objects are created automatically on first access:

```ruby
# This works without explicit initialization
stroma.settings[:actions][:my_extension][:enabled] = true
stroma.settings[:actions][:my_extension][:options] = { timeout: 30 }
```

## Extension patterns

### Before pattern

Validate or check conditions before service execution.

::: code-group

```ruby [extensions/authorization/dsl.rb]
module ApplicationService
  module Extensions
    module Authorization
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def authorize_with(method_name)
            stroma.settings[:actions][:authorization][:method_name] = method_name
          end
        end

        module InstanceMethods
          private

          def call!(incoming_arguments: {}, **)
            method_name = self.class.stroma.settings[:actions][:authorization][:method_name]

            if method_name.present?
              authorized = send(method_name, incoming_arguments)

              unless authorized
                fail!(
                  :unauthorized,
                  message: "Not authorized to perform this action"
                )
              end
            end

            super
          end
        end
      end
    end
  end
end
```

```ruby [Usage]
class PostsService::Delete < ApplicationService::Base
  input :post, type: Post
  input :user, type: User

  authorize_with :user_can_delete?

  make :delete_post

  private

  def user_can_delete?(args)
    args[:user].admin? || args[:post].author_id == args[:user].id
  end

  def delete_post
    inputs.post.destroy!
  end
end
```

:::

### Around pattern

Wrap service execution in a context.

::: code-group

```ruby [extensions/transactional/dsl.rb]
module ApplicationService
  module Extensions
    module Transactional
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def transactional!(transaction_class: nil)
            stroma.settings[:actions][:transactional][:enabled] = true
            stroma.settings[:actions][:transactional][:class] = transaction_class
          end
        end

        module InstanceMethods
          private

          def call!(**)
            settings = self.class.stroma.settings[:actions][:transactional]
            enabled = settings[:enabled]

            unless enabled
              super
              return
            end

            transaction_class = settings[:class]

            fail!(message: "Transaction class not configured") if transaction_class.nil?

            transaction_class.transaction { super }
          end
        end
      end
    end
  end
end
```

```ruby [Usage]
class OrdersService::Create < ApplicationService::Base
  transactional! transaction_class: ActiveRecord::Base

  input :user, type: User
  input :items, type: Array

  output :order, type: Order

  make :create_order
  make :create_line_items
  make :charge_payment

  private

  def create_order
    outputs.order = Order.create!(user: inputs.user)
  end

  def create_line_items
    inputs.items.each do |item|
      outputs.order.line_items.create!(item)
    end
  end

  def charge_payment
    PaymentsService::Charge.call!(amount: outputs.order.total_amount)
  end
end
```

:::

### After pattern

Process results after service execution.

::: code-group

```ruby [extensions/publishable/dsl.rb]
module ApplicationService
  module Extensions
    module Publishable
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def publishes(event_name, with: nil, event_bus: nil)
            stroma.settings[:actions][:publishable][:configurations] ||= []
            stroma.settings[:actions][:publishable][:configurations] << {
              event_name:,
              payload_method: with,
              event_bus:
            }
          end
        end

        module InstanceMethods
          private

          def call!(**)
            super

            configurations = self.class.stroma.settings[:actions][:publishable][:configurations] || []

            configurations.each do |config|
              event_name = config[:event_name]
              payload_method = config[:payload_method]
              event_bus = config[:event_bus]

              payload = payload_method.present? ? send(payload_method) : {}
              event_bus.publish(event_name, payload)
            end
          end
        end
      end
    end
  end
end
```

```ruby [Usage]
class UsersService::Create < ApplicationService::Base
  publishes :user_created, with: :user_payload, event_bus: EventPublisher

  input :email, type: String
  input :name, type: String

  output :user, type: User

  make :create_user

  private

  def create_user
    outputs.user = User.create!(email: inputs.email, name: inputs.name)
  end

  def user_payload
    { user_id: outputs.user.id, email: outputs.user.email }
  end
end
```

:::

### Rescue pattern

Handle errors and perform cleanup.

::: code-group

```ruby [extensions/rollbackable/dsl.rb]
module ApplicationService
  module Extensions
    module Rollbackable
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def on_rollback(method_name)
            stroma.settings[:actions][:rollbackable][:method_name] = method_name
          end
        end

        module InstanceMethods
          private

          def call!(**)
            super
          rescue StandardError => e
            raise e if e.is_a?(Servactory::Exceptions::Success)

            method_name = self.class.stroma.settings[:actions][:rollbackable][:method_name]

            send(method_name) if method_name.present?

            raise
          end
        end
      end
    end
  end
end
```

```ruby [Usage]
class PaymentsService::Process < ApplicationService::Base
  on_rollback :cleanup_resources

  input :order, type: Order
  input :payment_method, type: PaymentMethod

  output :payment, type: Payment

  make :reserve_inventory
  make :charge_payment
  make :confirm_order

  private

  def reserve_inventory
    InventoryService::Reserve.call!(items: inputs.order.items)
  end

  def charge_payment
    result = PaymentsService::Charge.call!(
      payment_method: inputs.payment_method,
      amount: inputs.order.total_amount
    )
    outputs.payment = result.payment
  end

  def confirm_order
    inputs.order.confirm!
  end

  def cleanup_resources
    InventoryService::Release.call!(items: inputs.order.items)
    PaymentsService::Refund.call!(payment: outputs.payment) if outputs.payment.present?
  end
end
```

:::

## Migration from 2.x

### Syntax changes

::: code-group

```ruby [2.x (Legacy)]
module ApplicationService
  class Base
    include Servactory::DSL.with_extensions(
      ApplicationService::Extensions::StatusActive::DSL
    )
  end
end
```

```ruby [3.0 (Current)]
module ApplicationService
  class Base < Servactory::Base
    extensions do
      before :actions, ApplicationService::Extensions::StatusActive::DSL
    end
  end
end
```

:::

### Settings storage changes

| Aspect | 2.x | 3.0 |
|--------|-----|-----|
| Storage | Class variables (`@@var`) | `stroma.settings[:key][:ext][:setting]` |
| Access | `self.class.send(:var)` | `self.class.stroma.settings[:key][:ext][:setting]` |
| Inheritance | Manual handling | Automatic deep copy |

### Extension code changes

::: code-group

```ruby [2.x (Legacy)]
module ClassMethods
  private

  attr_accessor :status_active_model_name

  def status_active!(model_name)
    self.status_active_model_name = model_name
  end
end

module InstanceMethods
  private

  def call!(**)
    super

    model_name = self.class.send(:status_active_model_name)
    # ...
  end
end
```

```ruby [3.0 (Current)]
module ClassMethods
  private

  def status_active!(model_name)
    stroma.settings[:actions][:status_active][:model_name] = model_name
  end
end

module InstanceMethods
  private

  def call!(**)
    model_name = self.class.stroma.settings[:actions][:status_active][:model_name]
    # ...
    super
  end
end
```

:::
