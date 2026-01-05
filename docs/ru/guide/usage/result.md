---
title: Результат работы сервиса
description: Описание и примеры использования результата работы сервиса
prev: Вызов сервиса
next: Информация о сервисе
---

# Результат работы сервиса

Каждый вызов сервиса возвращает результат (если не выброшено исключение). Результат может быть успешным или провальным.

## Успешный результат

Успешный результат означает, что все операции завершились без проблем.

Пример:

```ruby
service_result = UsersService::Accept.call(user: User.first)
```

Возвращает:

```ruby
# => <ApplicationService::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

## Провальный результат

Провальный результат означает, что внутри произошла ожидаемая проблема. Ожидаемые проблемы не выбрасывают исключений — они вызываются через методы `fail!`.

Провальный результат возможен только при вызове через метод `.call`. Это позволяет обрабатывать ответы от внешних API.

Пример результата при неудаче:

```ruby
# => <ApplicationService::Result @error=There is some problem with the user, @failure?=true, @success?=false>
```

## Содержимое результата

`Result` содержит данные независимо от исхода.

При успехе доступны все output атрибуты. Методы-хелперы `success?` и `failure?` определяют результат.

```ruby
service_result = UsersService::Accept.call(user: User.first)

service_result.success? # => true
service_result.failure? # => false
```

При неудаче `Result` также содержит `error` с полным описанием ошибки.

```ruby
service_result = UsersService::Accept.call(user: User.first)

service_result.success? # => false
service_result.failure? # => true

service_result.error
# => #<ApplicationService::Exceptions::Failure: There is some problem with the user>
```

Подробнее о неудачной работе сервиса [здесь](../exceptions/failure).

## Обработка результата

Обработайте результат после вызова через `call`.

Два варианта: методы `success?`/`failure?` или хуки `on_success`/`on_failure`.

### Методы

#### Метод `success?`

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return if service_result.success?

fail!(
  message: "The message was not sent to Slack",
  meta: { reason: service_result.error.message }
)
```

#### Метод `failure?`

Передайте тип в `failure?` для проверки конкретных типов неудач. См. [типы неудач](../exceptions/failure#метод-fail). Тип по умолчанию — `all` (любой тип неудачи).

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return unless service_result.failure?

fail!(
  message: "The message was not sent to Slack", 
  meta: { reason: service_result.error.message }
)
```

Проверка конкретного типа неудачи:

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return unless service_result.failure?(:validation)

fail!(
    message: "The message was not sent to Slack",
    meta: { reason: service_result.error.message }
)
```

Методы-предикаты для удобной проверки типов:

::: warning

Output атрибуты `Result` также имеют методы-предикаты. Избегайте конфликтов имён.

:::

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return unless service_result.all?

fail!(
  message: "The message was not sent to Slack",
  meta: { reason: service_result.error.message }
)
```

### Хуки

Альтернативный подход к обработке результата:

```ruby
NotificatorService::Slack::Error::Send
  .call(...)
  .on_failure do |exception:| 
    fail!(
      message: "The message was not sent to Slack", 
      meta: { reason: exception.message }
    )
  end
```

Метод `on_success` предоставляет аргумент `outputs` со всеми output атрибутами. Передайте тип в `on_failure`:

```ruby
NotificatorService::Slack::Error::Send
  .call(...)
  .on_success do |outputs:|
    notification.update!(original_data: outputs.response)
  end.on_failure(:all) do |exception:| 
    fail!(
      message: "The message was not sent to Slack", 
      meta: { reason: exception.message }
    )
  end
```
