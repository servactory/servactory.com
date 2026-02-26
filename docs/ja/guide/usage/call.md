---
title: サービスの呼び出し
description: サービスの呼び出しに関する説明と例
prev: 始め方
next: サービスの結果
---

# サービスの呼び出し

サービスは`.call`または`.call!`メソッドで呼び出します。

## メソッド`.call!`

`.call!`メソッドはサービス内で問題が発生した場合に例外をスローします。

::: code-group

```ruby [呼び出し]
Users::Accept.call!(user: User.first)
```

```ruby [成功]
# => #<ApplicationService::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

```ruby [失敗]
# => ApplicationService::Exceptions::Input: [Users::Accept] Required input `user` is missing

# => ApplicationService::Exceptions::Failure: There is some problem with the user
```

:::

## メソッド`.call`

`.call`メソッドはinput、internal、outputアトリビュートの問題に対して例外をスローします。その他のエラーはキャプチャされ、`Result`クラスを通じて提供されます。

::: code-group

```ruby [呼び出し]
Users::Accept.call(user: User.first)
```

```ruby [成功]
# => #<ApplicationService::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

```ruby [失敗]
# => ApplicationService::Exceptions::Input: [Users::Accept] Required input `user` is missing

# => #<ApplicationService::Result @error=There is some problem with the user, @failure?=true, @success?=false>
```

:::
