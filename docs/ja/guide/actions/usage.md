---
title: サービス内のアクションの使い方
description: サービス内のアクション（メソッド）の使い方に関する説明と例
prev: ダイナミックオプション
next: サービス内のアクションのオプション
---

# アクションの使い方

サービス内のアクションは、メソッドを順次呼び出すものです。
サービスのメソッドは`make`メソッドを使用して呼び出します。

## 例

### 最小構成

最小構成では、`make`によるメソッド呼び出しは任意です。
代わりに`call`メソッドを使用できます。

```ruby
class PostsService::Create < ApplicationService::Base
  def call
    # something
  end
end
```

### 複数のメソッド

```ruby{4-6,8,12,16}
class PostsService::Create < ApplicationService::Base
  # ...

  make :assign_api_model
  make :perform_api_request
  make :process_result

  def assign_api_model
    internals.api_model = APIModel.new(...)
  end

  def perform_api_request
    internals.response = APIClient.resource.create(internals.api_model)
  end

  def process_result
    ARModel.create!(internals.response)
  end
end
```

## オプション

詳細は[オプション](../actions/options)セクションを参照してください。

## 複数のアクションのグループ

詳細は[グルーピング](../actions/grouping)セクションを参照してください。

## `make`のエイリアス

`action_aliases`設定で`make`メソッドの代替を追加します。

```ruby {2,5}
configuration do
  action_aliases %i[execute]
end

execute :something

def something
  # ...
end
```

## `make`のカスタマイズ

`action_shortcuts`設定でよく使うメソッド名のプレフィックスを追加します。
メソッド名の長さは変わりませんが、`make`の行が短く読みやすくなります。

### シンプルモード

シンプルモードでは、値はシンボルの配列として渡します。

```ruby
configuration do
  action_shortcuts %i[assign perform]
end
```

```ruby
class CMSService::API::Posts::Create < CMSService::API::Base
  # ...

  assign :model

  perform :request

  private

  def assign_model
    # Build model for API request
  end

  def perform_request
    # Perform API request
  end

  # ...
end
```

### アドバンスドモード <Badge type="tip" text="2.14.0以降" />

アドバンスドモードでは、値はハッシュとして渡します。

```ruby
configuration do
  action_shortcuts(
    %i[assign],
    {
      restrict: {           # replacement for make
      prefix: :create,      # method name prefix
      suffix: :restriction  # method name suffix
      }
    }
  )
end
```

```ruby
class PaymentsService::Restrictions::Create < ApplicationService::Base
  input :payment, type: Payment

  # The exclamation mark will be moved to the end of the method name
  restrict :payment!

  private

  def create_payment_restriction!
    inputs.payment.restrictions.create!(
      reason: "Suspicion of fraud"
    )
  end
end
```
