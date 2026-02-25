---
title: アトリビュート — Datory
description: 説明と使用例
prev: false
next: false
---

# アトリビュート

## 基本

### attribute

::: code-group

```ruby [必須]
attribute :uuid, from: String, to: :id, as: String, format: :uuid
```

```ruby [任意]
attribute :uuid, from: [String, NilClass], to: :id, as: [String, NilClass], format: :uuid, required: false
```

:::

### string

::: code-group

```ruby [必須]
string! :uuid, to: :id
```

```ruby [任意]
string? :uuid, to: :id
```

:::

### integer

::: code-group

```ruby [必須]
integer! :rating, min: 1, max: 10
```

```ruby [任意]
integer? :rating, min: 1, max: 10
```

:::

### float

::: code-group

```ruby [必須]
float! :rating
```

```ruby [任意]
float? :rating
```

:::

### boolean

::: code-group

```ruby [必須]
boolean! :published
```

```ruby [任意]
# not supported
```

:::

## オプション

`attribute`メソッドでは以下のオプションが利用可能です:

- `from`;
- `to`;
- `as`;
- `format`;
- `min`;
- `max`.

ヘルパーでは`from`オプションを除き、これらのオプションも利用可能です。

`format`でサポートされる値については[こちら](../../../guide/options/dynamic.md#オプション-format)をご覧ください。

## ヘルパー

### uuid

::: code-group

```ruby [例]
uuid! :id
```

```ruby [同等]
string! :id, format: :uuid
```

:::

::: code-group

```ruby [例]
uuid? :id
```

```ruby [同等]
string? :id, format: :uuid
```

:::

### money

::: code-group

```ruby [例]
money! :box_office
```

```ruby [同等]
integer! :box_office_cents
string! :box_office_currency
```

:::

::: code-group

```ruby [例]
money? :box_office
```

```ruby [同等]
integer? :box_office_cents
string? :box_office_currency
```

:::

### duration

::: code-group

```ruby [例]
duration! :episode_duration
```

```ruby [同等]
attribute :episode_duration, from: String, as: ActiveSupport::Duration, format: { from: :duration }
```

:::

::: code-group

```ruby [例]
duration? :episode_duration
```

```ruby [同等]
attribute :episode_duration, from: [String, NilClass], as: [ActiveSupport::Duration, NilClass], format: { from: :duration }, required: false
```

:::

### date

::: code-group

```ruby [例]
date! :premiered_on
```

```ruby [同等]
attribute :premiered_on, from: String, as: Date, format: { from: :date }
```

:::

::: code-group

```ruby [例]
date? :premiered_on
```

```ruby [同等]
attribute :premiered_on, from: [String, NilClass], as: [Date, NilClass], format: { from: :date }, required: false
```

:::

### time

::: code-group

```ruby [例]
time! :premiered_at
```

```ruby [同等]
attribute :premiered_at, from: String, as: Time, format: { from: :time }
```

:::

::: code-group

```ruby [例]
time? :premiered_at
```

```ruby [同等]
attribute :premiered_at, from: [String, NilClass], as: [Time, NilClass], format: { from: :time }, required: false
```

:::

### datetime

::: code-group

```ruby [例]
datetime! :premiered_at
```

```ruby [同等]
attribute :premiered_at, from: String, as: DateTime, format: { from: :datetime }
```

:::

::: code-group

```ruby [例]
datetime? :premiered_at
```

```ruby [同等]
attribute :premiered_at, from: [String, NilClass], as: [DateTime, NilClass], format: { from: :datetime }, required: false
```

:::
