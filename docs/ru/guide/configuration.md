---
title: Конфигурация
description: Описание и примеры конфигурирования сервисов
prev: Вызов сервиса и результат его работы
next: Неудачи и обработка ошибок
---

# Конфигурация

Сервисы конфигурируются через `configuration` метод, который может быть расположен, например, в базовом классе.

## Примеры конфигурации

### Для ошибок

```ruby {4-6,8} title="app/services/application_service/base.rb"
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

### Хелперы для `input`

Пользовательские хелперы для `input` основываются на опциях `must` и `prepare`.

#### Пример с `must`

```ruby {4-20} title="app/services/application_service/base.rb"
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

#### Пример с `prepare`

```ruby {4-13} title="app/services/application_service/base.rb"
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_option_helpers(
        [
          Servactory::Inputs::OptionHelper.new(
            name: :to_money,
            equivalent: {
              prepare: ->(value:) { Money.new(cents: value, currency: :USD) }
            }
          )
        ]
      )
    end
  end
end
```

### Алиасы для `make`

```ruby {2} title="app/services/application_service/base.rb"
configuration do
  aliases_for_make %i[execute]
end
```

### Сокращения для `make`

```ruby {4} title="app/services/application_service/base.rb"
module ApplicationService
  class Base < Servactory::Base
    configuration do
      shortcuts_for_make %i[assign perform]
    end
  end
end
```
