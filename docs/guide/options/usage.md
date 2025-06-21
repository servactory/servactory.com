---
title: Using options in attributes
description: Description and examples of using options for all service attributes
prev: Service output attributes
next: Advanced options mode
---

# Using options in attributes

## Option `type` <Badge type="info" text="input" /> <Badge type="info" text="internal" /> <Badge type="info" text="output" />

This option is validation.
It will check that the passed value corresponds to the specified type (class).
The `is_a?` method is used.

Always required to specify. May contain one or more classes.

::: code-group

```ruby{2,3} [input]
class NotificationsService::Create < ApplicationService::Base
  input :user, type: User
  input :need_to_notify, type: [TrueClass, FalseClass]

  # ...
end
```

```ruby{4} [internal]
class NotificationsService::Create < ApplicationService::Base
  # ...

  internal :inviter, type: User

  # ...
end
```

```ruby{4} [output]
class NotificationsService::Create < ApplicationService::Base
  # ...

  output :notification, type: Notification

  # ...
end
```

:::

## Option `required` <Badge type="info" text="input" />

This option is validation.
It will check that the passed value is not empty.
The `present?` method is used.

By default, `required` is set to `true`.

::: code-group

```ruby{7} [input]
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

:::

## Option `default` <Badge type="info" text="input" />

This option is not validation.
It will assign a value to the attribute if one was not passed to the service.

::: code-group

```ruby{7} [input]
class UsersService::Create < ApplicationService::Base
  # ...

  input :middle_name,
        type: String,
        required: false,
        default: "<unknown>"

  # ...
end
```

:::

## Option `as` <Badge type="info" text="input" />

This option is not validation.
It will indicate the new name of the attribute to work within the service.
The original name inside the service will no longer be available.

::: code-group

```ruby{3,10} [input]
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

:::

## Option `inclusion` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

::: info

Since version `2.12.0` this option is [dynamic](../options/dynamic#option-inclusion).

:::

This option is validation.
This option is dynamic.
It will check that the passed value is in the specified array.
The `include?` method is used.

::: code-group

```ruby{4} [input]
class EventsService::Send < ApplicationService::Base
  input :event_name,
        type: String,
        inclusion: %w[created rejected approved]

  # ...
end
```

```ruby{6} [internal]
class EventsService::Send < ApplicationService::Base
  # ...

  internal :event_name,
           type: String,
           inclusion: %w[created rejected approved]

  # ...
end
```

```ruby{6} [output]
class EventsService::Send < ApplicationService::Base
  # ...

  output :event_name,
         type: String,
         inclusion: %w[created rejected approved]

  # ...
end
```

:::

## Option `consists_of` <Badge type="info" text="input (^2.0.0)" /> <Badge type="info" text="internal (^2.0.0)" /> <Badge type="info" text="output (^2.0.0)" />

::: info

Since version `2.6.0` this option is [dynamic](../options/dynamic#option-consists-of).

:::

This option is validation.
This option is dynamic.
It will check that each value in the collection matches the specified type (class).
Checks nested values.
The `is_a?` method is used.

Works only with `Array` and `Set` types.
You can add a custom type through the [`collection_mode_class_names`](../configuration#collection-mode) configuration.

Explicit use of this option is optional.
The default value is `String`.

::: code-group

```ruby [input]
input :ids,
      type: Array,
      consists_of: String
```

```ruby [internal]
internal :ids,
         type: Array,
         consists_of: String
```

```ruby [output]
output :ids,
       type: Array,
       consists_of: String
```

:::

## Option `schema` <Badge type="info" text="input (^2.0.0)" /> <Badge type="info" text="internal (^2.0.0)" /> <Badge type="info" text="output (^2.0.0)" />

::: info

Since version `2.12.0` this option is [dynamic](../options/dynamic#option-schema).

:::

This option is validation.
This option is dynamic.
Requires a hash value that must describe the value structure of the output attribute.

Only works with the `Hash` type.
You can add a custom type through the [`hash_mode_class_names`](../configuration#hash-mode) configuration.

Explicit use of this option is optional.
If the schema value is not specified, the validation will be skipped.
By default, no value is specified.

::: code-group

```ruby [input]
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

```ruby [internal]
internal :payload,
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

```ruby [output]
output :payload,
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

:::

Each expected hash key must be described in the following format:

```ruby
{
  request_id: { type: String, required: true }
}
```

The following options are allowed: mandatory `type`, `required` and optional `default`, `prepare`.
The `default` and `prepare` options are only available when used within `input`.

If `type` also specifies a `Hash` value, then nesting can be described in the same format.

## Option `must` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

This option is validation.
Allows you to create your own validations.

::: code-group

```ruby{5-9} [input]
class PaymentsService::Create < ApplicationService::Base
  input :invoice_numbers,
        type: Array,
        consists_of: String,
        must: {
          be_6_characters: {
            is: ->(value:, input:) { value.all? { |id| id.size == 6 } }
          }
        }

  # ...
end
```

```ruby{7-11} [internal]
class EventsService::Send < ApplicationService::Base
  # ...

  internal :invoice_numbers,
           type: Array,
           consists_of: String,
           must: {
             be_6_characters: {
               is: ->(value:, internal:) { value.all? { |id| id.size == 6 } }
             }
           }

  # ...
end
```

```ruby{7-11} [output]
class EventsService::Send < ApplicationService::Base
  # ...

  output :invoice_numbers,
         type: Array,
         consists_of: String,
         must: {
           be_6_characters: {
             is: ->(value:, output:) { value.all? { |id| id.size == 6 } }
           }
         }

  # ...
end
```

:::

## Option `format` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

This option is validation.
This option is dynamic and is not part of the main options.

[More information](./dynamic#option-format)

## Option `max` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

This option is validation.
This option is dynamic and is not part of the main options.

[More information](./dynamic#option-max)

## Option `min` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

This option is validation.
This option is dynamic and is not part of the main options.

[More information](./dynamic#option-min)

## Option `prepare` <Badge type="info" text="input" />

This option is not validation.
It is used to prepare the passed value.

::: warning

Use the `prepare` option carefully and only for simple preparatory actions.
For example, as shown below.
Any logic that is more complex than that in the example below is better applied through the [`make`](../actions/usage) action.

:::

::: code-group

```ruby{5,10} [input]
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

:::
