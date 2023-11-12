---
title: Конфигурация
description: Описание и примеры конфигурирования сервисов
prev: Вызов сервиса и результат его работы
next: Неудачи и обработка ошибок
---

# Конфигурация

Сервисы конфигурируются через `configuration` метод, который может быть расположен, например, в базовом классе.

## Примеры конфигурации

### Для исключений

::: code-group

```ruby {4-6,8} [app/services/application_service/base.rb]
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

```ruby {3-5,7} [app/services/application_service/errors.rb]
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

### Режим коллекции

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      collection_mode_class_names([ActiveRecord::Relation])
    end
  end
end
```

:::

### Режим хеша

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      hash_mode_class_names([CustomHash])
    end
  end
end
```

:::

### Хелперы для `input`

Пользовательские хелперы для `input` основываются на опциях `must` и `prepare`.

#### Пример с `must`

::: code-group

```ruby {4-20} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_option_helpers(
        [
          Servactory::Inputs::OptionHelper.new(
            name: :must_be_6_characters,
            equivalent: {
              must: {
                be_6_characters: {
                  is: ->(value:) { value.all? { |id| id.size == 6 } },
                  message: lambda do |input:, **|
                    "Wrong IDs in `#{input.name}`"
                  end
                }
              }
            }
          )
        ]
      )
    end
  end
end
```

:::

#### Пример с `prepare`

::: code-group

```ruby {4-13} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_option_helpers(
        [
          Servactory::Inputs::OptionHelper.new(
            name: :to_money,
            equivalent: {
              prepare: ->(value:) { Money.from_cents(value, :USD) }
            }
          )
        ]
      )
    end
  end
end
```

:::

### Алиасы для `make`

::: code-group

```ruby {2} [app/services/application_service/base.rb]
configuration do
  action_aliases %i[execute]
end
```

:::

### Сокращения для `make`

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      action_shortcuts %i[assign perform]
    end
  end
end
```

:::
