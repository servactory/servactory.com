---
title: マイグレーションガイド — LegacyからFluentへ
description: Legacy RSpecヘルパーから新しいFluent APIへの移行方法
outline:
  level: deep
prev: RSpec (Legacy)
next: 拡張機能
---

# マイグレーションガイド <Badge type="tip" text="3.0.0以降" />

このガイドはLegacy RSpecヘルパーから新しいFluent APIへの移行を支援します。

## クイックリファレンス

| Legacy | Fluent |
|--------|--------|
| `allow_service_as_success!(S) { out }` | `allow_service!(S).succeeds(out)` |
| `allow_service_as_success(S) { out }` | `allow_service(S).succeeds(out)` |
| `allow_service_as_failure!(S) { exc }` | `allow_service!(S).fails(type:, message:)` |
| `allow_service_as_failure(S) { exc }` | `allow_service(S).fails(type:, message:)` |

## Successモックの移行

### 基本的なSuccess

::: code-group

```ruby [Legacy]
before do
  allow_service_as_success!(UsersService::Create) do
    { user: user }
  end
end
```

```ruby [Fluent]
before do
  allow_service!(UsersService::Create)
    .succeeds(user: user)
end
```

:::

### Inputマッチング付きSuccess

::: code-group

```ruby [Legacy]
before do
  allow_service_as_success!(PaymentService, with: { amount: 100 }) do
    { transaction_id: "txn_123" }
  end
end
```

```ruby [Fluent]
before do
  allow_service!(PaymentService)
    .with(amount: 100)
    .succeeds(transaction_id: "txn_123")
end
```

:::

## Failureモックの移行

### 基本的なFailure

::: code-group

```ruby [Legacy]
before do
  allow_service_as_failure!(PaymentService) do
    {
      exception: ApplicationService::Exceptions::Failure.new(
        type: :payment_declined,
        message: "Card declined"
      )
    }
  end
end
```

```ruby [Fluent]
before do
  allow_service!(PaymentService)
    .fails(type: :payment_declined, message: "Card declined")
end
```

:::

### Meta付きFailure

::: code-group

```ruby [Legacy]
before do
  allow_service_as_failure!(ValidationService) do
    {
      exception: ApplicationService::Exceptions::Failure.new(
        type: :validation,
        message: "Invalid input",
        meta: { field: :email }
      )
    }
  end
end
```

```ruby [Fluent]
before do
  allow_service!(ValidationService)
    .fails(
      type: :validation,
      message: "Invalid input",
      meta: { field: :email }
    )
end
```

:::

### カスタム例外クラス付きFailure

::: code-group

```ruby [Legacy]
before do
  allow_service_as_failure!(PaymentService) do
    {
      exception: CustomPaymentException.new(
        type: :declined,
        message: "Insufficient funds"
      )
    }
  end
end
```

```ruby [Fluent]
before do
  allow_service!(PaymentService)
    .fails(
      CustomPaymentException,
      type: :declined,
      message: "Insufficient funds"
    )
end
```

:::

## Fluent APIの新機能

### 連続呼び出し

異なる結果で複数回呼び出されるサービスをテストします。

```ruby
before do
  allow_service!(RetryService)
    .succeeds(status: :pending)
    .then_succeeds(status: :processing)
    .then_succeeds(status: :completed)
end
```

### Success後のFailure

最終的に失敗するリトライシナリオをテストします。

```ruby
before do
  allow_service!(ExternalApiService)
    .succeeds(response: { status: "pending" })
    .then_fails(type: :timeout, message: "Request timed out")
end
```

### カスタム例外クラス

```ruby
before do
  allow_service!(PaymentService)
    .fails(
      CustomPaymentException,
      type: :declined,
      message: "Insufficient funds"
    )
end
```

## 主な違い

| 観点 | Legacy | Fluent |
|------|--------|--------|
| スタイル | ブロックベース | メソッドチェーン |
| Outputs | ブロックからの戻り値 | 引数として渡す |
| 例外 | ブロック内で手動作成 | パラメータから構築 |
| 連続呼び出し | 非対応 | `then_succeeds`、`then_fails` |
| バリデーション | 基本的 | サービス定義に基づく自動検証 |

## 移行不要なもの

以下のコンポーネントはLegacyとFluent APIの間で**変更なし**です。

### マッチャー

すべてのマッチャーは両方のAPIで同じように動作します。

- `have_input` / `have_service_input`
- `have_internal` / `have_service_internal`
- `have_output` / `have_service_output`
- `be_success_service`
- `be_failure_service`

```ruby
# These tests work the same way in Legacy and Fluent
it { expect { perform }.to have_input(:email).type(String).required }
it { expect { perform }.to have_internal(:result).type(Servactory::Result) }
it { expect(perform).to have_output(:user).instance_of(User) }
it { expect(perform).to be_success_service }
it { expect(perform).to be_failure_service }
```

### インストール

インストール手順は同一です — 同じrequire、同じRSpec設定です。
