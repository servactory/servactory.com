---
title: Выходящие атрибуты сервиса
description: Описание и примеры использования выходящих атрибутов сервиса
prev: Внутренние атрибуты сервиса
next: Действия в сервисе
---

# Выходящие атрибуты сервиса

Все атрибуты, которые должен возвращать сервис в `Result` необходимо добавить с использованием метода `output`.

## Использование

Назначение и использование выходящих атрибутов сервиса осуществляется через методы `outputs=`/`outputs` или их алиасы `out=`/`out`.

```ruby
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  output :full_name, type: String

  # ...

  def assign_full_name
    outputs.full_name = [
      inputs.first_name,
      inputs.middle_name,
      inputs.last_name
    ].compact.join(" ")
    # или
    # out.full_name = [
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
Будет проверяться чтобы переданное как output значение соответствовало указанному типу (классу).
Используется метод `is_a?`.

```ruby{4,11}
class NotificationService::Create < ApplicationService::Base
  input :user, type: User

  output :notification, type: Notification

  make :create_notification!

  private

  def create_notification!
    outputs.notification = Notification.create!(user: inputs.user)
  end
end
```

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
