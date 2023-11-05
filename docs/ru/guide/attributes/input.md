---
title: Входящие атрибуты сервиса
description: Описание и примеры использования входящих атрибутов сервиса
prev: Начало работы
next: Внутренние атрибуты сервиса
---

# Входящие атрибуты сервиса

Все атрибуты, которые должен ожидать сервис при вызове необходимо добавить с использованием метода `input`.
Если сервис будет получать атрибуты, которые не были добавлены через метод `input`, то он будет возвращать ошибку.

## Использование

Использование входящих в сервис атрибутов осуществляется через метод `inputs`.

```ruby
class UsersService::Create < ApplicationService::Base
  input :nickname, type: String

  # ...

  def create!
    outputs.user = User.create!(nickname: inputs.nickname)
  end
end
```

## Опции

### Опция `type`

Эта опция является валидацией.
Будет проверяться чтобы переданное как input значение соответствовало указанному типу (классу).
Используется метод `is_a?`.

Всегда обязательно для указания. Может содержать один или несколько классов.

```ruby{3}
class UsersService::Accept < ApplicationService::Base
  input :user,
        type: User

  # ...
end
```

```ruby{3}
class ToggleService < ApplicationService::Base
  input :flag,
        type: [TrueClass, FalseClass]

  # ...
end
```

### Опция `required`

Эта опция является валидацией.
Будет проверяться чтобы переданное как input значение не было пустым.
Используется метод `present?` чтобы проверить, является ли значение не `nil` или не пустой строкой.

По умолчанию `required` имеет значение `true`.

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

### Опция `as`

Эта опция не является валидацией.
Она используется для подготовки атрибута input.
Для атрибута input будет назначено новое имя, которое указано через опцию `as`.
Исходное имя внутри сервиса станет недоступным.

```ruby{3,14}
class NotificationService::Create < ApplicationService::Base
  input :customer,
        as: :user,
        type: User

  output :notification,
         type: Notification

  make :create_notification!

  private

  def create_notification!
    outputs.notification = Notification.create!(user: inputs.user)
  end
end
```

### Опция `inclusion`

Эта опция является валидацией.
Будет проверяться чтобы переданное как input значение находилось в указанном массиве.
Используется метод `include?`.

```ruby{4}
class EventService::Send < ApplicationService::Base
  input :event_name,
        type: String,
        inclusion: %w[created rejected approved]

  # ...
end
```

### Опция `must`

Эта опция является валидацией.
Но в отличие от других валидационных опций, `must` позволяет описывать любого вида валидацию внутри себя.

```ruby{5-9}
class PymentsService::Send < ApplicationService::Base
  input :invoice_numbers,
        type: String,
        array: true,
        must: {
          be_6_characters: {
            is: ->(value:) { value.all? { |id| id.size == 6 } }
          }
        }

  # ...
end
```

### Опция `prepare`

Эта опция не является валидацией.
Она используется для подготовки значения атрибута input.

::: warning

Используйте опцию `prepare` осторожно и только для простых действий.

:::

```ruby{5}
class PymentsService::Send < ApplicationService::Base
  input :amount_cents,
        as: :amount,
        type: Integer,
        prepare: ->(value:) { Money.from_cents(value, :USD) }

  # затем в сервисе используется `inputs.amount`

  # ...
end
```

## Режимы

Режим работы входящего атрибута зависит от его типа.
Каждый из режимов работы имеет набор собственных опций.

### Режим коллекции

Для того чтобы включить режим коллекции, необходимо в качестве типа входящего атрибута указать `Array` или `Set`.
Вы также можете указать собственный тип под задачи проекта через использование конфигурации `collection_mode_class_names`.

#### Опции

##### Опция `consists_of`

Эта опция является валидацией.
Будет проверяться чтобы каждое значение в коллекции соответствовало указанному типу (классу).
Используется метод `is_a?`.

Явное применение опции необязательно.
По умолчанию установлено значение `String`.

```ruby
input :ids,
      type: Array,
      consists_of: String
```

```ruby
input :ids,
      type: Array,
      # Тип элемента массива по умолчанию — String
      consists_of: { message: "ID can only be of String type" }
```

```ruby
input :ids,
      type: Array,
      consists_of: { type: String, message: "ID can only be of String type" }
```

### Режим хеша

Для того чтобы включить режим хеша, необходимо в качестве типа входящего атрибута указать одноименный класс `Hash`.
Вы также можете указать собственный тип под задачи проекта через использование конфигурации `hash_mode_class_names`.

#### Опции

##### Опция `schema`

Эта опция является валидацией.
Требует значение в виде хеша, которое должно описывать структуру значения входящего атрибута.

Явное применение опции необязательно.
В таком случае проверка будет пропущена.

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

Каждый ожидаемый ключ хеша должен быть описан в таком формате:

```ruby
{
  request_id: { type: String, required: true }
}
```

Допускаются следующие опции: `type`, `required` и опциональная `default`.

Если в `type` указывается значение `Hash`, то можно описать вложенность в таком же формате.

## Хелперы

Servactory имеет набор готовых хелперов, а также позволяет добавлять пользовательские хелперы под цели проекта.

Под хелпером подразумевается некоторое сокращенное написание, которое при использовании раскрывается в конкретную опцию.

### Хелпер `optional`

Этот хелпер эквивалентен `required: false`.

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

### Пользовательские

Пользовательские хелперы можно добавить используя метод `input_option_helpers` в `configuration`.

Такие хелперы могут быть основаны на опциях `must` и `prepare`.

[Пример конфигурации](../configuration.md#хелперы-для-input)

#### Пример с `must`

```ruby{3}
class PymentsService::Send < ApplicationService::Base
  input :invoice_numbers,
        :must_be_6_characters,
        type: String,
        array: true

  # ...
end
```

#### Пример с `prepare`

```ruby{3}
class PymentsService::Send < ApplicationService::Base
  input :amount_cents,
        :to_money,
        as: :amount,
        type: Integer

  # ...
end
```

## Методы предикаты

К любому атрибуту input можно обратиться как к методу предикату.

```ruby{6}
input :first_name, type: String

# ...

def something
  return unless inputs.user? # вместо `inputs.user.present?`
  
  # ...
end
```

## Расширенный режим

Расширенный режим подразумевает более детальную работу с опцией атрибута.

### Опция `required`

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

### Опция `inclusion`

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

### Опция `must`

::: info

Опция `must` может работать только в расширенном режиме.

:::

```ruby
input :invoice_numbers,
      type: String,
      array: true,
      must: {
        be_6_characters: {
          is: ->(value:) { value.all? { |id| id.size == 6 } }
        }
      }
```

```ruby
input :invoice_numbers,
      type: String,
      array: true,
      must: {
        be_6_characters: {
          is: ->(value:) { value.all? { |id| id.size == 6 } },
          message: lambda do |service_class_name:, input:, value:, code:|
            "Wrong IDs in `#{input.name}`"
          end
        }
      }
```
