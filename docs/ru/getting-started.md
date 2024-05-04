---
title: Начало работы
description: Описание и примеры использования
prev: Почему Servactory
next: Вызов сервиса и результат его работы
---

# Начало работы

## Соглашения

- Все сервисы являются подклассами `Servactory::Base` и располагаются в директории `app/services`. Общепринятой практикой является создание и наследование от `ApplicationService::Base`, который является подклассом `Servactory::Base`.
- Называйте сервисы по тому что они делают, а не по тому что они принимают. Используйте глаголы в именах. Например, назовите сервис `UsersService::Create` вместо `UsersService::Creation`.

## Поддержка версий

| Ruby/Rails | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|------------|---|---|---|---|---|---|---|
| 3.3        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.0        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 2.7        | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

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

### ApplicationService::Exceptions

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

### ApplicationService::Base

::: code-group

```ruby [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_exception_class ApplicationService::Exceptions::Input
      internal_exception_class ApplicationService::Exceptions::Internal
      output_exception_class ApplicationService::Exceptions::Output

      failure_class ApplicationService::Exceptions::Failure
    end
  end
end
```

:::
