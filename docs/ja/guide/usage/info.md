---
title: サービス情報
description: サービス情報の取得に関する説明と使用例
prev: サービスの結果
next: サービスの入力アトリビュート
---

# サービス情報

サービスはinput、internal、outputアトリビュートの情報を外部に公開します。複雑なサービス処理やテストに役立ちます。

アトリビュートを持つサービスの例:

```ruby
class BuildFullName < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String, required: false
  input :last_name, type: String

  internal :prepared_full_name, type: String

  output :full_name, type: String

  # ...
end
```

アトリビュート情報へのアクセス:

```ruby
BuildFullName.info

# => #<Servactory::Info::Result:0x00000001118c7078 @inputs=[:first_name, :middle_name, :last_name], @internals=[:prepared_full_name], @outputs=[:full_name]>
```

```ruby
BuildFullName.info.inputs

# => [:first_name, :middle_name, :last_name]
```

```ruby
BuildFullName.info.internals

# => [:prepared_full_name]
```

```ruby
BuildFullName.info.outputs

# => [:full_name]
```
