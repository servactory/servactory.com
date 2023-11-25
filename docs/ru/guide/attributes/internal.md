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

Подробнее про опции вы можете узнать в разделе [использования опций](../options/usage).

## Режимы работы

Подробнее про режимы работы вы можете узнать в разделе [режимов опций](../options/modes).

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
