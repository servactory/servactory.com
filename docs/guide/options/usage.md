---
title: Using Options in Attributes
description: Description and examples of using options for all service attributes
prev: Output Attributes
next: Advanced Options Mode
---

# Using Options in Attributes

## Option `type` <Badge type="info" text="input" /> <Badge type="info" text="internal" /> <Badge type="info" text="output" />

This option is for validation.
It will check that the passed value matches the specified type (class).
Uses the `is_a?` method.

Always required. Must contain one or more classes.

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

This option is for validation.
It will check that the passed value is not empty.
Uses the `present?` method.

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

This option is not for validation.
It will assign a value to the attribute if it was not passed to the service.

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

This option is not for validation.
It will specify a new name for the attribute to be used inside the service.
The original name will become unavailable inside the service.

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

Starting from version `2.12.0`, this option is [dynamic](../options/dynamic#inclusion-option).

:::

This option is for validation.
This option is dynamic.
It will check that the passed value is included in the specified array.
Uses the `include?` method.

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

Starting from version `2.6.0`, this option is [dynamic](../options/dynamic#consists-of-option).

:::

This option is for validation.
This option is dynamic.
It will check that each value in the collection matches the specified type (class).
Checks nested values.
Uses the `is_a?` method.

Works only with `Array` and `Set` types.
You can add your own type through the [`collection_mode_class_names`](../configuration#collection-mode) configuration.

Explicit use of this option is not required.
By default, it is set to `String`.

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

Starting from version `2.12.0`, this option is [dynamic](../options/dynamic#schema-option).

:::

This option is for validation.
This option is dynamic.
Requires a hash value that should describe the structure of the attribute value.

Works only with the `Hash` type.
You can add your own type through the [`hash_mode_class_names`](../configuration#hash-mode) configuration.

Explicit use of this option is not required.
If the schema value is not specified, validation will be skipped.
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

Each expected hash key should be described in this format:

```ruby
{
  request_id: { type: String, required: true }
}
```

The following options are allowed: required `type`, `required` and optional `default`, `prepare`.

If `Hash` is specified as the `type` value, then you can describe nesting in the same format.

## Option `must` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

This option is for validation.
Allows you to create custom validations.

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

This option is for validation.
This option is dynamic and is not part of the core options set.

[Learn more](./dynamic#format-option)

## Option `max` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

This option is for validation.
This option is dynamic and is not part of the core options set.

[Learn more](./dynamic#max-option)

## Option `min` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

This option is for validation.
This option is dynamic and is not part of the core options set.

[Learn more](./dynamic#min-option)

:::

## Option `prepare` <Badge type="info" text="input" />

This option is not for validation.
It is used to prepare the passed value.

::: warning

Use the `prepare` option carefully and only for simple preparatory actions.
For example, as shown below.
Any logic that is more complex than the example below should be implemented through the [`make`](../actions/usage) action.

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
