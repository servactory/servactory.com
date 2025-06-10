---
title: Вложенные данные — Datory
description: Описание и примеры использования вложенных данных в Datory
prev: false
next: false
---

# Вложенные данные

Datory поддерживает работу с вложенными данными через два основных метода: `one` для одиночных объектов и `many` для коллекций.

## Одиночные объекты (Single)

Метод `one` используется для определения атрибута, который содержит один вложенный объект.

::: code-group

```ruby [Обязательный]
one! :poster, include: ImageDto
```

```ruby [Опциональный]
one? :poster, include: ImageDto
```

:::

### Пример использования

```ruby
class MovieDto < ApplicationDTO::Base
  uuid! :id
  string! :title

  # Вложенный объект для постера фильма
  one! :poster, include: ImageDto
end

class ImageDto < ApplicationDTO::Base
  uuid! :id
  string! :url
  string! :alt
end
```

## Коллекции (Multiple)

Метод `many` используется для определения атрибута, который содержит коллекцию вложенных объектов.

::: code-group

```ruby [Обязательный]
many! :seasons, include: SeasonDto
```

```ruby [Опциональный]
many? :seasons, include: SeasonDto
```

:::

### Пример использования

```ruby
class SeriesDto < ApplicationDTO::Base
  uuid! :id
  string! :title

  # Коллекция сезонов
  many! :seasons, include: SeasonDto
end

class SeasonDto < ApplicationDTO::Base
  uuid! :id
  integer! :number
  string! :title
end
```
