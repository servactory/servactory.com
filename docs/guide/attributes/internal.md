---
title: Service internal attributes
description: Description and examples of using internal attributes of service
prev: Service input attributes
next: Service output attributes
---

# Internal attributes

Add internal private attributes via the `internal` method.

## Usage

Assign and access internal attributes via `internals=`/`internals` methods.

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

See [using options](../options/usage) for details.

## Helpers

Servactory supports custom helpers for project purposes. Helpers are shorthand that expand into specific options.

### Custom

Add custom helpers via `internal_option_helpers` in `configuration`. Helpers can be based on existing options.

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

## Methods

### Method `only`

Filter `internals` with the `only` method. Returns a Hash with specified attributes.

```ruby{2}
outputs.full_name =
  internals.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### Method `except`

Filter `internals` with the `except` method. Returns a Hash without specified attributes.

```ruby{2}
outputs.full_name =
  internals.except(:gender)
    .values
    .compact
    .join(" ")
```

### Predicate methods

Access any internal attribute as a predicate method.

```ruby{8}
# ...

internal :full_name, type: String

# ...

def something
  return unless internals.full_name? # instead of `internals.full_name.present?`

  # ...
end
```
