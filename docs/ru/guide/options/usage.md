---
title: Использование опций атрибутов
description: Описание и примеры использования опций для всех атрибутов сервиса
prev: false
next: false
---

# Использование опций

## Опция `type` <Badge type="tip" text="input" /> <Badge type="tip" text="internal" /> <Badge type="tip" text="output" />

Эта опция является валидацией.
Будет проверять чтобы переданное значение соответствовало указанному типу (классу).
Используется метод `is_a?`.

Всегда обязательно для указания. Должно содержать один или несколько классов.

::: code-group

```ruby{2,8} [input]
class UsersService::Accept < ApplicationService::Base
  input :user, type: User

  # ...
end

class FeaturesService::Enable < ApplicationService::Base
  input :flag, type: [TrueClass, FalseClass]

  # ...
end
```

```ruby{4,14,19} [internal]
class NotificationsService::Create < ApplicationService::Base
  input :user, type: User

  internal :inviter, type: User

  output :notification, type: Notification

  make :assign_inviter
  make :create_notification!

  private

  def assign_inviter
    internals.inviter = inputs.user.inviter
  end

  def create_notification!
    outputs.notification =
      Notification.create!(user: inputs.user, inviter: internals.inviter)
  end
end
```

```ruby{4,11} [output]
class NotificationsService::Create < ApplicationService::Base
  input :user, type: User

  output :notification, type: Notification

  make :create_notification!

  private

  def create_notification!
    outputs.notification = Notification.create!(user: inputs.user)
  end
end
```

:::

## Опция `required` <Badge type="tip" text="input" />

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

## Опция `default` <Badge type="tip" text="input" />

Эта опция не является валидацией.
Будет указывать значение для атрибута, если оно не было передано в сервис.

::: code-group

```ruby [input]
# soon
```

:::

## Опция `as` <Badge type="tip" text="input" />

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

## Опция `inclusion` <Badge type="tip" text="input" />

Эта опция является валидацией.
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

:::

## Опция `consists_of` <Badge type="tip" text="input" /> <Badge type="tip" text="internal" /> <Badge type="tip" text="output" />

Подробнее про эту опцию вы можете узнать в разделе расширенной работы [режима коллекции](../options/modes#опция-consists-of).

## Опция `schema` <Badge type="tip" text="input" /> <Badge type="tip" text="internal" /> <Badge type="tip" text="output" />

Подробнее про эту опцию вы можете узнать в разделе расширенной работы [режима коллекции](../options/modes#опция-schema).

## Опция `must` <Badge type="tip" text="input" />

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
            is: ->(value:) { value.all? { |id| id.size == 6 } }
          }
        }

  # ...
end
```

:::

## Опция `prepare` <Badge type="tip" text="input" />

Эта опция не является валидацией.
Она используется для подготовки переданное значения.

::: warning

Используйте опцию `prepare` осторожно и только для простых подготовительных действий.

:::

::: code-group

```ruby{5,11} [input]
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
