---
title: 始め方
description: 要件、規約、インストール、基本準備の例
prev: Servactoryを選ぶ理由
next: サービスの呼び出しと実行結果
---

# Servactoryの始め方

## 規約

- サービスは`Servactory::Base`を継承し、`app/services`に配置します。一般的な方法: サービス用の基底クラスとして`ApplicationService::Base`を作成します。
- ドメインごとに名前空間でサービスをグループ化し、クラス名にはアクションを表す動詞を使用します。例: `Users::Create`、`Orders::Process`。名前空間に`Service`を含めないでください — `app/services`ディレクトリがそのコンテキストを提供します。

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
gem "servactory"
```

そして以下を実行します:

```shell
bundle install
```

## 準備

まず、継承用の基底クラスを準備します。

### 自動 <Badge type="tip" text="2.5.0以降" />

ジェネレーターを実行します:

```shell
bundle exec rails g servactory:install
```

必要なファイルがすべて作成されます。

利用可能なすべてのオプションとジェネレーターについては、[Railsジェネレーター](/ja/guide/rails/generators)を参照してください。

### 手動

#### ApplicationService::Exceptions

::: code-group

```ruby [app/services/application_service/exceptions.rb]
module ApplicationService
  module Exceptions
    class Input < Servactory::Exceptions::Input; end
    class Output < Servactory::Exceptions::Output; end
    class Internal < Servactory::Exceptions::Internal; end

    class Failure < Servactory::Exceptions::Failure; end
  end
end
```

:::

#### ApplicationService::Result <Badge type="tip" text="2.5.0以降" />

::: code-group

```ruby [app/services/application_service/result.rb]
module ApplicationService
  class Result < Servactory::Result; end
end
```

:::

#### ApplicationService::Base

::: code-group

```ruby [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_exception_class ApplicationService::Exceptions::Input
      internal_exception_class ApplicationService::Exceptions::Internal
      output_exception_class ApplicationService::Exceptions::Output

      failure_class ApplicationService::Exceptions::Failure

      result_class ApplicationService::Result
    end
  end
end
```

:::

## 最初のサービス

最初のサービスを作成します:

```shell
bundle exec rails g servactory:service users/create first_name middle_name last_name
```

スペックファイルを生成します:

```shell
bundle exec rails g servactory:rspec users/create first_name middle_name last_name
```
