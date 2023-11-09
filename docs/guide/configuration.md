---
title: Configuration
description: Description and examples of service configuration
prev: Service call and result of work
next: Service failures and error handling
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
      input_error_class ApplicationService::Errors::InputError
      output_error_class ApplicationService::Errors::OutputError
      internal_error_class ApplicationService::Errors::InternalError

      failure_class ApplicationService::Errors::Failure
    end
  end
end
```

```ruby {3-5,7} [app/services/application_service/errors.rb]
module ApplicationService
  module Errors
    class InputError < Servactory::Errors::InputError; end
    class OutputError < Servactory::Errors::OutputError; end
    class InternalError < Servactory::Errors::InternalError; end

    class Failure < Servactory::Errors::Failure; end
  end
end
```

:::

### Helpers for `input`

Custom helpers for `input` are based on the `must` and `prepare` options.

#### Example with `must`

::: code-group

```ruby {4-20} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_option_helpers(
        [
          Servactory::Inputs::OptionHelper.new(
            name: :must_be_6_characters,
            equivalent: {
              must: {
                be_6_characters: {
                  is: ->(value:) { value.all? { |id| id.size == 6 } },
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
          Servactory::Inputs::OptionHelper.new(
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

### Aliases for `make`

::: code-group

```ruby {2} [app/services/application_service/base.rb]
configuration do
  action_aliases %i[execute]
end
```

:::

### Shortcuts for `make`

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      action_shortcuts %i[assign perform]
    end
  end
end
```

:::
