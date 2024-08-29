---
title: Attributes — Datory
description: Description and examples of use
prev: false
next: false
---

# Attributes

## Basic

### attribute

::: code-group

```ruby [Required]
attribute :uuid, from: String, to: :id, as: String, format: :uuid
```

```ruby [Optional]
attribute :uuid, from: [String, NilClass], to: :id, as: [String, NilClass], format: :uuid, required: false
```

:::

### string

::: code-group

```ruby [Required]
string! :uuid, to: :id
```

```ruby [Optional]
string? :uuid, to: :id
```

:::

### integer

::: code-group

```ruby [Required]
integer! :rating, min: 1, max: 10
```

```ruby [Optional]
integer? :rating, min: 1, max: 10
```

:::

### float

::: code-group

```ruby [Required]
float! :rating
```

```ruby [Optional]
float? :rating
```

:::

### boolean

::: code-group

```ruby [Required]
boolean! :published
```

```ruby [Optional]
# not supported
```

:::

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
uuid! :id
```

```ruby [Equivalent]
string! :id, format: :uuid
```

:::

::: code-group

```ruby [Example]
uuid? :id
```

```ruby [Equivalent]
string? :id, format: :uuid
```

:::

### money

::: code-group

```ruby [Example]
money! :box_office
```

```ruby [Equivalent]
integer! :box_office_cents
string! :box_office_currency
```

:::

::: code-group

```ruby [Example]
money? :box_office
```

```ruby [Equivalent]
integer? :box_office_cents
string? :box_office_currency
```

:::

### duration

::: code-group

```ruby [Example]
duration! :episode_duration
```

```ruby [Equivalent]
attribute :episode_duration, from: String, as: ActiveSupport::Duration, format: { from: :duration }
```

:::

::: code-group

```ruby [Example]
duration? :episode_duration
```

```ruby [Equivalent]
attribute :episode_duration, from: [String, NilClass], as: [ActiveSupport::Duration, NilClass], format: { from: :duration }, required: false
```

:::

### date

::: code-group

```ruby [Example]
date! :premiered_on
```

```ruby [Equivalent]
attribute :premiered_on, from: String, as: Date, format: { from: :date }
```

:::

::: code-group

```ruby [Example]
date? :premiered_on
```

```ruby [Equivalent]
attribute :premiered_on, from: [String, NilClass], as: [Date, NilClass], format: { from: :date }, required: false
```

:::

### time

::: code-group

```ruby [Example]
time! :premiered_at
```

```ruby [Equivalent]
attribute :premiered_at, from: String, as: Time, format: { from: :time }
```

:::

::: code-group

```ruby [Example]
time? :premiered_at
```

```ruby [Equivalent]
attribute :premiered_at, from: [String, NilClass], as: [Time, NilClass], format: { from: :time }, required: false
```

:::

### datetime

::: code-group

```ruby [Example]
datetime! :premiered_at
```

```ruby [Equivalent]
attribute :premiered_at, from: String, as: DateTime, format: { from: :datetime }
```

:::

::: code-group

```ruby [Example]
datetime? :premiered_at
```

```ruby [Equivalent]
attribute :premiered_at, from: [String, NilClass], as: [DateTime, NilClass], format: { from: :datetime }, required: false
```

:::
