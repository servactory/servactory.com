---
title: Раннее успешное завершение
description: Описание и примеры использования раннего ручного успешного завершения работы сервиса
prev: Группирование действий в сервисе
next: Неудачи и обработка ошибок
---

# Раннее успешное завершение <Badge type="tip" text="Начиная с 2.2.0" />

Завершите работу сервиса преждевременно и успешно вызовом метода `success!`.

Для Servactory это тоже является исключением, но успешным.

## Использование

Пример: сервис нотификации, работающий в зависимости от среды.

```ruby
class NotificatorService::Slack::Error::Send < ApplicationService::Base
  # ...
  
  make :check_environment!

  make :send_message!
  
  private
  
  def check_environment!
    return if Rails.env.production?
    
    success!
  end
  
  def send_message!
    # Здесь выполняется API запрос в Slack
  end
end
```

Этот сервис сразу завершается успехом в средах, отличных от продакшена.
Особенно полезно в сложных реализациях с множеством условий.
