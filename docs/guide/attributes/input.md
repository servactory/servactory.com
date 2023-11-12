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

### Option `type`

This option is validation.
It will check that the passed value corresponds to the specified type (class).
The `is_a?` method is used.

Always required to specify. May contain one or more classes.

```ruby{3}
class UsersService::Accept < ApplicationService::Base
  input :user,
        type: User

  # ...
end
```

```ruby{3}
class FeaturesService::Enable < ApplicationService::Base
  input :flag,
        type: [TrueClass, FalseClass]

  # ...
end
```

### Option `required`

This option is validation.
It will check that the passed value is not empty.
The `present?` method is used.

By default, `required` is set to `true`.

```ruby{7}
class UsersService::Create < ApplicationService::Base
  input :first_name,
        type: String
  
  input :middle_name,
        type: String,
        required: false
  
  input :last_name,
        type: String

  # ...
end
```

### Option `as`

This option is not validation.
It will indicate the new name of the input attribute to work within the service.
The original name inside the service will no longer be available.

```ruby{3,10}
class NotificationsService::Create < ApplicationService::Base
  input :user,
        as: :recipient,
        type: User

  # ...

  def create!
    outputs.notification =
      Notification.create!(recipient: inputs.recipient)
  end
end
```

### Option `inclusion`

This option is validation.
It will check that the passed value is in the specified array.
The `include?` method is used.

```ruby{4}
class EventsService::Send < ApplicationService::Base
  input :event_name,
        type: String,
        inclusion: %w[created rejected approved]

  # ...
end
```

### Option `must`

This option is validation.
Allows you to create your own validations.

```ruby{5-9}
class PaymentsService::Create < ApplicationService::Base
  input :invoice_numbers,
        type: Array,
        consists_of: String,
        must: {
          be_6_characters: {
            is: ->(value:) { value.all? { |id| id.size == 6 } }
          }
        }

  # ...
end
```

### Option `prepare`

This option is not validation.
It is used to prepare the passed value.

::: warning

Use the `prepare` option carefully and only for simple preparatory actions.

:::

```ruby{5,11}
class PaymentsService::Create < ApplicationService::Base
  input :amount_cents,
        as: :amount,
        type: Integer,
        prepare: ->(value:) { Money.from_cents(value, :USD) }

  # ...

  def create!
    outputs.payment = Payment.create!(amount: inputs.amount)
  end
end
```

## Operating modes

The operating mode of an input attribute depends on its type.
Each operating mode has a set of its own options.

### Collection mode

To enable collection mode, you must specify `Array` or `Set` as the type of the input attribute.
You can also specify your own type for project purposes through the use of the `collection_mode_class_names` configuration.

#### Options

##### Option `consists_of`

This option is validation.
It will check that each value in the collection matches the specified type (class).
The `is_a?` method is used.

Explicit use of this option is optional.
The default value is `String`.

```ruby
input :ids,
      type: Array,
      consists_of: String
```

### Hash mode

To enable hash mode, you must specify `Hash` as the type of the input attribute.
You can also specify your own type for project purposes through the use of the `hash_mode_class_names` configuration.

#### Options

##### Option `schema`

This option is validation.
Requires a hash value that must describe the value structure of the input attribute.

Explicit use of this option is optional.
If the schema value is not specified, the validation will be skipped.
By default, no value is specified.

```ruby
input :payload,
      type: Hash,
      schema: {
        request_id: { type: String, required: true },
        user: {
          type: Hash,
          required: true,
          first_name: { type: String, required: true },
          middle_name: { type: String, required: false, default: "<unknown>" },
          last_name: { type: String, required: true },
          pass: {
            type: Hash,
            required: true,
            series: { type: String, required: true },
            number: { type: String, required: true }
          }
        }
      }
```

Each expected hash key must be described in the following format:

```ruby
{
  request_id: { type: String, required: true }
}
```

The following options are allowed: `type`, `required` and the optional `default`.

If the `type` value is `Hash`, then nesting can be described in the same format.

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

## Advanced mode

Advanced mode involves more detailed work with the attribute option.

### Option `required`

```ruby
input :first_name,
      type: String,
      required: {
        is: true,
        message: "Input `first_name` is required"
      }
```

```ruby
input :first_name,
      type: String,
      required: {
        message: lambda do |service_class_name:, input:, value:|
          "Input `first_name` is required"
        end
      }
```

### Option `inclusion`

```ruby
input :event_name,
      type: String,
      inclusion: {
        in: %w[created rejected approved]
      }
```

```ruby
input :event_name,
      type: String,
      inclusion: {
        in: %w[created rejected approved],
        message: lambda do |service_class_name:, input:, value:|
          value.present? ? "Incorrect `event_name` specified: `#{value}`" : "Event name not specified"
        end
      }
```

### Option `must`

::: info

The `must` option can work only in advanced mode.

:::

```ruby
input :invoice_numbers,
      type: Array,
      consists_of: String,
      must: {
        be_6_characters: {
          is: ->(value:) { value.all? { |id| id.size == 6 } }
        }
      }
```

```ruby
input :invoice_numbers,
      type: Array,
      consists_of: String,
      must: {
        be_6_characters: {
          is: ->(value:) { value.all? { |id| id.size == 6 } },
          message: lambda do |service_class_name:, input:, value:, code:|
            "Wrong IDs in `#{input.name}`"
          end
        }
      }
```

### Option `consists_of`

Option from [collection mode](../attributes/input#collection-mode).

```ruby
input :ids,
      type: Array,
      consists_of: {
        type: String,
        message: "ID can only be of String type"
      }
```

```ruby
input :ids,
      type: Array,
      # The default array element type is String
      consists_of: {
        message: "ID can only be of String type"
      }
```
