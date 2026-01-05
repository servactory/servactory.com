---
title: Начало работы
description: Требования, соглашения, установка и пример базовой подготовки
prev: Почему Servactory
next: Вызов сервиса и результат его работы
---

# Начало работы с Servactory

## Соглашения

- Сервисы наследуются от `Servactory::Base` и находятся в `app/services`. Рекомендуется создать `ApplicationService::Base` как базовый класс проекта.
- Называйте сервисы по действию, а не по входным данным. Используйте глаголы. Пример: `UsersService::Create` вместо `UsersService::Creation`.

## Поддержка версий

| Ruby/Rails | 8.1 | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|------------|---|---|---|---|---|---|---|---|---|---|
| 4.0        | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1        | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Установка

Добавьте это в файл `Gemfile`:

```ruby
gem "servactory"
```

Затем выполните:

```shell
bundle install
```

## Подготовка

Подготовьте базовый класс для наследования.

### Автоматически <Badge type="tip" text="Начиная с 2.5.0" />

Запустите генератор:

```shell
bundle exec rails g servactory:install
```

Создаст все необходимые файлы.

### Вручную

#### ApplicationService::Exceptions

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

#### ApplicationService::Result <Badge type="tip" text="Начиная с 2.5.0" />

::: code-group

```ruby [app/services/application_service/result.rb]
module ApplicationService
  class Result < Servactory::Result; end
end
```

:::

#### ApplicationService::Base

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

## Первый сервис

Создайте первый сервис:

```shell
bundle exec rails g servactory:service users_service/create first_name middle_name last_name
```

Сгенерируйте спек файл:

```shell
bundle exec rails g servactory:rspec users_service/create first_name middle_name last_name
```
