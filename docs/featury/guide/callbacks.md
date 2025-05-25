---
title: Callbacks of the Featury object
description: Description and examples of using callbacks of the Featury object
prev: false
next: false
---

# Callbacks of Featury

The work with actions can be tracked via `before` and `after` callbacks.

For each callback, you can specify what actions it should trigger.
By default, the callback will respond to all actions.

Inside the callback, there is data from the called action,
as well as feature flags from the called Featury object.

## Callback `before`

In this example, the `before` callback will be triggered when any of the actions are called.

```ruby
before do |action:, features:|
  Slack::API::Notify.call!(action:, features:)
end
```

## Callback `after`

In this example, the `after` callback will only fire when the `enabled?` or `disabled?` action is called.

```ruby
after :enabled?, :disabled? do |action:, features:|
  Slack::API::Notify.call!(action:, features:)
end
```
