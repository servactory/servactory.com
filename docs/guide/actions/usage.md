---
title: Using actions in service
description: Description and examples of using actions (methods) in the service
prev: Dynamic options
next: Options for actions in service
---

# Using actions

Actions in the service are sequential calls to methods.
Service methods are called using the `make` method.

## Examples

### Minimal

In its minimal form, calling methods via `make` is optional.
The `call` method can be used instead.

```ruby
class PostsService::Create < ApplicationService::Base
  def call
    # something
  end
end
```

### Several methods

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

You can find out more about options in the [options](../actions/options) section.

## Group of multiple actions

You can find out more about a group of multiple actions (methods) in the [grouping](../actions/grouping) section.

## Aliases for `make`

Through the `action_aliases` configuration it is possible to add alternatives to the `make` method.

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

Add frequently used words that are used as prefixes in method names through the `action_shortcuts` configuration.
It won't make the names of methods shorter, but that will shorten the lines using the `make` method and improve the readability of the service code, making it more expressive.

### Simple mode

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

### Advanced mode <Badge type="tip" text="Since 2.14.0" />

In advanced mode, values are passed as a hash.

```ruby
configuration do
  action_shortcuts(
    %i[assign],
    {
      restrict: {           # replacement for make
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
