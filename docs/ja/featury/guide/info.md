---
title: Featuryオブジェクトの情報
description: Featuryオブジェクトの情報取得メソッドの説明と使用例
prev: false
next: false
---

# Featuryオブジェクトの情報

各Featuryオブジェクトについて情報を取得できます。

## メソッド`info`

```ruby [例]
info = User::OnboardingFeature.info
```

```ruby
info.features # Feature flags of the current class.
info.groups   # Feature flag groups of the current class.
info.tree     # Tree of feature flags from the current class.
```
