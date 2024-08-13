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

```ruby{6,14,22}
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

Servactory позволяет добавлять пользовательские хелперы под цели проекта.

Под "хелпером" подразумевается некоторое сокращенное написание, которое при использовании раскрывается в конкретную опцию.

### Пользовательские

Пользовательские хелперы можно добавить используя метод `internal_option_helpers` в `configuration`.

Такие хелперы могут быть основаны на существующих опциях.

[Пример конфигурации](../configuration#хелперы-для-internal)

#### Пример с `must`

```ruby{5}
class PaymentsService::Create < ApplicationService::Base
  # ...

  internal :invoice_numbers,
           :must_be_6_characters,
           type: Array,
           consists_of: String

  # ...
end
```

## Методы

### Метод `only`

По необходимости можно отфильтровать `internals` при помощи метода `only`.
Это будет возвращать Hash с указанными атрибутами.

```ruby{2}
outputs.full_name =
  internals.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### Метод `except`

По необходимости можно отфильтровать `internals` при помощи метода `except`.
Это будет возвращать Hash без указанных атрибутов.

```ruby{2}
outputs.full_name =
  internals.except(:gender)
    .values
    .compact
    .join(" ")
```

### Методы предикаты

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
