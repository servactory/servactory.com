---
title: Service internal attributes
description: Description and examples of using internal attributes of service
prev: Service input attributes
next: Service output attributes
---

# Internal attributes

Internal private attributes can be added via the `internal` method.

## Usage

The assignment and use of internal service attributes is done through the `internals=`/`internals` methods.

```ruby{6,14,22}
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

## Helpers

Servactory allows you to add custom helpers for project purposes.

By "helper" we mean some shorthand spelling that, when used, expands into a specific option.

### Custom

Custom helpers can be added using the `internal_option_helpers` method in `configuration`.

Such helpers can be based on existing options.

[Configuration example](../configuration#helpers-for-internal)

#### Example with `must`

```ruby{5}
class PaymentsService::Create < ApplicationService::Base
  # ...

  internal :invoice_numbers,
           :must_be_6_characters,
           type: Array,
           consists_of: String

  # ...
end
```

## Predicate methods

Any internal attribute can be accessed as a predicate method.

```ruby{8}
# ...

internal :full_name, type: String

# ...

def something
  return unless internals.full_name? # instead of `internals.full_name.present?`

  # ...
end
```
