---
title: Информация о сервисе
description: Описание и примеры использования получения информации о сервисе
prev: Результат работы сервиса
next: Входящие атрибуты сервиса
---

# Информация о сервисе

Сервисы предоставляют информацию о своих input, internal и output атрибутах извне. Полезно для сложной обработки сервисов или тестирования.

Пример сервиса с атрибутами:

```ruby
class BuildFullName < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String, required: false
  input :last_name, type: String

  internal :prepared_full_name, type: String

  output :full_name, type: String

  # ...
end
```

Доступ к информации об атрибутах:

```ruby
BuildFullName.info

# => #<Servactory::Info::Result:0x00000001118c7078 @inputs=[:first_name, :middle_name, :last_name], @internals=[:prepared_full_name], @outputs=[:full_name]>
```

```ruby
BuildFullName.info.inputs

# => [:first_name, :middle_name, :last_name]
```

```ruby
BuildFullName.info.internals

# => [:prepared_full_name]
```

```ruby
BuildFullName.info.outputs

# => [:full_name]
```
