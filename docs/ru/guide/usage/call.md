---
title: Вызов сервиса
description: Описание и примеры вызова сервиса
prev: Начало работы
next: Результат работы сервиса 
---

# Вызов сервиса

Сервисы вызываются через методы `.call` или `.call!`.

## Метод `.call!`

Метод `.call!` выбрасывает исключение при любой проблеме внутри сервиса.

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

Метод `.call` выбрасывает исключение при проблемах с input, internal и output атрибутами. Остальные ошибки фиксируются и предоставляются через класс `Result`.

::: code-group

```ruby [Call]
UsersService::Accept.call(user: User.first)
```

```ruby [Success]
# => #<ApplicationService::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

```ruby [Failure]
# => ApplicationService::Exceptions::Input: [UsersService::Accept] Required input `user` is missing

# => #<ApplicationService::Result @error=There is some problem with the user, @failure?=true, @success?=false>
```

:::
