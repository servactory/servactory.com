---
title: Использование опций в атрибутах
description: Описание и примеры использования опций для всех атрибутов сервиса
prev: Выходящие атрибуты сервиса
next: Расширенный режим опций
---

# Использование опций в атрибутах

## Опция `type` <Badge type="info" text="input" /> <Badge type="info" text="internal" /> <Badge type="info" text="output" />

Опция валидации. Проверяет соответствие переданного значения указанному типу (классу) через `is_a?`.

Обязательна. Может содержать один или несколько классов.

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

Опция валидации. Проверяет, что переданное значение не пустое, через `present?`.

По умолчанию `true`.

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

Не является валидацией. Назначает значение, если оно не передано в сервис.

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

Не является валидацией. Указывает псевдоним атрибута для работы внутри сервиса. Исходное имя становится недоступным.

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

Динамическая опция валидации. Проверяет, что переданное значение находится в указанном массиве, через `include?`.

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

Динамическая опция валидации. Проверяет соответствие каждого значения в коллекции указанному типу (классу), включая вложенные значения, через `is_a?`.

Работает только с типами `Array` и `Set`. Добавьте собственный тип через конфигурацию [`collection_mode_class_names`](../configuration#режим-коллекции).

Необязательна. По умолчанию `String`.

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

Динамическая опция валидации. Требует хеш, описывающий структуру значения атрибута.

Работает только с типом `Hash`. Добавьте собственный тип через конфигурацию [`hash_mode_class_names`](../configuration#режим-хеша).

Необязательна. Если не указана, валидация пропускается. Значения по умолчанию нет.

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

Описывайте каждый ожидаемый ключ хеша в таком формате:

```ruby
{
  request_id: { type: String, required: true }
}
```

Допустимые опции: обязательные `type`, `required` и опциональные `default`, `prepare`. Опции `default` и `prepare` доступны только внутри `input`.

Если `type` указывает `Hash`, описывайте вложенность в таком же формате.

## Опция `must` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

Опция валидации. Создавайте собственные валидации.

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

## Опция `format` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

Динамическая опция валидации (не входит в основные). См. [подробнее](./dynamic#опция-format).

## Опция `max` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

Динамическая опция валидации (не входит в основные). См. [подробнее](./dynamic#опция-max).

## Опция `min` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

Динамическая опция валидации (не входит в основные). См. [подробнее](./dynamic#опция-min).

## Опция `target` <Badge type="info" text="input (^3.0.0)" /> <Badge type="info" text="internal (^3.0.0)" /> <Badge type="info" text="output (^3.0.0)" />

Динамическая опция валидации для атрибутов типа Class (не входит в основные). См. [подробнее](./dynamic#опция-target).

## Опция `prepare` <Badge type="info" text="input" />

Не является валидацией. Подготавливает переданное значение.

::: warning

Используйте `prepare` осторожно, только для простых действий. Сложную логику лучше применять через действие [`make`](../actions/usage).

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
