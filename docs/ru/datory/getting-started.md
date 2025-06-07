---
title: Начало работы с Datory
description: Руководство по установке и настройке Datory
prev: false
next: false
---

# Начало работы с Datory

## Что такое Datory?

Datory — это библиотека для сериализации и десериализации данных в Ruby/Rails приложениях. Она основана на Servactory и предоставляет удобный API для работы с данными.

## Поддержка версий

Datory поддерживает следующие версии Ruby и Rails:

| Ruby/Rails  | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|-------------|---|---|---|---|---|---|---|---|---|
| 3.5 Preview | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1         | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Установка

### Добавление гема

Добавьте Datory в ваш `Gemfile`:

```ruby
gem "datory"
```

### Установка зависимостей

Выполните команду для установки гема:

```shell
bundle install
```

## Подготовка

Для начала рекомендуется подготовить базовый класс для дальнейшего наследования.

### Для DTO

::: code-group

```ruby [app/dtos/application_dto/base.rb]
module ApplicationDTO
  class Base < Datory::Base
  end
end
```

:::

### Для форм

::: code-group

```ruby [app/forms/application_form/base.rb]
module ApplicationForm
  class Base < Datory::Base
  end
end
```

:::

## Создание первого DTO

### Пример DTO

```ruby
class UserDto < ApplicationDTO::Base
  # Базовые атрибуты
  uuid! :id
  string! :email
  string! :name

  # Вложенные данные
  one! :profile, include: ProfileDto
  many! :posts, include: PostDto

  # Даты
  date! :createdAt, to: :created_at
  date? :updatedAt, to: :updated_at
end
```

### Использование

```ruby
# Сериализация
user = User.find(1)
user_data = UserDto.serialize(user)

# Десериализация
user_data = { id: "uuid", email: "user@example.com", name: "John Doe" }
result = UserDto.deserialize(user_data)
```
