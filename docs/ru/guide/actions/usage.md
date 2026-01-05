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

Подробнее в разделе [опций](../actions/options).

## Группа из нескольких действий

Подробнее в разделе [группирования](../actions/grouping).

## Алиасы для `make`

Добавьте альтернативы методу `make` через конфигурацию `action_aliases`.

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

Добавьте часто используемые префиксы имен методов через конфигурацию `action_shortcuts`.
Имена методов не укоротятся, но строки с `make` станут короче и читабельнее.

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
    # Построение модели для API запроса
  end

  def perform_request
    # Выполнение API запроса
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
