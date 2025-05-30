---
title: Configuration
description: Description and examples of service configuration
prev: Service failures and error handling
next: RSpec
---

# Configuration

Services are configured through the `configuration` method, which can be placed, for example, in the base class.

## Configuration examples

### For exceptions

::: code-group

```ruby {4-6,8} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_exception_class ApplicationService::Exceptions::Input
      internal_exception_class ApplicationService::Exceptions::Internal
      output_exception_class ApplicationService::Exceptions::Output

      failure_class ApplicationService::Exceptions::Failure
    end
  end
end
```

```ruby {3-5,7} [app/services/application_service/exceptions.rb]
module ApplicationService
  module Exceptions
    class Input < Servactory::Exceptions::Input; end
    class Output < Servactory::Exceptions::Output; end
    class Internal < Servactory::Exceptions::Internal; end

    class Failure < Servactory::Exceptions::Failure; end
  end
end
```

:::

### For result <Badge type="tip" text="Since 2.5.0" />

::: code-group

```ruby {6} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      # ...

      result_class ApplicationService::Result
    end
  end
end
```

```ruby {2} [app/services/application_service/result.rb]
module ApplicationService
  class Result < Servactory::Result; end
end
```

:::

### Collection mode

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      collection_mode_class_names([ActiveRecord::Relation])
    end
  end
end
```

:::

### Hash mode

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      hash_mode_class_names([CustomHash])
    end
  end
end
```

:::

### Helpers for `input`

Custom helpers for `input` can be based on the `must` and `prepare` options.

#### Example with `must`

::: code-group

```ruby {4-20} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_option_helpers(
        [
          Servactory::Maintenance::Attributes::OptionHelper.new(
            name: :must_be_6_characters,
            equivalent: {
              must: {
                be_6_characters: {
                  is: ->(value:, input:) { value.all? { |id| id.size == 6 } },
                  message: lambda do |input:, **|
                    "Wrong IDs in `#{input.name}`"
                  end
                }
              }
            }
          )
        ]
      )
    end
  end
end
```

:::

#### Example with `prepare`

::: code-group

```ruby {4-13} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_option_helpers(
        [
          Servactory::Maintenance::Attributes::OptionHelper.new(
            name: :to_money,
            equivalent: {
              prepare: ->(value:) { Money.from_cents(value, :USD) }
            }
          )
        ]
      )
    end
  end
end
```

:::

### Helpers for `internal`

Custom helpers for `output` can be based on the `must` option.

#### Example with `must`

::: code-group

```ruby {4-20} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      internal_option_helpers(
        [
          Servactory::Maintenance::Attributes::OptionHelper.new(
            name: :must_be_6_characters,
            equivalent: {
              must: {
                be_6_characters: {
                  is: ->(value:, internal:) { value.all? { |id| id.size == 6 } },
                  message: lambda do |internal:, **|
                    "Wrong IDs in `#{internal.name}`"
                  end
                }
              }
            }
          )
        ]
      )
    end
  end
end
```

:::

### Helpers for `output`

Custom helpers for `output` can be based on the `must` option.

#### Example with `must`

::: code-group

```ruby {4-20} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      output_option_helpers(
        [
          Servactory::Maintenance::Attributes::OptionHelper.new(
            name: :must_be_6_characters,
            equivalent: {
              must: {
                be_6_characters: {
                  is: ->(value:, output:) { value.all? { |id| id.size == 6 } },
                  message: lambda do |output:, **|
                    "Wrong IDs in `#{output.name}`"
                  end
                }
              }
            }
          )
        ]
      )
    end
  end
end
```

:::

### Aliases for `make`

The `action_aliases` configuration allows you to add alternatives to `make`.

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      action_aliases %i[execute]
    end
  end
end
```

:::

### Customization for `make`

The `action_shortcuts` configuration allows you to implement a shortcut when using `make`.

The values specified in the configuration are used instead of `make` and are also a prefix to the instance method.

#### Simple mode

In simple mode, values are passed as an array of symbols.

::: code-group

```ruby {4-6} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      action_shortcuts(
        %i[assign perform]
      )
    end
  end
end
```

:::

::: details Example of use

```ruby
class CMSService::API::Posts::Create < CMSService::API::Base
  # ...
  
  assign :model

  perform :request

  private

  def assign_model
    # Build model for API request
  end

  def perform_request
    # Perform API request
  end
  
  # ...
end
```

:::

#### Advanced mode <Badge type="tip" text="Since 2.14.0" />

In advanced mode, values are passed as a hash.

::: code-group

```ruby {6-11} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      action_shortcuts(
        %i[assign],
        {
          restrict: {             # replacement for make
            prefix: :create,      # method name prefix
            suffix: :restriction  # method name suffix
          }
        }
      )
    end
  end
end
```

:::

::: details Example of use

```ruby
class PaymentsService::Restrictions::Create < ApplicationService::Base
  input :payment, type: Payment

  # The exclamation mark will be moved to the end of the method name
  restrict :payment!

  private

  def create_payment_restriction!
    inputs.payment.restrictions.create!(
      reason: "Suspicion of fraud"
    )
  end
end
```

:::

### Predicate methods <Badge type="tip" text="Since 2.5.0" />

By default, predicate methods for all attributes are enabled.
You can turn them off if necessary.

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      predicate_methods_enabled false
    end
  end
end
```

:::
