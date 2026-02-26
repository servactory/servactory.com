---
title: RSpec — サービスのテスト
description: RSpecを使用したサービスのテストの説明と例
outline:
  level: deep
prev: 設定
next: RSpec (Legacy)
---

# RSpec <Badge type="tip" text="3.0.0以降" />

このページではメソッドチェーンをサポートする推奨テストヘルパーを説明します。

## インストール

::: code-group

```ruby [spec/rails_helper.rb]
require "servactory/test_kit/rspec/helpers"
require "servactory/test_kit/rspec/matchers"
```

:::

::: code-group

```ruby [spec/rails_helper.rb]
RSpec.configure do |config|
  config.include Servactory::TestKit::Rspec::Helpers
  config.include Servactory::TestKit::Rspec::Matchers

  # ...
end
```

:::

## ヘルパー

### ヘルパー`allow_service`

`.call`呼び出しを指定された結果でモックします。

メソッドチェーンをサポートするビルダーオブジェクトを返します。

```ruby
before do
  allow_service(PaymentService)
    .succeeds(transaction_id: "txn_123", status: :completed)
end
```

### ヘルパー`allow_service!`

`.call!`呼び出しを指定された結果でモックします。

失敗が設定された場合、エラー付きResultを返す代わりに例外をスローします。

```ruby
before do
  allow_service!(PaymentService)
    .succeeds(transaction_id: "txn_123", status: :completed)
end
```

### チェーンメソッド

#### `succeeds`

指定されたoutputで成功結果を返すようにモックを設定します。

```ruby
allow_service(PaymentService)
  .succeeds(transaction_id: "txn_123", status: :completed)
```

#### `fails`

失敗結果を返すようにモックを設定します。

```ruby
allow_service(PaymentService)
  .fails(type: :payment_declined, message: "Card declined")
```

メタ情報付き:

```ruby
allow_service(PaymentService)
  .fails(type: :validation, message: "Invalid amount", meta: { field: :amount })
```

カスタム例外クラス付き:

```ruby
allow_service(PaymentService)
  .fails(
    CustomException,
    type: :payment_declined,
    message: "Card declined"
  )
```

#### `with`

モックがマッチする期待されるinputを指定します。

```ruby
allow_service(PaymentService)
  .with(amount: 100, currency: "USD")
  .succeeds(transaction_id: "txn_100")
```

`with`メソッドは引数マッチャーをサポートします（[引数マッチャー](#引数マッチャー)を参照）。

#### `then_succeeds`

複数回の呼び出しに対して連続する戻り値を設定します。

```ruby
allow_service(RetryService)
  .succeeds(status: :pending)
  .then_succeeds(status: :completed)
```

#### `then_fails`

次の呼び出しで失敗する連続戻り値を設定します。

```ruby
allow_service(RetryService)
  .succeeds(status: :pending)
  .then_fails(type: :timeout, message: "Request timed out")
```

### 引数マッチャー

#### `including`

少なくとも指定されたキーと値のペアを含むinputにマッチします。

```ruby
allow_service(OrderService)
  .with(including(quantity: 5))
  .succeeds(total: 500)
```

```ruby
allow_service(OrderService)
  .with(including(product_id: "PROD-001", quantity: 5))
  .succeeds(total: 1000)
```

#### `excluding`

指定されたキーを含まないinputにマッチします。

```ruby
allow_service(OrderService)
  .with(excluding(secret_key: anything))
  .succeeds(total: 750)
```

#### `any_inputs`

サービスに渡されるすべての引数にマッチします。

```ruby
allow_service(NotificationService)
  .with(any_inputs)
  .succeeds(sent: true)
```

#### `no_inputs`

引数が渡されない場合にマッチします。

```ruby
allow_service(HealthCheckService)
  .with(no_inputs)
  .succeeds(healthy: true)
```

### 自動バリデーション

ヘルパーはサービス定義に対してinputとoutputを自動的に検証します。

#### Inputバリデーション

`with`を使用する場合、ヘルパーは指定されたinputがサービスに存在するかを検証します。

```ruby
# Raises ValidationError: unknown_input is not defined in ServiceClass
allow_service!(ServiceClass)
  .with(unknown_input: "value")
  .succeeds(result: "ok")
```

#### Outputバリデーション

ヘルパーは指定されたoutputが存在し、期待される型に一致するかを検証します。

```ruby
# Raises ValidationError: unknown_output is not defined in ServiceClass
allow_service!(ServiceClass)
  .succeeds(unknown_output: "value")
```

```ruby
# Raises ValidationError: order_number expects Integer, got String
allow_service!(ServiceClass)
  .succeeds(order_number: "not_an_integer")
```

## 例

::: code-group

```ruby [RSpec]
RSpec.describe Users::Create, type: :service do
  describe ".call!" do
    subject(:perform) { described_class.call!(**attributes) }

    let(:attributes) do
      {
        email:,
        first_name:,
        last_name:
      }
    end

    let(:email) { "john@example.com" }
    let(:first_name) { "John" }
    let(:last_name) { "Kennedy" }

    describe "validations" do
      describe "inputs" do
        it do
          expect { perform }.to(
            have_input(:email)
              .type(String)
              .required
          )
        end

        it do
          expect { perform }.to(
            have_input(:first_name)
              .type(String)
              .required
          )
        end

        it do
          expect { perform }.to(
            have_input(:last_name)
              .type(String)
              .optional
          )
        end
      end

      describe "internals" do
        it do
          expect { perform }.to(
            have_internal(:email_verification)
              .type(Servactory::Result)
          )
        end
      end

      describe "outputs" do
        it do
          expect(perform).to(
            have_output(:user)
              .instance_of(User)
          )
        end
      end
    end

    describe "and the data required for work is also valid" do
      before do
        allow_service!(EmailVerificationService)
          .with(email: "john@example.com")
          .succeeds(valid: true, normalized: "john@example.com")
      end

      it do
        expect(perform).to(
          be_success_service
            .with_output(:user, be_a(User))
        )
      end
    end

    describe "but the data required for work is invalid" do
      describe "because email verification fails" do
        before do
          allow_service!(EmailVerificationService)
            .fails(type: :invalid_email, message: "Email is not valid")
        end

        it "returns expected error", :aggregate_failures do
          expect { perform }.to(
            raise_error do |exception|
              expect(exception).to be_a(ApplicationService::Exceptions::Failure)
              expect(exception.type).to eq(:invalid_email)
              expect(exception.message).to eq("Email is not valid")
              expect(exception.meta).to be_nil
            end
          )
        end
      end
    end
  end
end
```

```ruby [サービス]
class Users::Create < ApplicationService::Base
  input :email, type: String
  input :first_name, type: String
  input :last_name, type: String, required: false

  internal :email_verification, type: Servactory::Result

  output :user, type: User

  make :verify_email
  make :create_user

  private

  def verify_email
    internals.email_verification = EmailVerificationService.call!(
      email: inputs.email
    )
  end

  def create_user
    outputs.user = User.create!(
      email: internals.email_verification.normalized,
      first_name: inputs.first_name,
      last_name: inputs.last_name
    )
  end
end
```

:::

## マッチャー

### マッチャー`have_input` <Badge type="info" text="have_service_input" />

#### `type`

inputの型を検証します。単一の値を対象とします。

```ruby
it do
  expect { perform }.to(
    have_input(:id)
      .type(Integer)
  )
end
```

#### `types`

inputの型を検証します。複数の値を対象とします。

```ruby
it do
  expect { perform }.to(
    have_input(:id)
      .types(Integer, String)
  )
end
```

#### `required`

inputが必須であるかを検証します。

```ruby
it do
  expect { perform }.to(
    have_input(:id)
      .type(Integer)
      .required
  )
end
```

#### `optional`

inputが任意であるかを検証します。

```ruby
it do
  expect { perform }.to(
    have_input(:middle_name)
      .type(String)
      .optional
  )
end
```

#### `default`

inputのデフォルト値を検証します。

```ruby
it do
  expect { perform }.to(
    have_input(:middle_name)
      .type(String)
      .optional
      .default("<unknown>")
  )
end
```

#### `consists_of`

inputコレクションのネストされた型を検証します。複数の値を指定できます。

::: code-group

```ruby [messageなし]
it do
  expect { perform }.to(
    have_input(:ids)
      .type(Array)
      .required
      .consists_of(String)
  )
end
```

```ruby [messageあり]
it do
  expect { perform }.to(
    have_input(:ids)
      .type(Array)
      .required
      .consists_of(String)
      .message("Input `ids` must be a collection of `String`") # [!code focus]
  )
end
```

:::

#### `inclusion`

inputの`inclusion`オプションの値を検証します。

::: code-group

```ruby [messageなし]
it do
  expect { perform }.to(
    have_input(:event_name)
      .type(String)
      .required
      .inclusion(%w[created rejected approved])
  )
end
```

```ruby [messageあり]
it do
  expect { perform }.to(
    have_input(:event_name)
      .type(String)
      .required
      .inclusion(%w[created rejected approved])
      .message(be_a(Proc)) # [!code focus]
  )
end
```

:::

#### `target`

inputの`target`オプションの値を検証します。

::: code-group

```ruby [messageなし]
it do
  expect { perform }.to(
    have_input(:service_class)
      .type(Class)
      .target([MyFirstService, MySecondService])
  )
end
```

```ruby [messageあり]
it do
  expect { perform }.to(
    have_input(:service_class)
      .type(Class)
      .target([MyFirstService, MySecondService])
      .message("Must be a valid service class") # [!code focus]
  )
end
```

:::

#### `schema` <Badge type="info" text="input (^2.12.0)" /> <Badge type="info" text="internal (^2.12.0)" /> <Badge type="info" text="output (^2.12.0)" />

inputの`schema`オプションの値を検証します。

::: code-group

```ruby [messageなし]
it do
  expect { perform }.to(
    have_input(:payload)
      .type(Hash)
      .required
      .schema(
        {
          request_id: { type: String, required: true },
          user: {
            # ...
          }
        }
      )
  )
end
```

```ruby [messageあり]
it do
  expect { perform }.to(
    have_input(:payload)
      .type(Hash)
      .required
      .schema(
        {
          request_id: { type: String, required: true },
          user: {
            # ...
          }
        }
      )
      .message("Problem with the value in the schema") # [!code focus]
  )
end
```

:::

#### `message` <Badge type="info" text="input (^2.12.0)" /> <Badge type="info" text="internal (^2.12.0)" /> <Badge type="info" text="output (^2.12.0)" />

最後のチェーンの`message`を検証します。
現在は`consists_of`、`inclusion`、`schema`チェーンでのみ動作します。

```ruby
it do
  expect { perform }.to(
    have_input(:ids)
      .type(Array)
      .required
      .consists_of(String) # [!code focus]
      .message("Input `ids` must be a collection of `String`") # [!code focus]
  )
end
```

#### `must`

inputの`must`に期待されるキーが存在するかを検証します。
複数の値を指定できます。

```ruby
it do
  expect { perform }.to(
    have_input(:invoice_numbers)
      .type(Array)
      .consists_of(String)
      .required
      .must(:be_6_characters)
  )
end
```

### マッチャー`have_internal` <Badge type="info" text="have_service_internal" />

#### `type`

internal属性の型を検証します。単一の値を対象とします。

```ruby
it do
  expect { perform }.to(
    have_internal(:id)
      .type(Integer)
  )
end
```

#### `types`

internal属性の型を検証します。複数の値を対象とします。

```ruby
it do
  expect { perform }.to(
    have_internal(:id)
      .types(Integer, String)
  )
end
```

#### `consists_of`

internal属性コレクションのネストされた型を検証します。
複数の値を指定できます。

::: code-group

```ruby [messageなし]
it do
  expect { perform }.to(
    have_internal(:ids)
      .type(Array)
      .consists_of(String)
  )
end
```

```ruby [messageあり]
it do
  expect { perform }.to(
    have_internal(:ids)
      .type(Array)
      .consists_of(String)
      .message("Internal `ids` must be a collection of `String`") # [!code focus]
  )
end
```

:::

#### `inclusion`

internal属性の`inclusion`オプションの値を検証します。

::: code-group

```ruby [messageなし]
it do
  expect { perform }.to(
    have_internal(:event_name)
      .type(String)
      .inclusion(%w[created rejected approved])
  )
end
```

```ruby [messageあり]
it do
  expect { perform }.to(
    have_internal(:event_name)
      .type(String)
      .inclusion(%w[created rejected approved])
      .message(be_a(Proc)) # [!code focus]
  )
end
```

:::

#### `target`

internal属性の`target`オプションの値を検証します。

::: code-group

```ruby [messageなし]
it do
  expect { perform }.to(
    have_internal(:service_class)
      .type(Class)
      .target([MyFirstService, MySecondService])
  )
end
```

```ruby [messageあり]
it do
  expect { perform }.to(
    have_internal(:service_class)
      .type(Class)
      .target([MyFirstService, MySecondService])
      .message("Must be a valid service class") # [!code focus]
  )
end
```

:::

#### `schema` <Badge type="info" text="input (^2.12.0)" /> <Badge type="info" text="internal (^2.12.0)" /> <Badge type="info" text="output (^2.12.0)" />

internal属性の`schema`オプションの値を検証します。

::: code-group

```ruby [messageなし]
it do
  expect { perform }.to(
    have_internal(:payload)
      .type(Hash)
      .schema(
        {
          request_id: { type: String, required: true },
          user: {
            # ...
          }
        }
      )
  )
end
```

```ruby [messageあり]
it do
  expect { perform }.to(
    have_internal(:payload)
      .type(Hash)
      .schema(
        {
          request_id: { type: String, required: true },
          user: {
            # ...
          }
        }
      )
      .message("Problem with the value in the schema") # [!code focus]
  )
end
```

:::

#### `message` <Badge type="info" text="input (^2.12.0)" /> <Badge type="info" text="internal (^2.12.0)" /> <Badge type="info" text="output (^2.12.0)" />

最後のチェーンの`message`を検証します。
現在は`consists_of`、`inclusion`、`schema`チェーンでのみ動作します。

```ruby
it do
  expect { perform }.to(
    have_internal(:ids)
      .type(Array)
      .consists_of(String) # [!code focus]
      .message("Internal `ids` must be a collection of `String`") # [!code focus]
  )
end
```

#### `must`

internal属性の`must`に期待されるキーが存在するかを検証します。
複数の値を指定できます。

```ruby
it do
  expect { perform }.to(
    have_internal(:invoice_numbers)
      .type(Array)
      .consists_of(String)
      .must(:be_6_characters)
  )
end
```

### マッチャー`have_output` <Badge type="info" text="have_service_output" />

#### `instance_of`

output属性の型を検証します。

```ruby
it do
  expect(perform).to(
    have_output(:event)
      .instance_of(Event)
  )
end
```

#### `contains`

:::info

リリース`2.9.0`でチェーン`with`は`contains`に名前変更されました。

:::

output属性の値を検証します。

```ruby
it do
  expect(perform).to(
    have_output(:full_name)
      .contains("John Fitzgerald Kennedy")
  )
end
```

#### `nested`

output属性のネストされた値を指し示します。

```ruby
it do
  expect(perform).to(
    have_output(:event)
      .nested(:id)
      .contains("14fe213e-1b0a-4a68-bca9-ce082db0f2c6")
  )
end
```

### マッチャー`be_success_service`

::: code-group

```ruby [minimal]
it { expect(perform).to be_success_service }
```

:::

#### `with_output`

```ruby
it do
  expect(perform).to(
    be_success_service
      .with_output(:id, "...")
  )
end
```

#### `with_outputs`

```ruby
it do
  expect(perform).to(
    be_success_service
      .with_outputs(
        id: "...",
        full_name: "...",
        # ...
      )
  )
end
```

### マッチャー`be_failure_service`

::: code-group

```ruby [minimal]
it { expect(perform).to be_failure_service }
```

```ruby [full]
it "returns expected failure" do
  expect(perform).to(
    be_failure_service
      .with(ApplicationService::Exceptions::Failure)
      .type(:base)
      .message("Some error")
      .meta(nil)
  )
end
```

:::

#### `with`

```ruby
it "returns expected failure" do
  expect(perform).to(
    be_failure_service
      .with(ApplicationService::Exceptions::Failure)
  )
end
```

#### `type`

```ruby
it "returns expected failure" do
  expect(perform).to(
    be_failure_service
      .type(:base)
  )
end
```

#### `message`

```ruby
it "returns expected failure" do
  expect(perform).to(
    be_failure_service
      .message("Some error")
  )
end
```

#### `meta`

```ruby
it "returns expected failure" do
  expect(perform).to(
    be_failure_service
      .meta(nil)
  )
end
```
