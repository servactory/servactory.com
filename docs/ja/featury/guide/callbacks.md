---
title: Featuryオブジェクトのコールバック
description: Featuryオブジェクトのコールバックの説明と使用例
prev: false
next: false
---

# Featuryのコールバック

アクションの動作は`before`と`after`のコールバックで追跡できます。

各コールバックに対して、どのアクションで発火するかを指定できます。
デフォルトでは、コールバックはすべてのアクションに反応します。

コールバックの内部では、呼び出されたアクションのデータと、
呼び出されたFeaturyオブジェクトのフィーチャーフラグにアクセスできます。

## コールバック`before`

この例では、`before`コールバックはいずれかのアクションが呼び出されたときに発火します。

```ruby
before do |action:, features:|
  Slack::API::Notify.call!(action:, features:)
end
```

## コールバック`after`

この例では、`after`コールバックは`enabled?`または`disabled?`アクションが呼び出されたときのみ発火します。

```ruby
after :enabled?, :disabled? do |action:, features:|
  Slack::API::Notify.call!(action:, features:)
end
```
