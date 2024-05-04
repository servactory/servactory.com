---
title: Вызов сервиса
description: Описание и примеры вызова сервиса
prev: Начало работы
next: Результат работы сервиса 
---

# Вызов сервиса

Сервис может быть вызван только через методы `.call` и `.call!`.

## Метод `.call!`

Вызов сервиса через метод `.call!` будет выкидывать исключение при любой возникшей проблеме внутри сервиса.

::: code-group

```ruby [Call]
UsersService::Accept.call!(user: User.first)
```

```ruby [Success]
# => #<ApplicationService::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

```ruby [Failure]
# => ApplicationService::Exceptions::Input: [UsersService::Accept] Required input `user` is missing

# => ApplicationService::Exceptions::Failure: There is some problem with the user
```

:::

## Метод `.call`

Вызов сервиса через метод `.call` будет выкидывать исключение только при проблемах с input атрибутами.
Все остальные ошибки будут зафиксированы и предоставлены через `Result` класс.

::: code-group

```ruby [Call]
UsersService::Accept.call!(user: User.first)
```

```ruby [Success]
# => #<ApplicationService::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

```ruby [Failure]
# => ApplicationService::Exceptions::Input: [UsersService::Accept] Required input `user` is missing

# => #<ApplicationService::Result @error=There is some problem with the user, @failure?=true, @success?=false>
```

:::
