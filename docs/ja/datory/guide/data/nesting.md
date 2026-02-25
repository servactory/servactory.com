---
title: ネストデータ — Datory
description: 説明と使用例
prev: false
next: false
---

# ネストデータ

## Single

::: code-group

```ruby [必須]
one! :poster, include: ImageDto
```

```ruby [任意]
one? :poster, include: ImageDto
```

:::

## Multiple

::: code-group

```ruby [必須]
many! :seasons, include: SeasonDto
```

```ruby [任意]
many? :seasons, include: SeasonDto
```

:::
