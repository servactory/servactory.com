---
title: Атрибуты — Datory
description: Описание и примеры использования
prev: false
next: false
---

# Атрибуты

## Базовые

### attribute

::: code-group

```ruby [Обязательный]
attribute :uuid, from: String, to: :id, as: String, format: :uuid
```

```ruby [Опциональный]
attribute :uuid, from: [String, NilClass], to: :id, as: [String, NilClass], format: :uuid, required: false
```

:::

### string

::: code-group

```ruby [Обязательный]
string! :uuid, to: :id
```

```ruby [Опциональный]
string? :uuid, to: :id
```

:::

### integer

::: code-group

```ruby [Обязательный]
integer! :rating, min: 1, max: 10
```

```ruby [Опциональный]
integer? :rating, min: 1, max: 10
```

:::

### float

::: code-group

```ruby [Обязательный]
float! :rating
```

```ruby [Опциональный]
float? :rating
```

:::

### boolean

::: code-group

```ruby [Обязательный]
boolean! :published
```

```ruby [Опциональный]
# не поддерживается
```

:::

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
uuid! :id
```

```ruby [Эквивалент]
string! :id, format: :uuid
```

:::

::: code-group

```ruby [Пример]
uuid? :id
```

```ruby [Эквивалент]
string? :id, format: :uuid
```

:::

### money

::: code-group

```ruby [Пример]
money! :box_office
```

```ruby [Эквивалент]
integer! :box_office_cents
string! :box_office_currency
```

:::

::: code-group

```ruby [Пример]
money? :box_office
```

```ruby [Эквивалент]
integer? :box_office_cents
string? :box_office_currency
```

:::

### duration

::: code-group

```ruby [Пример]
duration! :episode_duration
```

```ruby [Эквивалент]
attribute :episode_duration, from: String, as: ActiveSupport::Duration, format: { from: :duration }
```

:::

::: code-group

```ruby [Пример]
duration? :episode_duration
```

```ruby [Эквивалент]
attribute :episode_duration, from: [String, NilClass], as: [ActiveSupport::Duration, NilClass], format: { from: :duration }, required: false
```

:::

### date

::: code-group

```ruby [Пример]
date! :premiered_on
```

```ruby [Эквивалент]
attribute :premiered_on, from: String, as: Date, format: { from: :date }
```

:::

::: code-group

```ruby [Пример]
date? :premiered_on
```

```ruby [Эквивалент]
attribute :premiered_on, from: [String, NilClass], as: [Date, NilClass], format: { from: :date }, required: false
```

:::

### time

::: code-group

```ruby [Пример]
time! :premiered_at
```

```ruby [Эквивалент]
attribute :premiered_at, from: String, as: Time, format: { from: :time }
```

:::

::: code-group

```ruby [Пример]
time? :premiered_at
```

```ruby [Эквивалент]
attribute :premiered_at, from: [String, NilClass], as: [Time, NilClass], format: { from: :time }, required: false
```

:::

### datetime

::: code-group

```ruby [Пример]
datetime! :premiered_at
```

```ruby [Эквивалент]
attribute :premiered_at, from: String, as: DateTime, format: { from: :datetime }
```

:::

::: code-group

```ruby [Пример]
datetime? :premiered_at
```

```ruby [Эквивалент]
attribute :premiered_at, from: [String, NilClass], as: [DateTime, NilClass], format: { from: :datetime }, required: false
```

:::
