---
title: Featury始め方
description: 要件、規約、インストール、基本準備の例
prev: false
next: false
---

# Featury始め方

## 規約

- すべてのフィーチャークラスは`Featury::Base`のサブクラスであり、`app/features`ディレクトリに配置します。一般的な方法として`ApplicationFeature::Base`クラスを作成し、`Featury::Base`のサブクラスとして継承します。
- フィーチャーは関連するプロセスに基づいて命名します。名前には名詞を使用し、可能な限りモデル名と一致させてください。例: `User::OnboardFeature`ではなく`User::OnboardingFeature`と命名します。

## バージョンサポート

| Ruby/Rails | 8.1 | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|------------|---|---|---|---|---|---|---|---|---|---|
| 4.0        | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1        | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## インストール

`Gemfile`に以下を追加します:

```ruby
gem "featury"
```

そして以下を実行します:

```shell
bundle install
```

## 準備

まず、継承用の基底クラスを準備することを推奨します。
この基底クラスには、プロジェクトのフィーチャーツールと統合されたアクションを含める必要があります。
例えば、ActiveRecordモデル、Flipper、またはその他のツールが使用できます。

### ActiveRecordモデル

例として`FeatureFlag`モデルを使用します。

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

    before do |action:, features:|
      Slack::API::Notify.call!(action:, features:)
    end

    after :enabled?, :disabled? do |action:, features:|
      Slack::API::Notify.call!(action:, features:)
    end
  end
end
```

:::
