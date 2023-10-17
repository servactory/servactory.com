---
title: Входящие атрибуты сервиса
description: Описание и примеры использования входящих аргументов сервиса
next: Внутренние атрибуты сервиса
---

# Входящие атрибуты сервиса

Все атрибуты, которые должен ожидать сервис должны быть описаны через метод `input`.
Если сервис будет получать атрибут, который не был описан через метод `input`, то он будет возвращать ошибку.

## Использование

Использование входящих в сервис атрибутов осуществляется через метод `inputs` или его алиас `inp`.

```ruby
class UsersService::Create < ApplicationService::Base
  input :nickname, type: String

  # ...

  def create!
    outputs.user = User.create!(nickname: inputs.nickname)
    # или
    # outputs.user = User.create!(nickname: inp.nickname)
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
Она используется для подготовки input-атрибута.
Для input-атрибута будет назначено указанное через `as` имя.

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

### Опция `array`

Эта опция является валидацией.
Будет проверяться чтобы переданное как input значение было массивом и соответствовало указанному типу (классу).
Используется метод `is_a?`. Работает совместно с опциями [`type`](#опция-type) и [`required`](#опция-required).

```ruby{4}
class PymentsService::Send < ApplicationService::Base
  input :invoice_numbers,
        type: String,
        array: true

  # ...
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
Но в отличие от других валидационных опций, `must` позволяет описывать валидацию внутри себя.

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
Она используется для подготовки значения input-атрибута.

::: warning

Используйте опцию `prepare` осторожно и только для простых действий.

:::

```ruby{5}
class PymentsService::Send < ApplicationService::Base
  input :amount_cents,
        as: :amount,
        type: Integer,
        prepare: ->(value:) { Money.new(cents: value, currency: :USD) }

  # затем в сервисе используется `inputs.amount`

  # ...
end
```

## Хелперы

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

### Хелпер `as_array`

Этот хелпер эквивалентен `array: true`.

```ruby{3}
class PymentsService::Send < ApplicationService::Base
  input :invoice_numbers,
        :as_array,
        type: String

  # ...
end
```

### Пользовательские

Есть возможность добавлять пользовательские хелперы.
Они основываются на опциях `must` и `prepare`.

Добавление выполняется через метод `input_option_helpers` в `configuration`.

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

У любого input'а есть метод с вопросительным знаком.
С логикой обработки данных можно ознакомиться [здесь](https://github.com/servactory/servactory/blob/main/lib/servactory/utils.rb#L39-L52).

```ruby{6}
input :first_name, type: String

# ...

def something
  return unless inputs.user? # вместо `inputs.user.present?`
  
  # ...
end
```

## Расширенный режим

Расширенный режим подразумевает более детальную работу с опцией.

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
