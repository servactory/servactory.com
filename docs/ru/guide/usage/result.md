---
title: Результат работы сервиса
description: Описание и примеры использования результата работы сервиса
prev: Вызов сервиса
next: Информация о сервисе
---

# Результат работы сервиса

Сервис после вызова имеет результата работы, если до этого не было выкинуто исключение.
Результат работы может быть успешный и провальный.

## Успешный результат

Успешный результат — это результат работы сервиса, когда внутри все прошло без каких-либо проблем.

В таком случае этот пример:

```ruby
service_result = UsersService::Accept.call(user: User.first)
```

Будет возвращать это:

```ruby
# => <ApplicationService::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

## Провальный результат

Провальный результат — это результат работы сервиса, когда внутри произошла ожидаемая проблема.
Под ожидаемой проблемой имеется ввиду что не было получено исключение, а возникшая проблема, например, была вызвана через один из `fail!` методов.

Провальный результат работы сервиса может присутствовать только при вызове через `.call`, метод.
Это необходимо, например, чтобы иметь возможность обработать результат ответа от внешнего API.

Пример результата при возникшей проблеме:

```ruby
# => <ApplicationService::Result @error=There is some problem with the user, @failure?=true, @success?=false>
```

## Содержимое результата

`Result` независимо от успеха или провала имеет набор данных.

При успешной работе доступны все output атрибуты,
а также доступны методы хелперы `success?` и `failure?`,
которые могут помочь определить сценарий для дальнейшей работы.

```ruby
service_result = UsersService::Accept.call(user: User.first)

service_result.success? # => true
service_result.failure? # => false
```

При неудачной работе сервиса `Result` будет также содержать `error` с полным описанием ошибки.

```ruby
service_result = UsersService::Accept.call(user: User.first)

service_result.success? # => false
service_result.failure? # => true

service_result.error
# => #<ApplicationService::Exceptions::Failure: There is some problem with the user>
```

Про неудачную работу сервиса вы можете более подробно узнать [здесь](../exceptions/failure).

## Обработка результата

После вызова сервиса через `call` вы можете обработать его результат.

Для этого существует два варианта — при помощи методов `success?` и `failure?` или при помощи хуков `on_success` и `on_failure`.

### Методы

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return if service_result.success? # или `unless service_result.failure?`

fail!(
  message: "The message was not sent to Slack", 
  meta: { reason: service_result.error.message }
)
```

В метод `failure?` можно передать тип. Подробнее про типы вы можете узнать [здесь](../exceptions/failure#метод-fail).
Это дает возможность указать интересующий вас тип при обработке неудачного результата.
По умолчанию `type` имеет значение `all`, что означает любой тип неудачи, включая ваши собственные типы.

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return unless service_result.failure?(:all)

fail!(
  message: "The message was not sent to Slack", 
  meta: { reason: service_result.error.message }
)
```

### Хуки

Это альтернативный вариант обработки результата.

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

Метод `on_success` имеет аргумент `outputs`, который предоставляет доступ ко всем output атрибутам.

В метод `on_failure` также можно передать тип.

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
