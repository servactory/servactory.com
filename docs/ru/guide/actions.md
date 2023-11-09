---
title: Действия в сервисе
description: Описание и примеры использования вызова методов сервиса
prev: Выходящие атрибуты сервиса
next: Вызов сервиса и результат его работы
---

# Действия в сервисе

Действия в сервисе подразумевают вызов методов.
Вызов методов сервиса происходит только при помощи метода `make`.

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
    internals.api_model = APIModel.new
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

### Опция `if`

Перед вызовом метода будет проверено условие, описанное в `if`.

```ruby{2}
make :something,
     if: ->(**) { Settings.features.preview.enabled }

def something
  # ...
end
```

### Опция `unless`

Противоположность опции `if`.

```ruby{2}
make :something,
     unless: ->(**) { Settings.features.preview.disabled }

def something
  # ...
end
```

### Опция `position`

Все методы имеют позицию.
Если какой-то метод нужно вызвать не в тот момент, в который он был добавлен через `make`, то можно воспользоваться опцией `position`.
Может быть полезно при наследовании сервисов.

```ruby{3,14}
class SomeApiService::Base < ApplicationService::Base
  make :api_request!,
       position: 2

  # ...
end

class SomeApiService::Posts::Create < SomeApiService::Base
  input :post_name, type: String

  # ...
  
  make :validate!,
       position: 1

  private

  def validate!
    # ...
  end

  # ...
end
```

## Группа из нескольких методов

Собрать в одну группу выполнение несколько методов можно при помощи метода `stage`.

::: info

Использование опции `position` для `make` будет сортировать только внутри `stage`.

:::

```ruby
stage do
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Опция `only_if`

Перед вызовом методов внутри `stage` будет проверено условие, описанное в `only_if`.

```ruby {2}
stage do
  only_if ->(context:) { Settings.features.preview.enabled }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Опция `only_unless`

Противоположность опции `only_if`.

```ruby {2}
stage do
  only_unless ->(context:) { Settings.features.preview.disabled }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Опция `wrap_in`

Группу методов, находящийхся в `stage` можно обернуть во что-то.
Например, это может быть `ActiveRecord::Base.transaction` от Rails.

```ruby {2}
stage do
  wrap_in ->(methods:) { ActiveRecord::Base.transaction { methods.call } }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Опция `rollback`

Если в одном из методов в группе или в `wrap_in` возникло исключение, то это можно обработать при помощи метода `rollback`.

```ruby {3,12}
stage do
  wrap_in ->(methods:) { ActiveRecord::Base.transaction { methods.call } }
  rollback :clear_data_and_fail!
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end

# ...

def clear_data_and_fail!(e)
  # ...

  fail!(message: "Failed to create data: #{e.message}")
end
```

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
