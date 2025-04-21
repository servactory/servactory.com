---
title: Использование действий в сервисе
description: Описание и примеры использования действий (методов) в сервисе
prev: Динамические опции
next: Опции для действий в сервисе
---

# Использование действий

Действия в сервисе — это поочередный вызов методов.
Вызов методов сервиса происходит при помощи метода `make`.

## Примеры

### Минимальный

В минимальном виде вызов методов через `make` необязателен.
Вместо него можно использовать метод `call`.

```ruby
class PostsService::Create < ApplicationService::Base
  def call
    # something
  end
end
```

### Несколько методов

```ruby{4-6,8,12,16}
class PostsService::Create < ApplicationService::Base
  # ...

  make :assign_api_model
  make :perform_api_request
  make :process_result

  def assign_api_model
    internals.api_model = APIModel.new(...)
  end

  def perform_api_request
    internals.response = APIClient.resource.create(internals.api_model)
  end

  def process_result
    ARModel.create!(internals.response)
  end
end
```

## Опции

Подробнее про опции вы можете узнать в разделе [опций](../actions/options).

## Группа из нескольких действий

Подробнее про группу из нескольких действий (методов) вы можете узнать в разделе [группирования](../actions/grouping).

## Алиасы для `make`

Через конфигурацию `action_aliases` можно добавить альтернативные варианты для метода `make`.

```ruby {2,5}
configuration do
  action_aliases %i[execute]
end

execute :something

def something
  # ...
end
```

## Кастомизация для `make`

Через конфигурацию `action_shortcuts` можно добавить часто используемые слова, которые используются в виде префиксов в именах методов.
Имена самих методов короче не станут, но это позволит сократить строки с применением метода `make` и улучшить читаемость кода сервиса, сделав его выразительнее.

### Простой режим

В простом режиме значения передаются в виде массива символов.

```ruby
configuration do
  action_shortcuts %i[assign perform]
end
```

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

### Расширенный режим <Badge type="tip" text="Начиная с 2.14.0" />

В расширенном режиме значения передаются в виде хеша.

```ruby
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
```

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
