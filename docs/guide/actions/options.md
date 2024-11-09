---
title: Options for actions in service
description: Description and examples of using options for actions (methods) in service
prev: Using actions in service
next: Grouping actions in service
---

# Options for actions

## Option `if`

Before calling the method, the condition described in `if` will be checked.

```ruby{2}
make :something,
     if: ->(context:) { Settings.features.preview.enabled }

def something
  # ...
end
```

## Option `unless`

The opposite of the `if` option.

```ruby{2}
make :something,
     unless: ->(context:) { Settings.features.preview.disabled }

def something
  # ...
end
```

## Option `position`

All methods have a position.
If a method needs to be called at a different time than it was added via `make`, then the `position` option can be used.
Can be useful at service inheritance.

```ruby{3,14}
class SomeApiService::Base < ApplicationService::Base
  make :api_request!,
       position: 2

  # ...
end

class SomeApiService::Posts::Create < SomeApiService::Base
  input :post_name, type: String

  # ...
  
  make :validate!,
       position: 1

  private

  def validate!
    # ...
  end

  # ...
end
```
