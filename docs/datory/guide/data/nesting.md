---
title: Nested data — Datory
description: Description and examples of use
prev: false
next: false
---

# Nested data

## Single

::: code-group

```ruby [Required]
one! :poster, include: ImageDto
```

```ruby [Optional]
one? :poster, include: ImageDto
```

:::

## Multiple

::: code-group

```ruby [Required]
many! :seasons, include: SeasonDto
```

```ruby [Optional]
many? :seasons, include: SeasonDto
```

:::
