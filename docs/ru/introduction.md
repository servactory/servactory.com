---
title: Почему Servactory
description: Обзор возможностей и преимуществ Servactory
prev: false
next: Начало работы
---

# Почему Servactory

## Что такое Servactory?

Servactory — это современный фреймворк для стандартизации разработки сервисных объектов в Ruby/Rails приложениях. Он предоставляет единый подход к созданию надежных и поддерживаемых сервисов любой сложности.

## Простота использования

Servactory позволяет создавать как простые, так и сложные сервисы с минимальными усилиями:

### Простой сервис

```ruby
class MinimalService < ApplicationService::Base
  def call
    # Ваша бизнес-логика
  end
end
```

```ruby
# Использование
MinimalService.call! # или MinimalService.call
```

### Сложный сервис

```ruby
class NotificationsService::Send < ApplicationService::Base
  # Определение входных параметров
  input :comment, type: Comment
  input :provider, type: NotificationProvider

  # Внутренние переменные
  internal :user, type: User
  internal :status, type: String
  internal :response, type: NotificatorApi::Models::Notification

  # Выходные данные
  output :notification, type: Notification

  # Последовательность действий
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
    outputs.notification = Notification.create!(
      user: internals.user,
      comment: inputs.comment,
      provider: inputs.provider
    )
  end

  def send_notification
    service_result = NotificatorService::API::Send.call(
      notification: outputs.notification
    )

    return fail!(message: service_result.error.message) if service_result.failure?

    internals.response = service_result.response
  end

  def update_notification!
    outputs.notification.update!(
      original_data: internals.response
    )
  end

  def update_comment!
    inputs.comment.update!(
      status: internals.status
    )
  end
end
```

```ruby
# Использование
NotificationsService::Send.call!(comment:, provider:)
# или
NotificationsService::Send.call(comment:, provider:)
```

## Преимущества использования

### 1. Единый подход к разработке

Ruby предоставляет множество способов решения задач, что может привести к несогласованности в коде. Servactory стандартизирует подход к разработке сервисов, предлагая:

- Единый API для создания сервисов
- Стандартизированную структуру классов
- Предсказуемое поведение сервисов

### 2. Надежность и безопасность

Servactory обеспечивает:

- Строгую типизацию входных и выходных данных
- Валидацию параметров
- Обработку ошибок
- Предсказуемое поведение при сбоях

### 3. Удобство поддержки

Благодаря стандартизированному подходу:

- Код легче понимать и поддерживать
- Новые разработчики быстрее входят в проект
- Уменьшается количество ошибок
- Упрощается рефакторинг

### 4. Расширяемость

Servactory предоставляет:

- Гибкую систему конфигурации
- Возможность создания собственных расширений
- Интеграцию с популярными инструментами тестирования
