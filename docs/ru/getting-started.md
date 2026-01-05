---
title: Начало работы
description: Требования, соглашения, установка и пример базовой подготовки
prev: Почему Servactory
next: Вызов сервиса и результат его работы
---

# Начало работы с Servactory

## Соглашения

- Все сервисы являются подклассами `Servactory::Base` и располагаются в директории `app/services`. Общепринятой практикой является создание и наследование от класса `ApplicationService::Base`, который является подклассом `Servactory::Base`.
- Называйте сервисы по тому что они делают, а не по тому что они принимают. Используйте глаголы в именах. Например, назовите сервис `UsersService::Create` вместо `UsersService::Creation`.

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

Для начала рекомендуется подготовить базовый класс для дальнейшего наследования.

### Автоматически <Badge type="tip" text="Начиная с 2.5.0" />

Для быстрой подготовки среды для работы вы можете воспользоваться rake-задачей:

```shell
bundle exec rails g servactory:install
```

Это создаст все необходимые файлы.

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

Теперь вы можете создать свой первый сервис.
Для этого можно воспользоваться rake-задачей:

```shell
bundle exec rails g servactory:service users_service/create first_name middle_name last_name
```

Также вы можете сразу подготовить спек файл для тестирования сервиса:

```shell
bundle exec rails g servactory:rspec users_service/create first_name middle_name last_name
```
