---
title: Выходящие атрибуты сервиса
description: Описание и примеры использования выходящих атрибутов сервиса
prev: Внутренние атрибуты сервиса
next: Опции для атрибутов сервиса
---

# Выходящие атрибуты

Добавьте все возвращаемые атрибуты через метод `output`. Они доступны через класс `Result`.

## Использование

Назначение и доступ к output атрибутам через методы `outputs=`/`outputs`.

```ruby{8,22}
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  internal :full_name, type: String

  output :user, type: User

  make :assign_full_name
  make :create!

  def assign_full_name
    internals.full_name = [
      inputs.first_name,
      inputs.middle_name,
      inputs.last_name
    ].join(" ")
  end

  def create!
    outputs.user = User.create!(full_name: internals.full_name)
  end
end
```

## Опции

Подробнее в разделе [использование опций](../options/usage).

## Хелперы

Servactory поддерживает пользовательские хелперы. Хелперы — сокращения, которые раскрываются в конкретные опции.

### Пользовательские

Добавьте пользовательские хелперы через `output_option_helpers` в `configuration`. Хелперы могут основываться на существующих опциях.

[Пример конфигурации](../configuration#хелперы-для-output)

#### Пример с `must`

```ruby{5}
class PaymentsService::Create < ApplicationService::Base
  # ...

  output :invoice_numbers,
         :must_be_6_characters,
         type: Array,
         consists_of: String

  # ...
end
```

## Методы

### Метод `only`

Фильтрует `outputs` методом `only`. Возвращает Hash с указанными атрибутами.

```ruby{2}
outputs.full_name =
  outputs.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### Метод `except`

Фильтрует `outputs` методом `except`. Возвращает Hash без указанных атрибутов.

```ruby{2}
outputs.full_name =
  outputs.except(:gender)
    .values
    .compact
    .join(" ")
```

### Методы предикаты

Любой output атрибут доступен как метод-предикат.

```ruby{8}
# ...

output :full_name, type: String

# ...

def something
  return unless outputs.full_name? # вместо `outputs.full_name.present?`
  
  # ...
end
```
