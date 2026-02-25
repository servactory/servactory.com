---
title: Featuryのフィーチャーオブジェクト
description: Featuryフィーチャーオブジェクトの説明と使用例
prev: false
next: false
---

# Featuryのフィーチャーオブジェクト

フィーチャーオブジェクトには、1つの特定のフィーチャーフラグまたは複数のフィーチャーフラグの操作を含めることができます。
複数のフィーチャーフラグはグループとしても表現できます。これはネストされたフィーチャーオブジェクトです。

## プレフィックス

フィーチャーオブジェクトには常にプレフィックスがあります。
デフォルトでは、フィーチャーオブジェクトのクラス名に基づいて構築されます。
例えば、`User::OnboardingFeature`のデフォルトプレフィックスは`user_onboarding`になります。

プレフィックスは`prefix`メソッドで変更できます:

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding # [!code focus]
  
  # ...
end
```

## リソース

フィーチャーオブジェクトは、入力としてリソースの受け渡しを期待できます。
これらのリソースは、フィーチャーフラグの操作の補助としてアクション内で使用できます。

### オプション

#### オプション`option`

フィーチャーオブジェクトの呼び出し時にリソースを省略可能にします。
デフォルトは`false`です。

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User, option: true # [!code focus]

  # ...
end
```

#### オプション`nested`

`groups`を通じてネストされたフィーチャーオブジェクトにリソースを渡します。
デフォルトは`false`です。

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User, nested: true # [!code focus]

  # ...
end
```

## 条件

フィーチャーオブジェクトには、動作の基本条件を含めることができます。
例えば、特定の状態のリソースに対してのみ操作を許可したい場合に便利です。

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? } # [!code focus]

  # ...
end
```

## フィーチャーのセット

1つのフィーチャーオブジェクト内で、1つまたは複数のフィーチャーフラグを指定できます。

::: code-group

```ruby [1つ]
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? }

  features :passage # [!code focus]
end

```

```ruby [複数]
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? }

  features :passage, :integration # [!code focus]
end
```

:::

上記の`onboarding`プレフィックスの例と合わせると、以下のフィーチャーフラグが収集されます:

::: code-group

```ruby [1つ]
# => onboarding_passage
```

```ruby [複数]
# => onboarding_passage
# => onboarding_integration
```

:::

## フィーチャーセットのグループ

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? }

  features :passage

  groups BillingFeature, # [!code focus]
         PaymentSystemFeature # [!code focus]
end
