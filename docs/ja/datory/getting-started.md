---
title: Datoryの始め方
description: DatoryはRubyアプリケーションにおけるシリアライゼーションとデシリアライゼーションのためのデータマッピングツールです
prev: false
next: false
---

# Datoryの始め方

## バージョンサポート

| Ruby/Rails | 8.1 | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|------------|---|---|---|---|---|---|---|---|---|---|
| 4.0        | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1        | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## インストール

`Gemfile`に以下を追加してください:

```ruby
gem "datory"
```

次に以下を実行してください:

```shell
bundle install
```

## 準備

最初のステップとして、継承用のベースクラスを準備することを推奨します。

### DTOの場合

::: code-group

```ruby [app/dtos/application_dto/base.rb]
module ApplicationDTO
  class Base < Datory::Base
  end
end
```

:::

### フォームの場合

::: code-group

```ruby [app/forms/application_form/base.rb]
module ApplicationForm
  class Base < Datory::Base
  end
end
```

:::
