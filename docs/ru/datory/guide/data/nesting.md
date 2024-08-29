---
title: Вложенные данные — Datory
description: Описание и примеры использования
prev: false
next: false
---

# Вложенные данные

## Single

::: code-group

```ruby [Обязательный]
one! :poster, include: ImageDto
```

```ruby [Опциональный]
one? :poster, include: ImageDto
```

:::

## Multiple

::: code-group

```ruby [Обязательный]
many! :seasons, include: SeasonDto
```

```ruby [Опциональный]
many? :seasons, include: SeasonDto
```

:::
