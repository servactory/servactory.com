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

### ApplicationService::Errors

::: code-group

```ruby [app/services/application_service/errors.rb]
module ApplicationService
  module Errors
    class InputError < Servactory::Errors::InputError; end
    class OutputError < Servactory::Errors::OutputError; end
    class InternalError < Servactory::Errors::InternalError; end

    class Failure < Servactory::Errors::Failure; end
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
      input_error_class ApplicationService::Errors::InputError
      output_error_class ApplicationService::Errors::OutputError
      internal_error_class ApplicationService::Errors::InternalError

      failure_class ApplicationService::Errors::Failure
    end
  end
end
```

:::
