---
title: Вызов сервиса и результат его работы
description: Описание и примеры использования вызова сервиса, а также информация про результата его работы
prev: Начало работы
next: Входящие атрибуты сервиса
---

# Вызов сервиса и результат его работы

## Вызов сервиса

Сервисы могут быть вызваны только через методы `.call` и `.call!`.

### Через `.call!`

Вызов сервиса через метод `.call!` будет завершать работу с ошибкой при любом виде исключения.

```ruby
UsersService::Accept.call!(user: User.first)
```

### Через `.call`

Вызов сервиса через метод `.call` будет завершать работу с ошибкой только в том случае, если он перехватит исключение в атрибутах input.
Errors that occurred with the internal and output attributes, as well as errors that occurred in methods, will all be collected in the `Result` of the service.

```ruby
UsersService::Accept.call(user: User.first)
```

## Результат

Все сервисы имеют результат своей работы. Например, в случае успеха этот вызов:

```ruby
service_result = UsersService::Accept.call(user: User.first)
```

Будет возвращать это:

```ruby
#<Servactory::Result @user=...>
```

И затем можно работать с этим результатом, например, таким образом:

```ruby
Notification::SendJob.perform_later(service_result.user.id)
```

### Содержимое результата

#### Выходящие атрибуты

Все что было добавлено через метод `output` в сервисе будет доступно в `Result`.

Output'ы в `Result` имеют методы предикаты аналогично тому как внутри сервиса.

#### Хелперы

В результате работы сервиса присутствуют методы `success?` и `failure?`,
которые могут помочь определить сценарий для дальнейшей обработки.

```ruby
service_result.success? # => true
service_result.failure? # => false
```

#### Ошибка

Информацию об ошибке можно получить через метод `error`.

```ruby
service_result.error

# => <ApplicationService::Errors::Failure: Invalid invoice number>
```

## Информация

Снаружи сервиса можно получить информацию о его input, internal и output атрибутах.

Это может быть полезно, например, при реализации сложной обработки классов.

Например, в сервисе описаны следующие атрибуты:

```ruby
class BuildFullName < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String, required: false
  input :last_name, type: String

  internal :prepared_full_name, type: String

  output :full_name, type: String

  # ...
end
```

Получить информацию о них можно следующими способами:

```ruby
BuildFullName.info

# => <Servactory::Info::Result:0x00000001118c7078 @inputs=[:first_name, :middle_name, :last_name], @internals=[:prepared_full_name], @outputs=[:full_name]>
```

```ruby
BuildFullName.info.inputs

# => [:first_name, :middle_name, :last_name]
```

```ruby
BuildFullName.info.internals

# => [:prepared_full_name]
```

```ruby
BuildFullName.info.outputs

# => [:full_name]
```
