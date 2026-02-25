---
title: サービス内のアクションのオプション
description: サービス内のアクション（メソッド）のオプションの使い方に関する説明と例
prev: サービス内のアクションの使い方
next: サービス内のアクションのグルーピング
---

# アクションのオプション

## オプション`if`

メソッド呼び出しの前に`if`条件を確認します。

```ruby{2}
make :something,
     if: ->(context:) { Settings.features.preview.enabled }

def something
  # ...
end
```

## オプション`unless`

`if`オプションの逆です。

```ruby{2}
make :something,
     unless: ->(context:) { Settings.features.preview.disabled }

def something
  # ...
end
```

## オプション`position`

すべてのメソッドにはポジションがあります。
`position`を使用すると、`make`で追加された時点とは異なるタイミングでメソッドを呼び出せます。
サービスの継承で便利です。

```ruby{3,14}
class SomeApiService::Base < ApplicationService::Base
  make :api_request!,
       position: 2

  # ...
end

class SomeApiService::Posts::Create < SomeApiService::Base
  input :post_name, type: String

  # ...
  
  make :validate!,
       position: 1

  private

  def validate!
    # ...
  end

  # ...
end
```
