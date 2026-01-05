---
title: Service output attributes
description: Description and examples of using output attributes of service
prev: Service internal attributes
next: Options for service attributes
---

# Output attributes

Add all return attributes via the `output` method. These are available through the `Result` class.

## Usage

Assign and access output attributes via `outputs=`/`outputs` methods.

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

See [using options](../options/usage) for details.

## Helpers

Servactory supports custom helpers for project purposes. Helpers are shorthand that expand into specific options.

### Custom

Add custom helpers via `output_option_helpers` in `configuration`. Helpers can be based on existing options.

[Configuration example](../configuration#helpers-for-output)

#### Example with `must`

```ruby{5}
class PaymentsService::Create < ApplicationService::Base
  # ...

  output :invoice_numbers,
         :must_be_6_characters,
         type: Array,
         consists_of: String

  # ...
end
```

## Methods

### Method `only`

Filter `outputs` with the `only` method. Returns a Hash with specified attributes.

```ruby{2}
outputs.full_name =
  outputs.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### Method `except`

Filter `outputs` with the `except` method. Returns a Hash without specified attributes.

```ruby{2}
outputs.full_name =
  outputs.except(:gender)
    .values
    .compact
    .join(" ")
```

### Predicate methods

Access any output attribute as a predicate method.

```ruby{8}
# ...

output :full_name, type: String

# ...

def something
  return unless outputs.full_name? # instead of `outputs.full_name.present?`

  # ...
end
```
