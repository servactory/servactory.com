---
title: Выходящие атрибуты сервиса
---

# Выходящие атрибуты сервиса

Все атрибуты, которые должен возвращать сервис в `Result` должны быть описаны через метод `output`.

## Использование

Назначение и использование выходящих атрибутов сервиса осуществляется через методы `outputs=`/`outputs` или их алиасы `out=`/`out`.

```ruby
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  output :full_name, type: String

  # ...

  def something
    outputs.full_name = [inputs.first_name, inputs.middle_name, inputs.last_name].compact.join(" ")
    # или
    # out.full_name = [inp.first_name, inp.middle_name, inp.last_name].compact.join(" ")
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

У любого output'а есть метод с вопросительным знаком.
С логикой обработки данных можно ознакомиться [здесь](https://github.com/servactory/servactory/blob/main/lib/servactory/utils.rb#L39-L52).

```ruby{8}
# ...

output :full_name, type: String

# ...

def something
  return unless outputs.full_name? # вместо `outputs.full_name.present?`
  
  # ...
end
```
