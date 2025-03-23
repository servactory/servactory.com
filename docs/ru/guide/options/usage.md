---
title: Использование опций в атрибутах
description: Описание и примеры использования опций для всех атрибутов сервиса
prev: Выходящие атрибуты сервиса
next: Расширенный режим опций
---

# Использование опций в атрибутах

## Опция `type` <Badge type="info" text="input" /> <Badge type="info" text="internal" /> <Badge type="info" text="output" />

Эта опция является валидацией.
Будет проверять чтобы переданное значение соответствовало указанному типу (классу).
Используется метод `is_a?`.

Всегда обязательно для указания. Должно содержать один или несколько классов.

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

## Опция `required` <Badge type="info" text="input" />

Эта опция является валидацией.
Будет проверять чтобы переданное значение не было пустым.
Используется метод `present?`.

По умолчанию `required` имеет значение `true`.

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

## Опция `default` <Badge type="info" text="input" />

Эта опция не является валидацией.
Будет назначать значение для атрибута, если оно не было передано в сервис.

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

## Опция `as` <Badge type="info" text="input" />

Эта опция не является валидацией.
Будет указывать новое имя атрибута для работы внутри сервиса.
Исходное имя внутри сервиса станет недоступным.

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

## Опция `inclusion` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

::: info

Начиная с версии `2.12.0` эта опция является [динамической](../options/dynamic#опция-inclusion).

:::

Эта опция является валидацией.
Эта опция является динамической.
Будет проверять чтобы переданное значение находилось в указанном массиве.
Используется метод `include?`.

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

## Опция `consists_of` <Badge type="info" text="input (^2.0.0)" /> <Badge type="info" text="internal (^2.0.0)" /> <Badge type="info" text="output (^2.0.0)" />

::: info

Начиная с версии `2.6.0` эта опция является [динамической](../options/dynamic#опция-consists-of).

:::

Эта опция является валидацией.
Эта опция является динамической.
Будет проверять чтобы каждое значение в коллекции соответствовало указанному типу (классу).
Проверяет вложенные значения.
Используется метод `is_a?`.

Работает только с типами `Array` и `Set`.
Вы можете добавить собственный тип через конфигурацию [`collection_mode_class_names`](../configuration#режим-коллекции).

Явное применение этой опции необязательно.
По умолчанию установлено значение `String`.

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

## Опция `schema` <Badge type="info" text="input (^2.0.0)" /> <Badge type="info" text="internal (^2.0.0)" /> <Badge type="info" text="output (^2.0.0)" />

::: info

Начиная с версии `2.12.0` эта опция является [динамической](../options/dynamic#опция-schema).

:::

Эта опция является валидацией.
Эта опция является динамической.
Требует значение в виде хеша, которое должно описывать структуру значения атрибута.

Работает только с типом `Hash`.
Вы можете добавить собственный тип через конфигурацию [`hash_mode_class_names`](../configuration#режим-хеша).

Явное применение опции необязательно.
Если значение схемы не указано, то валидация будет пропущена.
По умолчанию значение не указано.

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

Каждый ожидаемый ключ хеша должен быть описан в таком формате:

```ruby
{
  request_id: { type: String, required: true }
}
```

Допускаются следующие опции: обязательные `type`, `required` и опциональные `default`, `prepare`.

Если в `type` указывается значение `Hash`, то можно описать вложенность в таком же формате.

## Опция `must` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

Эта опция является валидацией.
Позволяет создавать собственные валидации.

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

## Опция `format` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

Эта опция является валидацией.
Эта опция является динамической и не входит в набор основных опций.

[Подробнее](./dynamic#опция-format)

## Опция `max` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

Эта опция является валидацией.
Эта опция является динамической и не входит в набор основных опций.

[Подробнее](./dynamic#опция-max)

## Опция `min` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

Эта опция является валидацией.
Эта опция является динамической и не входит в набор основных опций.

[Подробнее](./dynamic#опция-min)

:::

## Опция `prepare` <Badge type="info" text="input" />

Эта опция не является валидацией.
Она используется для подготовки переданного значения.

::: warning

Используйте опцию `prepare` осторожно и только для простых подготовительных действий.
Например, как показано ниже.
Любую логику, которая сложнее той что в примере ниже, лучше применять через действие [`make`](../actions/usage).

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
