---
title: Выходящие атрибуты сервиса
description: Описание и примеры использования выходящих атрибутов сервиса
prev: Внутренние атрибуты сервиса
next: Опции для атрибутов сервиса
---

# Выходящие атрибуты

Все атрибуты, которые должен возвращать сервис в результате через класс `Result`
необходимо добавить с использованием метода `output`.

## Использование

Назначение и использование выходящих атрибутов сервиса осуществляется через методы `outputs=`/`outputs`.

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

Подробнее про опции вы можете узнать в разделе [использования опций](../options/usage).

## Хелперы

Servactory позволяет добавлять пользовательские хелперы под цели проекта.

Под "хелпером" подразумевается некоторое сокращенное написание, которое при использовании раскрывается в конкретную опцию.

### Пользовательские

Пользовательские хелперы можно добавить используя метод `output_option_helpers` в `configuration`.

Такие хелперы могут быть основаны на существующих опциях.

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

По необходимости можно отфильтровать `outputs` при помощи метода `only`.
Это будет возвращать Hash с указанными атрибутами.

```ruby{2}
outputs.full_name =
  outputs.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### Метод `except`

По необходимости можно отфильтровать `outputs` при помощи метода `except`.
Это будет возвращать Hash без указанных атрибутов.

```ruby{2}
outputs.full_name =
  outputs.except(:gender)
    .values
    .compact
    .join(" ")
```

### Методы предикаты

К любому атрибуту output можно обратиться как к методу предикату.


```ruby{8}
# ...

output :full_name, type: String

# ...

def something
  return unless outputs.full_name? # вместо `outputs.full_name.present?`
  
  # ...
end
```
