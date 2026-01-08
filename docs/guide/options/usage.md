---
title: Using options in attributes
description: Description and examples of using options for all service attributes
prev: Service output attributes
next: Advanced options mode
---

# Using options in attributes

## Option `type` <Badge type="info" text="input" /> <Badge type="info" text="internal" /> <Badge type="info" text="output" />

Validation option. Checks that the passed value matches the specified type (class) using `is_a?`.

Required. May contain one or more classes.

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

Validation option. Checks that the passed value is not empty using `present?`.

Defaults to `true`.

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

Non-validation option. Assigns a value if none was passed to the service.

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

Non-validation option. Specifies an alias for the attribute within the service. The original name becomes unavailable inside the service.

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

Dynamic validation option. Checks that the passed value is in the specified array using `include?`.

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

Dynamic validation option. Checks that each value in the collection matches the specified type (class), including nested values, using `is_a?`.

Works only with `Array` and `Set` types. Add custom types via [`collection_mode_class_names`](../configuration#collection-mode) configuration.

Optional. Defaults to `String`.

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

Dynamic validation option. Requires a hash value describing the attribute's value structure.

Works only with `Hash` type. Add custom types via [`hash_mode_class_names`](../configuration#hash-mode) configuration.

Optional. If unspecified, validation is skipped. No default value.

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

Describe each expected hash key in this format:

```ruby
{
  request_id: { type: String, required: true }
}
```

Allowed options: required `type`, `required` and optional `default`, `prepare`. The `default` and `prepare` options are only available within `input`.

If `type` specifies `Hash`, describe nesting in the same format.

## Option `must` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

Validation option. Create custom validations.

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

Dynamic validation option (not part of main options). See [more](./dynamic#option-format).

## Option `max` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

Dynamic validation option (not part of main options). See [more](./dynamic#option-max).

## Option `min` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

Dynamic validation option (not part of main options). See [more](./dynamic#option-min).

## Option `target` <Badge type="info" text="input (^3.0.0)" /> <Badge type="info" text="internal (^3.0.0)" /> <Badge type="info" text="output (^3.0.0)" />

Dynamic validation option for Class-typed attributes (not part of main options). See [more](./dynamic#option-target).

## Option `prepare` <Badge type="info" text="input" />

Non-validation option. Prepares the passed value.

::: warning

Use `prepare` carefully for simple preparatory actions only. Complex logic is better applied via [`make`](../actions/usage) actions.

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
