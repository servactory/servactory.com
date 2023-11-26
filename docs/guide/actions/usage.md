---
title: Using actions in service
description: Description and examples of using actions (methods) in the service
prev: Option operating modes
next: Options for actions in service
---

# Using actions

Actions in the service are sequential calls to methods.
Service methods are called using the `make` method.

## Examples

### Minimal

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

Soon

## Group of multiple methods

Soon

## Aliases for `make`

Through the `action_aliases` configuration it is possible to add an alias for the `make` method.

```ruby {2,5}
configuration do
  action_aliases %i[execute]
end

execute :something

def something
  # ...
end
```

## Shortcuts for `make`

Add frequently used words that are used as prefixes in method names through the `action_shortcuts` configuration.
It won't make the names of methods shorter, but that will shorten the lines using the `make` method and improve the readability of the service code, making it more expressive.

```ruby {2,5,6,9,13}
configuration do
  action_shortcuts %i[assign perform]
end

assign :api_model
perform :api_request
make :process_result

def assign_api_model
  internals.api_model = APIModel.new
end

def perform_api_request
  internals.response = APIClient.resource.create(internals.api_model)
end

def process_result
  ARModel.create!(internals.response)
end
```
