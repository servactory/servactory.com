---
title: Service input attributes
description: Description and examples of using input attributes of service
prev: Getting started
next: Service internal attributes
---

# Service input attributes

All attributes that the service should expect when called must be added using the `input` method.
If the service receives attributes that were not added via the `input` method, it will return an error.

## Usage

The use of the attributes included in the service is done through the `inputs` method.

```ruby
class UsersService::Create < ApplicationService::Base
  input :nickname, type: String

  # ...

  def create!
    outputs.user = User.create!(nickname: inputs.nickname)
  end
end
```

## Options

### Option `type`

This option is validation.
It will check if the value set to `input` corresponds to the specified type (class).
The `is_a?` method is used.

Always required to specify. May contain one or more classes.

```ruby{3}
class UsersService::Accept < ApplicationService::Base
  input :user,
        type: User

  # ...
end
```

```ruby{3}
class ToggleService < ApplicationService::Base
  input :flag,
        type: [TrueClass, FalseClass]

  # ...
end
```

### Option `required`

This option is validation.
Checks that the value set to `input` is not empty.
The `present?` method is used to check if the value is not `nil` or an empty string.

By default, `required` is set to `true`.

```ruby{7}
class UsersService::Create < ApplicationService::Base
  input :first_name,
        type: String
  
  input :middle_name,
        type: String,
        required: false
  
  input :last_name,
        type: String

  # ...
end
```

### Option `as`

This option is not validation.
It is used to prepare the input attribute.
The input attribute will be assigned a new name, which is specified via the `as` option.
The original name inside the service will no longer be available.

```ruby{3,14}
class NotificationService::Create < ApplicationService::Base
  input :customer,
        as: :user,
        type: User

  output :notification,
         type: Notification

  make :create_notification!

  private

  def create_notification!
    outputs.notification = Notification.create!(user: inputs.user)
  end
end
```

### Option `inclusion`

This option is validation.
Checks that the value set in `input` is in the specified array.
The `include?` method is used.

```ruby{4}
class EventService::Send < ApplicationService::Base
  input :event_name,
        type: String,
        inclusion: %w[created rejected approved]

  # ...
end
```

### Option `must`

This option is validation.
But unlike other validation options, `must` allows you to describe any kind of validation internally.

```ruby{5-9}
class PymentsService::Send < ApplicationService::Base
  input :invoice_numbers,
        type: Array,
        consists_of: String,
        must: {
          be_6_characters: {
            is: ->(value:) { value.all? { |id| id.size == 6 } }
          }
        }

  # ...
end
```

### Option `prepare`

This option is not validation.
It is used to prepare the value of the input attribute.

::: warning

Use the `prepare` option carefully and only for simple actions.

:::

```ruby{5}
class PymentsService::Send < ApplicationService::Base
  input :amount_cents,
        as: :amount,
        type: Integer,
        prepare: ->(value:) { Money.from_cents(value, :USD)  }

  # then `inputs.balance` is used in the service

  # ...
end
```

## Helpers

Servactory has a set of ready-made helpers, and also allows you to add custom helpers for project purposes.

By helper we mean some shorthand spelling that, when used, expands into a specific option.

### Helper `optional`

This helper is equivalent to `required: false`.

```ruby{6}
class UsersService::Create < ApplicationService::Base
  input :first_name,
        type: String

  input :middle_name,
        :optional,
        type: String

  input :last_name,
        type: String

  # ...
end
```

### Custom

Custom helpers can be added using the `input_option_helpers` method in `configuration`.

Such helpers can be based on the `must` and `prepare` options.

[Configuration example](../configuration.md#helpers-for-input)

#### Example with `must`

```ruby{3}
class PymentsService::Send < ApplicationService::Base
  input :invoice_numbers,
        :must_be_6_characters,
        type: Array,
        consists_of: String

  # ...
end
```

#### Example with `prepare`

```ruby{3}
class PymentsService::Send < ApplicationService::Base
  input :amount_cents,
        :to_money,
        as: :amount,
        type: Integer

  # ...
end
```

## Predicate methods

Any input attribute can be accessed as a predicate method.

```ruby{6}
input :first_name, type: String

# ...

def something
  return unless inputs.user? # instead of `inputs.user.present?`
  
  # ...
end
```

## Advanced mode

Advanced mode involves more detailed work with the attribute option.

### Option `required`

```ruby
input :first_name,
      type: String,
      required: {
        is: true,
        message: "Input `first_name` is required"
      }
```

```ruby
input :first_name,
      type: String,
      required: {
        message: lambda do |service_class_name:, input:, value:|
          "Input `first_name` is required"
        end
      }
```

### Option `inclusion`

```ruby
input :event_name,
      type: String,
      inclusion: {
        in: %w[created rejected approved]
      }
```

```ruby
input :event_name,
      type: String,
      inclusion: {
        in: %w[created rejected approved],
        message: lambda do |service_class_name:, input:, value:|
          value.present? ? "Incorrect `event_name` specified: `#{value}`" : "Event name not specified"
        end
      }
```

### Option `must`

::: info

The `must` option can work only in advanced mode.

:::

```ruby
input :invoice_numbers,
      type: Array,
      consists_of: String,
      must: {
        be_6_characters: {
          is: ->(value:) { value.all? { |id| id.size == 6 } }
        }
      }
```

```ruby
input :invoice_numbers,
      type: Array,
      consists_of: String,
      must: {
        be_6_characters: {
          is: ->(value:) { value.all? { |id| id.size == 6 } },
          message: lambda do |service_class_name:, input:, value:, code:|
            "Wrong IDs in `#{input.name}`"
          end
        }
      }
```
