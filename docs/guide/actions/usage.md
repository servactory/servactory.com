---
title: Using Actions in a Service
description: Description and examples of using actions (methods) in a service
prev: Dynamic Options
next: Options for Actions in a Service
---

# Using Actions

Actions in a service are sequential method calls.
Service methods are called using the `make` method.

## Examples

### Minimal

In its minimal form, calling methods through `make` is optional.
Instead, you can use the `call` method.

```ruby
class PostsService::Create < ApplicationService::Base
  def call
    # something
  end
end
```

### Multiple Methods

```ruby{4-6,8,12,16}
class PostsService::Create < ApplicationService::Base
  # ...

  make :assign_api_model
  make :perform_api_request
  make :process_result

  def assign_api_model
    internals.api_model = APIModel.new(...)
  end

  def perform_api_request
    internals.response = APIClient.resource.create(internals.api_model)
  end

  def process_result
    ARModel.create!(internals.response)
  end
end
```

## Options

For more information about options, see the [options](../actions/options) section.

## Group of Multiple Actions

For more information about a group of multiple actions (methods), see the [grouping](../actions/grouping) section.

## Aliases for `make`

You can add alternative options for the `make` method through the `action_aliases` configuration.

```ruby {2,5}
configuration do
  action_aliases %i[execute]
end

execute :something

def something
  # ...
end
```

## Customization for `make`

Through the `action_shortcuts` configuration, you can add frequently used words that are used as prefixes in method names.
The method names themselves won't become shorter, but this will allow you to shorten the lines with the `make` method and improve the readability of the service code, making it more expressive.

### Simple Mode

In simple mode, values are passed as an array of symbols.

```ruby
configuration do
  action_shortcuts %i[assign perform]
end
```

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

### Extended Mode <Badge type="tip" text="Since 2.14.0" />

In extended mode, values are passed as a hash.

```ruby
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
```

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
