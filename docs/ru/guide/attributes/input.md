---
title: Входящие атрибуты сервиса
description: Описание и примеры использования входящих атрибутов сервиса
prev: Вызов сервиса и результат его работы
next: Внутренние атрибуты сервиса
---

# Входящие атрибуты

Все атрибуты, которые должен ожидать сервис при вызове необходимо добавить с использованием метода `input`.
Если сервис будет получать атрибуты, которые не были добавлены через метод `input`, то он будет возвращать ошибку.

## Использование

Использование входящих в сервис атрибутов осуществляется через метод `inputs`.

```ruby{2-4,15-17}
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  internal :full_name, type: String

  output :user, type: User

  make :assign_full_name
  make :create!

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

Подробнее про опции вы можете узнать в разделе [использования опций](../options/usage).

## Хелперы

Servactory имеет набор готовых хелперов, а также позволяет добавлять пользовательские хелперы под цели проекта.

Под "хелпером" подразумевается некоторое сокращенное написание, которое при использовании раскрывается в конкретную опцию.

### Хелпер `optional`

Этот хелпер эквивалентен опции `required: false`.

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

Такие хелперы могут быть основаны на существующих опциях.

[Пример конфигурации](../configuration#хелперы-для-input)

#### Пример с `must`

```ruby{3}
class PaymentsService::Create < ApplicationService::Base
  input :invoice_numbers,
        :must_be_6_characters,
        type: Array,
        consists_of: String

  # ...
end
```

#### Пример с `prepare`

```ruby{3}
class PaymentsService::Create < ApplicationService::Base
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
