---
title: Атрибуты — Datory
description: Описание и примеры использования
prev: false
next: false
---

# Атрибуты

## Базовые

### attribute

```ruby
attribute :uuid, from: String, to: :id, as: String, format: :uuid
```

### string

```ruby
string :uuid, to: :id
```

### integer

```ruby
integer :rating, min: 1, max: 10
```

### float

```ruby
float :rating
```

## Опции

Для метода `attribute` доступны следующие опции:

- `from`;
- `to`;
- `as`;
- `format`;
- `min`;
- `max`.

Для хелперов эти опции также доступны, за исключением опции `from`.

О поддерживаемых значениях для `format` вы можете узнать [здесь](../../../guide/options/dynamic.md#опция-format).

## Хелперы

### uuid

::: code-group

```ruby [Пример]
uuid :id
```

```ruby [Эквивалент]
string :id, format: :uuid
```

:::

### money

::: code-group

```ruby [Пример]
money :box_office
```

```ruby [Эквивалент]
integer :box_office_cents
string :box_office_currency
```

:::

### duration

::: code-group

```ruby [Пример]
duration :episode_duration
```

```ruby [Эквивалент]
string :episode_duration, from: String, as: ActiveSupport::Duration, format: { from: :duration }
```

:::

### date

::: code-group

```ruby [Пример]
date :premiered_on
```

```ruby [Эквивалент]
string :premiered_on, from: String, as: Date, format: { from: :date }
```

:::

### time

::: code-group

```ruby [Пример]
time :premiered_at
```

```ruby [Эквивалент]
string :premiered_at, from: String, as: Time, format: { from: :time }
```

:::

### datetime

::: code-group

```ruby [Пример]
datetime :premiered_at
```

```ruby [Эквивалент]
string :premiered_at, from: String, as: DateTime, format: { from: :datetime }
```

:::
