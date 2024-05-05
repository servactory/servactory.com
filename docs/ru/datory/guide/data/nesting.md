---
title: Вложенные данные — Datory
description: Описание и примеры использования
prev: false
next: false
---

# Вложенные данные

## Single

```ruby
one :poster, include: ImageDto
```

## Multiple

```ruby
many :seasons, include: SeasonDto
```
