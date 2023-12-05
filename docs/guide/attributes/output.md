---
title: Service output attributes
description: Description and examples of using output attributes of service
prev: Service internal attributes
next: Options for service attributes
---

# Output attributes

All attributes that the service should return as a result through the `Result` class must be added using the `output` method.

## Usage

The assignment and use of service output attributes is done through the `outputs=`/`outputs` methods.

```ruby{8,22}
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  internal :full_name, type: String

  output :user, type: User

  make :assign_full_name
  make :create!

  def assign_full_name
    internals.full_name = [
      inputs.first_name,
      inputs.middle_name,
      inputs.last_name
    ].join(" ")
  end

  def create!
    outputs.user = User.create!(full_name: internals.full_name)
  end
end
```

## Options

You can find out more about options in the [using options](../options/usage) section.

## Predicate methods

Any output attribute can be accessed as a predicate method.

```ruby{8}
# ...

output :full_name, type: String

# ...

def something
  return unless outputs.full_name? # instead of `outputs.full_name.present?`

  # ...
end
```
