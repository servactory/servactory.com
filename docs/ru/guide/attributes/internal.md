---
title: Внутренние атрибуты сервиса
description: Описание и примеры использования внутренних атрибутов сервиса
prev: Входящие атрибуты сервиса
next: Выходящие атрибуты сервиса
---

# Внутренние атрибуты

Внутренние приватные атрибуты можно добавить через метод `internal`.

## Использование

Назначение и использование внутренних атрибутов сервиса осуществляется через методы `internals=`/`internals`.

```ruby
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  internal :full_name, type: String

  # ...

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

## Опции

### Опция `type`

Эта опция является валидацией.
Будет проверять чтобы переданное значение соответствовало указанному типу (классу).
Используется метод `is_a?`.

```ruby{4,14,19}
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

## Режимы работы

Режим работы внутреннего атрибута зависит от его типа.
Каждый из режимов работы имеет набор собственных опций.

### Режим коллекции

Для того чтобы включить режим коллекции, необходимо в качестве типа внутреннего атрибута указать `Array` или `Set`.
Вы также можете указать собственный тип под задачи проекта через использование конфигурации `collection_mode_class_names`.

#### Опции

##### Опция `consists_of`

Эта опция является валидацией.
Будет проверять чтобы каждое значение в коллекции соответствовало указанному типу (классу).
Используется метод `is_a?`.

Явное применение этой опции необязательно.
По умолчанию установлено значение `String`.

```ruby
internal :ids,
         type: Array,
         consists_of: String
```

### Режим хеша

Для того чтобы включить режим хеша, необходимо в качестве типа внутреннего атрибута указать `Hash`.
Вы также можете указать собственный тип под задачи проекта через использование конфигурации `hash_mode_class_names`.

#### Опции

##### Опция `schema`

Эта опция является валидацией.
Требует значение в виде хеша, которое должно описывать структуру значения внутреннего атрибута.

Явное применение опции необязательно.
Если значение схемы не указано, то валиация будет пропущена.
По умолчанию значение не указано.

```ruby
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

Каждый ожидаемый ключ хеша должен быть описан в таком формате:

```ruby
{
  request_id: { type: String, required: true }
}
```

Допускаются следующие опции: `type`, `required` и опциональная `default`.

Если в `type` указывается значение `Hash`, то можно описать вложенность в таком же формате.


## Методы предикаты

К любому атрибуту internal можно обратиться как к методу предикату.

```ruby{8}
# ...

internal :full_name, type: String

# ...

def something
  return unless internals.full_name? # вместо `internals.full_name.present?`
  
  # ...
end
```

## Расширенный режим

Расширенный режим подразумевает более детальную работу с опцией атрибута.

### Опция `consists_of`

Опция от [режима коллекции](../attributes/internal#режим-коллекции).

```ruby
internal :ids,
         type: Array,
         consists_of: {
         type: String,
           message: "ID can only be of String type"
         }
```

```ruby
internal :ids,
         type: Array,
         # Тип элемента массива по умолчанию — String
         consists_of: {
           message: "ID can only be of String type"
         }
```
