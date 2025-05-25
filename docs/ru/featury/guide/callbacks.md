---
title: Колбэки объекта Featury
description: Описание и примеры использования колбэков объекта Featury
prev: false
next: false
---

# Колбэки Featury

Работу с действиями можно отслеживать через `bafore` и `after` колбэки.

Для каждого из колбэков можно указать на какие действия он должен срабатывать.
По умолчанию колбэк будет реагировать на все действия.

Внутри себя колбэк имеет данные от вызванного действия,
а также фича-флаги из вызванного объекта Featury.

## Колбэк `before`

В этом примере колбэк `before` будет срабатывать на вызов любого из действий.

```ruby
before do |action:, features:|
  Slack::API::Notify.call!(action:, features:)
end
```

## Колбэк `after`

В этом примере колбэк `after` будет срабатывать только на вызов действия `enabled?` или `disabled?`.

```ruby
after :enabled?, :disabled? do |action:, features:|
  Slack::API::Notify.call!(action:, features:)
end
```
