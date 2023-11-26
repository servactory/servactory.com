---
title: Выходящие атрибуты сервиса
description: Описание и примеры использования выходящих атрибутов сервиса
prev: Внутренние атрибуты сервиса
next: Действия в сервисе
---

# Выходящие атрибуты

Все атрибуты, которые должен возвращать сервис в результате через класс `Result`
необходимо добавить с использованием метода `output`.

## Использование

Назначение и использование выходящих атрибутов сервиса осуществляется через методы `outputs=`/`outputs`.

```ruby{8,22}
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  internal :full_name, type: String

  output :user, type: User # [!code focus]

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

## Режимы работы

Подробнее про режимы работы вы можете узнать в разделе [режимов опций](../options/modes).

## Методы предикаты

К любому атрибуту output можно обратиться как к методу предикату.


```ruby{8}
# ...

output :full_name, type: String

# ...

def something
  return unless outputs.full_name? # вместо `outputs.full_name.present?`
  
  # ...
end
```
