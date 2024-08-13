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

## Helpers

Servactory allows you to add custom helpers for project purposes.

By "helper" we mean some shorthand spelling that, when used, expands into a specific option.

### Custom

Custom helpers can be added using the `output_option_helpers` method in `configuration`.

Such helpers can be based on existing options.

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

If necessary, you can filter `outputs` using the `only` method.
This will return a Hash with the specified attributes.

```ruby{2}
outputs.full_name =
  outputs.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### Method `except`

If necessary, you can filter `outputs` using the `except` method.
This will return a Hash without the specified attributes.

```ruby{2}
outputs.full_name =
  outputs.except(:gender)
    .values
    .compact
    .join(" ")
```

### Predicate methods

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
