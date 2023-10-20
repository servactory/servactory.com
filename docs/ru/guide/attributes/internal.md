---
title: Внутренние атрибуты сервиса
description: Описание и примеры использования внутренних атрибутов сервиса
prev: Входящие атрибуты сервиса
next: Выходящие атрибуты сервиса
---

# Внутренние атрибуты сервиса

Внутренние приватные атрибуты можно добавить через метод `internal`.

## Использование

Назначение и использование внутренних атрибутов сервиса осуществляется через методы `internals=`/`internals` или их алиасы `int=`/`int`.

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
    ].compact.join(" ")
    # или
    # int.full_name = [
    #   inp.first_name,
    #   inp.middle_name,
    #   inp.last_name
    # ].compact.join(" ")
  end
end
```

## Опции

### Опция `type`

Эта опция является валидацией.
Будет проверяться чтобы переданное как internal значение соответствовало указанному типу (классу).
Используется метод `is_a?`.

```ruby{4,14}
class NotificationService::Create < ApplicationService::Base
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
    outputs.notification = Notification.create!(user: inputs.user, inviter: internals.inviter)
  end
end
```

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
