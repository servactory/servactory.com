---
title: Конфигурация
description: Описание и примеры конфигурирования сервисов
prev: Неудачи и обработка ошибок
next: RSpec
---

# Конфигурация

Сервисы конфигурируются через метод `configuration`, который может быть расположен, например, в базовом классе.

## Примеры конфигурации

### Для исключений

::: code-group

```ruby {4-6,8} [app/services/application_service/base.rb]
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

```ruby {3-5,7} [app/services/application_service/exceptions.rb]
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

### Для результата <Badge type="tip" text="Начиная с 2.5.0" />

::: code-group

```ruby {6} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      # ...

      result_class ApplicationService::Result
    end
  end
end
```

```ruby {2} [app/services/application_service/result.rb]
module ApplicationService
  class Result < Servactory::Result; end
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

Пользовательские хелперы для `input` могут быть основаны на опциях `must` и `prepare`.

#### Пример с `must`

::: code-group

```ruby {4-20} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_option_helpers(
        [
          Servactory::Maintenance::Attributes::OptionHelper.new(
            name: :must_be_6_characters,
            equivalent: {
              must: {
                be_6_characters: {
                  is: ->(value:, input:) { value.all? { |id| id.size == 6 } },
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
          Servactory::Maintenance::Attributes::OptionHelper.new(
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

### Хелперы для `internal`

Пользовательские хелперы для `internal` могут быть основаны на опции `must`.

#### Пример с `must`

::: code-group

```ruby {4-20} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      internal_option_helpers(
        [
          Servactory::Maintenance::Attributes::OptionHelper.new(
            name: :must_be_6_characters,
            equivalent: {
              must: {
                be_6_characters: {
                  is: ->(value:, internal:) { value.all? { |id| id.size == 6 } },
                  message: lambda do |internal:, **|
                    "Wrong IDs in `#{internal.name}`"
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

### Хелперы для `output`

Пользовательские хелперы для `output` могут быть основаны на опции `must`.

#### Пример с `must`

::: code-group

```ruby {4-20} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      output_option_helpers(
        [
          Servactory::Maintenance::Attributes::OptionHelper.new(
            name: :must_be_6_characters,
            equivalent: {
              must: {
                be_6_characters: {
                  is: ->(value:, output:) { value.all? { |id| id.size == 6 } },
                  message: lambda do |output:, **|
                    "Wrong IDs in `#{output.name}`"
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

### Алиасы для `make`

Конфигурация `action_aliases` позволяет добавить альтернативные варианты для `make`.

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      action_aliases %i[execute]
    end
  end
end
```

:::

### Кастомизация для `make`

Конфигурация `action_shortcuts` позволяет реализовать сокращение при использовании `make`.

Указываемые значения в конфигурации используются вместо `make`, а также являются префиксом метода инстанса.

#### Простой режим

В простом режиме значения передаются в виде массива символов.

::: code-group

```ruby {4-6} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      action_shortcuts(
        %i[assign perform]
      )
    end
  end
end
```

:::

::: details Пример использования

```ruby
class CMSService::API::Posts::Create < CMSService::API::Base
  # ...
  
  assign :model

  perform :request

  private

  def assign_model
    # Build model for API request
  end

  def perform_request
    # Perform API request
  end
  
  # ...
end
```

:::

#### Расширенный режим <Badge type="tip" text="Начиная с 2.14.0" />

::: code-group

```ruby {6-11} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      action_shortcuts(
        %i[assign],
        {
          restrict: {             # замена для make
            prefix: :create,      # префикс имени метода
            suffix: :restriction  # суффикс имени метода
          }
        }
      )
    end
  end
end
```

:::

::: details Пример использования

```ruby
class PaymentsService::Restrictions::Create < ApplicationService::Base
  input :payment, type: Payment

  # Восклицательный знак будет перемещен в конец имени метода
  restrict :payment!

  private

  def create_payment_restriction!
    inputs.payment.restrictions.create!(
      reason: "Suspicion of fraud"
    )
  end
end
```

:::

### Методы предикаты <Badge type="tip" text="Начиная с 2.5.0" />

По умолчанию методы предикаты для всех атрибутов включены.
Вы можете по необходимости их выключить.

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      predicate_methods_enabled false
    end
  end
end
```

:::
