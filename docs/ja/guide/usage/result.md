---
title: サービスの結果
description: サービスの結果の使用に関する説明と例
prev: サービスの呼び出し
next: サービス情報
---

# サービスの結果

サービスの呼び出しは毎回結果を返します（例外がスローされない限り）。結果は成功または失敗のいずれかです。

## 成功の結果

成功の結果は、すべての操作が問題なく完了したことを示します。

例:

```ruby
service_result = Users::Accept.call(user: User.first)
```

返却値:

```ruby
# => <ApplicationService::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

## 失敗の結果

失敗の結果は、内部で想定された問題が発生したことを示します。想定された問題は例外をスローせず、`fail!`メソッドを通じて呼び出されます。

失敗の結果は`.call`メソッドを使用した場合にのみ発生します。これにより外部APIからのレスポンスを処理できます。

失敗時の結果の例:

```ruby
# => <ApplicationService::Result @error=There is some problem with the user, @failure?=true, @success?=false>
```

## 結果の内容

`Result`は結果に関わらずデータを含みます。

成功時にはすべてのoutputアトリビュートが利用可能です。ヘルパーメソッド`success?`と`failure?`で結果を判定します。

```ruby
service_result = Users::Accept.call(user: User.first)

service_result.success? # => true
service_result.failure? # => false
```

失敗時には`Result`にエラーの詳細な説明を含む`error`も格納されます。

```ruby
service_result = Users::Accept.call(user: User.first)

service_result.success? # => false
service_result.failure? # => true

service_result.error
# => #<ApplicationService::Exceptions::Failure: There is some problem with the user>
```

サービスの失敗について詳しくは[こちら](../exceptions/failure)をご覧ください。

## 結果の処理

`call`による呼び出し後に結果を処理します。

2つの方法があります: `success?`/`failure?`メソッド、または`on_success`/`on_failure`フックです。

### メソッド

#### メソッド`success?`

```ruby
service_result = Notifications::Slack::Error::Send.call(...)

return if service_result.success?

fail!(
  message: "The message was not sent to Slack",
  meta: { reason: service_result.error.message }
)
```

#### メソッド`failure?`

`failure?`に型を渡すと特定の失敗タイプを確認できます。[失敗タイプ](../exceptions/failure#メソッドfail)を参照してください。デフォルトの型は`all`（すべての失敗タイプに一致）です。

```ruby
service_result = Notifications::Slack::Error::Send.call(...)

return unless service_result.failure?

fail!(
  message: "The message was not sent to Slack", 
  meta: { reason: service_result.error.message }
)
```

特定の失敗タイプを確認する場合:

```ruby
service_result = Notifications::Slack::Error::Send.call(...)

return unless service_result.failure?(:validation)

fail!(
    message: "The message was not sent to Slack",
    meta: { reason: service_result.error.message }
)
```

述語メソッドで便利な型チェックが可能です:

::: warning

`Result`のoutputアトリビュートにも述語メソッドがあります。名前の衝突を避けてください。

:::

```ruby
service_result = Notifications::Slack::Error::Send.call(...)

return unless service_result.all?

fail!(
  message: "The message was not sent to Slack",
  meta: { reason: service_result.error.message }
)
```

### フック

結果処理の代替アプローチです:

```ruby
Notifications::Slack::Error::Send
  .call(...)
  .on_failure do |exception:| 
    fail!(
      message: "The message was not sent to Slack", 
      meta: { reason: exception.message }
    )
  end
```

`on_success`メソッドはすべてのoutputアトリビュートを含む`outputs`引数を提供します。`on_failure`に型を渡すこともできます:

```ruby
Notifications::Slack::Error::Send
  .call(...)
  .on_success do |outputs:|
    notification.update!(original_data: outputs.response)
  end.on_failure(:all) do |exception:| 
    fail!(
      message: "The message was not sent to Slack", 
      meta: { reason: exception.message }
    )
  end
```
