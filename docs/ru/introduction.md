---
title: Почему Servactory
description: Введение в Servactory — унифицированный подход к разработке надежных Ruby/Rails сервисов
prev: false
next: Начало работы
---

# Почему Servactory

## Что это такое?

Servactory стандартизирует разработку надежных сервисов любой сложности.

Создавайте простые сервисы:

```ruby
class MinimalService < ApplicationService::Base
  def call
    # ...
  end
end
```

Затем вызовите:

```ruby
MinimalService.call! # или MinimalService.call
```

Или создавайте сложные сервисы:

```ruby
class NotificationsService::Send < ApplicationService::Base
  input :comment, type: Comment
  input :provider, type: NotificationProvider

  internal :user, type: User
  internal :status, type: String
  internal :response, type: NotificatorApi::Models::Notification

  output :notification, type: Notification

  make :assign_user
  make :assign_status

  make :create_notification!
  make :send_notification
  make :update_notification!
  make :update_comment!
  make :assign_status

  private

  def assign_user
    internals.user = inputs.comment.user
  end

  def assign_status
    internals.status = StatusEnum::NOTIFIED
  end

  def create_notification!
    outputs.notification = Notification.create!(user:, comment: inputs.comment, provider: inputs.provider)
  end

  def send_notification
    service_result = NotificatorService::API::Send.call(notification: outputs.notification)

    return fail!(message: service_result.error.message) if service_result.failure?

    internals.response = service_result.response
  end

  def update_notification!
    outputs.notification.update!(original_data: internals.response)
  end

  def update_comment!
    inputs.comment.update!(status: internals.status)
  end
end
```

Вызов:

```ruby
# comment = Comment.first
# provider = NotificationProvider.first

NotificationsService::Send.call!(comment:, provider:)
# Или 
# NotificationsService::Send.call(comment:, provider:)
```

## Зачем использовать?

### Единый подход

Гибкость Ruby приводит к несогласованным реализациям сервисов в приложениях. Со временем это усложняет разработку и понимание кода.

Servactory обеспечивает единый API для реализации сервисов, гарантируя одинаковую структуру логики во всех классах.

### Тестирование

Тестируйте сервисы Servactory как стандартные Ruby классы. Единый подход обеспечивает согласованные паттерны тестирования.
