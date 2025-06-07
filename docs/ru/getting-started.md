---
title: Начало работы
description: Руководство по установке и настройке Servactory
prev: Почему Servactory
next: Вызов сервиса и результат его работы
---

# Начало работы с Servactory

## Соглашения по разработке

Servactory следует определенным соглашениям для обеспечения единообразия кода:

- Все сервисы должны наследоваться от `Servactory::Base` и размещаться в директории `app/services`
- Рекомендуется создавать базовый класс `ApplicationService::Base`, наследующийся от `Servactory::Base`
- Имена сервисов должны отражать их действия, а не входные данные
- Используйте глаголы в именах сервисов (например, `UsersService::Create` вместо `UsersService::Creation`)

## Поддержка версий

Servactory поддерживает следующие версии Ruby и Rails:

| Ruby/Rails  | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|-------------|---|---|---|---|---|---|---|---|---|
| 3.5 Preview | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1         | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Установка

### Добавление гема

Добавьте Servactory в ваш `Gemfile`:

```ruby
gem "servactory"
```

### Установка зависимостей

Выполните команду для установки гема:

```shell
bundle install
```

## Настройка окружения

### Автоматическая настройка <Badge type="tip" text="Начиная с 2.5.0" />

Для быстрой настройки окружения используйте генератор:

```shell
bundle exec rails g servactory:install
```

Это создаст все необходимые файлы и структуру.

### Ручная настройка

#### 1. Создание исключений

::: code-group

```ruby [app/services/application_service/exceptions.rb]
module ApplicationService
  module Exceptions
    class Input < Servactory::Exceptions::Input; end
    class Output < Servactory::Exceptions::Output; end
    class Internal < Servactory::Exceptions::Internal; end

    class Failure < Servactory::Exceptions::Failure; end
  end
end
```

:::

#### 2. Создание класса результата <Badge type="tip" text="Начиная с 2.5.0" />

::: code-group

```ruby [app/services/application_service/result.rb]
module ApplicationService
  class Result < Servactory::Result; end
end
```

:::

#### 3. Создание базового класса

::: code-group

```ruby [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_exception_class ApplicationService::Exceptions::Input
      internal_exception_class ApplicationService::Exceptions::Internal
      output_exception_class ApplicationService::Exceptions::Output

      failure_class ApplicationService::Exceptions::Failure

      result_class ApplicationService::Result
    end
  end
end
```

:::

## Создание первого сервиса

### Генерация сервиса

Для создания нового сервиса используйте генератор:

```shell
bundle exec rails g servactory:service users_service/create first_name middle_name last_name
```

### Генерация тестов

Для создания тестов используйте:

```shell
bundle exec rails g servactory:rspec users_service/create first_name middle_name last_name
```
