---
title: Featuryオブジェクトのアクション
description: Featuryオブジェクトのアクションの説明と使用例
prev: false
next: false
---

# Featuryのアクション

Featuryでフィーチャーフラグを操作するには、アクションを作成する必要があります。
各アクションでは、受け取ったフィーチャーフラグの名前と追加オプションに対するロジックを実装します。

## 例

例として、プロジェクトのすべてのフィーチャーフラグを管理するActiveRecordモデルがあるとします。
このモデルは`FeatureFlag`という名前です。

また、プロジェクトでフィーチャーフラグを操作するために4つのアクションが必要だとします:

- `enabled?`
- `disabled?`
- `enable`
- `disable`

この場合、Featuryのアクションは次のようになります:

::: code-group

```ruby [app/features/application_feature/base.rb]
module ApplicationFeature
  class Base < Featury::Base
    action :enabled? do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .enabled?
      end
    end

    action :disabled? do |features:, **options|
      features.any? do |feature|
        !FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .enabled?
      end
    end

    action :enable do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .update!(enabled: true)
      end
    end

    action :disable do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .update!(enabled: false)
      end
    end
  end
end
```

:::
