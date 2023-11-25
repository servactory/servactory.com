---
title: Service input attributes
description: Description and examples of using input attributes of service
prev: Getting started
next: Service internal attributes
---

# Input attributes

All attributes that the service should expect when called must be added using the `input` method.
If the service receives attributes that were not added via the `input` method, it will return an error.

## Usage

The use of the attributes included in the service is done through the `inputs` method.

```ruby
class UsersService::Create < ApplicationService::Base
  input :nickname, type: String

  # ...

  def create!
    outputs.user = User.create!(nickname: inputs.nickname)
  end
end
```

## Options

You can find out more about options in the [using options](../options/usage) section.

## Operating modes

You can find out more about operating modes in the [option modes](../options/modes) section.

## Helpers

Servactory has a set of ready-made helpers, and also allows you to add custom helpers for project purposes.

By "helper" we mean some shorthand spelling that, when used, expands into a specific option.

### Helper `optional`

This helper is equivalent to the `required: false` option.

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

Custom helpers can be added using the `input_option_helpers` method in `configuration`.

Such helpers can be based on existing options.

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

## Predicate methods

Any input attribute can be accessed as a predicate method.

```ruby{6}
input :first_name, type: String

# ...

def something
  return unless inputs.user? # instead of `inputs.user.present?`
  
  # ...
end
```
