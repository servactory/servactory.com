---
title: Опции для действий в сервисе
description: Описание и примеры использования опций для действий (методов) в сервисе
prev: false
next: false
---

# Опции для действий

## Опция `if`

Перед вызовом метода будет проверено условие, описанное в `if`.

```ruby{2}
make :something,
     if: ->(**) { Settings.features.preview.enabled }

def something
  # ...
end
```

## Опция `unless`

Противоположность опции `if`.

```ruby{2}
make :something,
     unless: ->(**) { Settings.features.preview.disabled }

def something
  # ...
end
```

## Опция `position`

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
