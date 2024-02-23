---
title: Информация о сервисе
description: Описание и примеры использования получения информации о сервисе
prev: Результат работы сервиса
next: Входящие атрибуты сервиса
---

# Информация о сервисе

Снаружи сервиса можно получить информацию о его input, internal и output атрибутах.

Это может быть полезно, например, при реализации сложной обработки сервисов.
Или для тестирования.

Например, в сервисе описаны следующие атрибуты:

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

Получить информацию о них можно следующими способами:

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
