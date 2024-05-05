---
title: Attributes — Datory
description: Description and examples of use
prev: false
next: false
---

# Attributes

## Basic

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

## Options

The following options are available for the `attribute` method:

- `from`;
- `to`;
- `as`;
- `format`;
- `min`;
- `max`.

For helpers these options are also available, with the exception of the `from` option.

You can find out about supported values for `format` [here](../../../guide/options/dynamic.md#option-format).

## Helpers

### uuid

::: code-group

```ruby [Example]
uuid :id
```

```ruby [Equivalent]
string :id, format: :uuid
```

:::

### money

::: code-group

```ruby [Example]
money :box_office
```

```ruby [Equivalent]
integer :box_office_cents
string :box_office_currency
```

:::

### duration

::: code-group

```ruby [Example]
duration :episode_duration
```

```ruby [Equivalent]
string :episode_duration, from: String, as: ActiveSupport::Duration, format: { from: :duration }
```

:::

### date

::: code-group

```ruby [Example]
date :premiered_on
```

```ruby [Equivalent]
string :premiered_on, from: String, as: Date, format: { from: :date }
```

:::

### time

::: code-group

```ruby [Example]
time :premiered_at
```

```ruby [Equivalent]
string :premiered_at, from: String, as: Time, format: { from: :time }
```

:::

### datetime

::: code-group

```ruby [Example]
datetime :premiered_at
```

```ruby [Equivalent]
string :premiered_at, from: String, as: DateTime, format: { from: :datetime }
```

:::
