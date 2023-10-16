---
title: Почему Servactory
---

# Почему Servactory

## Что это такое?

Servactory — это стандартизация единого подхода к разработке надежных сервисов любой сложности.

При помощи Servactory можно сделать что-то простое, например:

```ruby
class MinimalService < ApplicationService::Base
  def call
    # ...
  end
end
```

А затем вызвать с помощью:

```ruby
MinimalService.call! # или MinimalService.call
```

Или создать что-то более сложное:

```ruby
class NotificationService::Send < ApplicationService::Base
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

С таким вызовом:

```ruby
# comment = Comment.first
# provider = NotificationProvider.first

NotificationService::Send.call!(comment:, provider:)
# Или 
# NotificationService::Send.call(comment:, provider:)
```

## Зачем использовать?

### Единый подход

Язык Ruby многогранен.
Это приводит к тому, что сервисы в приложениях начинают сильно различаться, реализуя разный подход к разработке.
Со временем это усложняет разработку в проекте и может затруднить понимание сервисов и кода в целом.

Servactory стандартизирует подход к разработке, предлагая реализовать сервисы только через предложенный API, однообразно описывая логику внутри классов.
