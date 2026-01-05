---
title: Входящие атрибуты сервиса
description: Описание и примеры использования входящих атрибутов сервиса
prev: Вызов сервиса и результат его работы
next: Внутренние атрибуты сервиса
---

# Входящие атрибуты

Добавьте все ожидаемые атрибуты через метод `input`. Неожиданные атрибуты вызывают ошибку.

## Использование

Доступ к input атрибутам через метод `inputs`.

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

Подробнее в разделе [использование опций](../options/usage).

## Хелперы

Servactory предоставляет встроенные хелперы и поддерживает пользовательские. Хелперы — сокращения, которые раскрываются в конкретные опции.

### Хелпер `optional`

Эквивалент опции `required: false`.

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

Добавьте пользовательские хелперы через `input_option_helpers` в `configuration`. Хелперы могут основываться на существующих опциях.

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

## Методы

### Метод `only`

Фильтрует `inputs` методом `only`. Возвращает Hash с указанными атрибутами.

```ruby{2}
outputs.full_name =
  inputs.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### Метод `except`

Фильтрует `inputs` методом `except`. Возвращает Hash без указанных атрибутов.

```ruby{2}
outputs.full_name =
  inputs.except(:gender)
    .values
    .compact
    .join(" ")
```

### Методы предикаты

Любой input атрибут доступен как метод-предикат.

```ruby{6}
input :first_name, type: String

# ...

def something
  return unless inputs.user? # вместо `inputs.user.present?`
  
  # ...
end
```
