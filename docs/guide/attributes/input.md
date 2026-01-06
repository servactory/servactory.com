---
title: Service input attributes
description: Description and examples of using input attributes of service
prev: Service call and result of work
next: Service internal attributes
---

# Input attributes

Add all expected attributes via the `input` method. Unexpected arguments (not defined as input attributes) cause an error.

## Usage

Access input attributes via the `inputs` method.

```ruby{2-4,15-17}
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

Servactory provides built-in helpers and supports custom helpers. Helpers are shorthand that expand into specific options.

### Helper `optional`

Equivalent to `required: false`.

```ruby{6}
class UsersService::Create < ApplicationService::Base
  input :first_name,
        type: String

  input :middle_name,
        :optional,
        type: String

  input :last_name,
        type: String

  # ...
end
```

### Custom

Add custom helpers via `input_option_helpers` in `configuration`. Helpers can be based on existing options.

[Configuration example](../configuration#helpers-for-input)

#### Example with `must`

```ruby{3}
class PaymentsService::Create < ApplicationService::Base
  input :invoice_numbers,
        :must_be_6_characters,
        type: Array,
        consists_of: String

  # ...
end
```

#### Example with `prepare`

```ruby{3}
class PaymentsService::Create < ApplicationService::Base
  input :amount_cents,
        :to_money,
        as: :amount,
        type: Integer

  # ...
end
```

## Methods

### Method `only`

Filter `inputs` with the `only` method. Returns a Hash with specified attributes.

```ruby{2}
outputs.full_name =
  inputs.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### Method `except`

Filter `inputs` with the `except` method. Returns a Hash without specified attributes.

```ruby{2}
outputs.full_name =
  inputs.except(:gender)
    .values
    .compact
    .join(" ")
```

### Predicate methods

Access any input attribute as a predicate method.

```ruby{6}
input :first_name, type: String

# ...

def something
  return unless inputs.user? # instead of `inputs.user.present?`
  
  # ...
end
```
