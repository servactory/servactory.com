---
title: Использование действий в сервисе
description: Описание и примеры использования действий (методов) в сервисе
prev: Режимы работы опций
next: Опции для действий в сервисе
---

# Использование действий

Действия в сервисе — это поочередный вызов методов.
Вызов методов сервиса происходит при помощи метода `make`.

## Примеры

### Минимальный

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

Soon

## Группа из нескольких методов

Soon

## Алиасы для `make`

Через конфигурацию `action_aliases` можно добавить алиас для метода `make`.

```ruby {2,5}
configuration do
  action_aliases %i[execute]
end

execute :something

def something
  # ...
end
```

## Сокращения для `make`

Через конфигурацию `action_shortcuts` можно добавить часто используемые слова, которые используются в виде префиксов в именах методов.
Имена самих методов короче не станут, но это позволит сократить строки с применением метода `make` и улучшить читаемость кода сервиса, сделав его выразительнее.

```ruby {2,5,6,9,13}
configuration do
  action_shortcuts %i[assign perform]
end

assign :api_model
perform :api_request
make :process_result

def assign_api_model
  internals.api_model = APIModel.new
end

def perform_api_request
  internals.response = APIClient.resource.create(internals.api_model)
end

def process_result
  ARModel.create!(internals.response)
end
```
