---
title: Внутренние атрибуты сервиса
description: Описание и примеры использования внутренних атрибутов сервиса
prev: Входящие атрибуты сервиса
next: Выходящие атрибуты сервиса
---

# Внутренние атрибуты

Добавьте internal приватные атрибуты через метод `internal`.

## Использование

Назначение и доступ к internal атрибутам через методы `internals=`/`internals`.

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

Подробнее в разделе [использование опций](../options/usage).

## Хелперы

Servactory поддерживает пользовательские хелперы. Хелперы — сокращения, которые раскрываются в конкретные опции.

### Пользовательские

Добавьте пользовательские хелперы через `internal_option_helpers` в `configuration`. Хелперы могут основываться на существующих опциях.

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

Фильтрует `internals` методом `only`. Возвращает Hash с указанными атрибутами.

```ruby{2}
outputs.full_name =
  internals.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### Метод `except`

Фильтрует `internals` методом `except`. Возвращает Hash без указанных атрибутов.

```ruby{2}
outputs.full_name =
  internals.except(:gender)
    .values
    .compact
    .join(" ")
```

### Методы предикаты

Любой internal атрибут доступен как метод-предикат.

```ruby{8}
# ...

internal :full_name, type: String

# ...

def something
  return unless internals.full_name? # вместо `internals.full_name.present?`
  
  # ...
end
```
