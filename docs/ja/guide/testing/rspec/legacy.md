---
title: RSpec (Legacy) — サービスのテスト
description: RSpecを使用したサービスのテストの説明と例
outline:
  level: deep
prev: RSpec
next: RSpecマイグレーション
---

# RSpec (Legacy) <Badge type="tip" text="2.5.0以降" />

:::warning

この機能は非推奨であり、後方互換性のためにのみ維持されます。
新しいテストには[新しいテストAPI](./fluent)の使用を推奨します。
段階的な手順については[マイグレーションガイド](./migration)を参照してください。

:::

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

## 例

### 構造

- `.call!`または`call`:
  - `subject`;
  - `validations`:
    - `inputs`;
    - `internals`;
    - `outputs`;
  - `when required data for work is valid`:
    - `be_success_service`;
    - `have_output`.
  - `when required data for work is invalid`:
    - `be_failure_service`.

### ファイル

::: code-group

```ruby [RSpec]
RSpec.describe Users::Create, type: :service do
  describe ".call!" do
    subject(:perform) { described_class.call!(**attributes) }

    let(:attributes) do
      {
        first_name:,
        middle_name:,
        last_name:
      }
    end

    let(:first_name) { "John" }
    let(:middle_name) { "Fitzgerald" }
    let(:last_name) { "Kennedy" }

    describe "validations" do
      describe "inputs" do
        it do
          expect { perform }.to(
            have_input(:first_name)
              .valid_with(attributes)
              .type(String)
              .required
          )
        end

        it do
          expect { perform }.to(
            have_input(:middle_name)
              .valid_with(attributes)
              .type(String)
              .optional
          )
        end

        it do
          expect { perform }.to(
            have_input(:last_name)
              .valid_with(attributes)
              .type(String)
              .required
          )
        end
      end

      describe "outputs" do
        it do
          expect(perform).to(
            have_output(:full_name)
              .instance_of(String)
          )
        end
      end
    end

    context "when required data for work is valid" do
      it { expect(perform).to be_success_service }

      it do
        expect(perform).to(
          have_output(:full_name)
            .contains("John Fitzgerald Kennedy")
        )
      end

      describe "even if `middle_name` is not specified" do
        let(:middle_name) { nil }

        it do
          expect(perform).to(
            have_output(:full_name)
              .contains("John Kennedy")
          )
        end
      end
    end
  end
end
```

```ruby [サービス]
class Users::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String, required: false
  input :last_name, type: String

  output :full_name, type: String

  make :assign_full_name

  private

  def assign_full_name
    outputs.full_name = [
      inputs.first_name,
      inputs.middle_name,
      inputs.last_name
    ].compact.join(" ")
  end
end
```

:::

## ヘルパー

### ヘルパー`allow_service_as_success!`

`.call!`呼び出しを成功結果でモックします。

```ruby
before do
  allow_service_as_success!(Users::Accept)
end
```

```ruby
before do
  allow_service_as_success!(Users::Accept) do
    {
      user: user
    }
  end
end
```

### ヘルパー`allow_service_as_success`

`.call`呼び出しを成功結果でモックします。

```ruby
before do
  allow_service_as_success(Users::Accept)
end
```

```ruby
before do
  allow_service_as_success(Users::Accept) do
    {
      user: user
    }
  end
end
```

### ヘルパー`allow_service_as_failure!`

`.call!`呼び出しを失敗結果でモックします。

```ruby
before do
  allow_service_as_failure!(Users::Accept) do
    ApplicationService::Exceptions::Failure.new(
      message: "Some error"
    )
  end
end
```

### ヘルパー`allow_service_as_failure`

`.call`呼び出しを失敗結果でモックします。

```ruby
before do
  allow_service_as_failure(Users::Accept) do
    ApplicationService::Exceptions::Failure.new(
      message: "Some error"
    )
  end
end
```

### オプション

#### オプション`with`

メソッド`allow_service_as_success!`、`allow_service_as_success`、
`allow_service_as_failure!`、および`allow_service_as_failure`は`with`オプションをサポートします。

デフォルトでは、このオプションはサービス引数の受け渡しを必要とせず、
`info`メソッドに基づいてデータを自動的に決定します。

```ruby
before do
  allow_service_as_success!(
    Users::Accept,
    with: { user: user } # [!code focus]
  )
end
```

```ruby
before do
  allow_service_as_success!(
    Users::Accept,
    with: { user: user } # [!code focus]
  ) do
    {
      user: user
    }
  end
end
```

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
    have_input(:ids)
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

#### `valid_with`

このチェーンは渡されたデータに基づいてinputの実際の動作を検証します。

```ruby
subject(:perform) { described_class.call!(**attributes) }

let(:attributes) do
  {
    first_name: first_name,
    middle_name: middle_name,
    last_name: last_name
  }
end

it do
  expect { perform }.to(
    have_input(:first_name)
      .valid_with(attributes)
      .type(String)
      .required
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
    have_internal(:ids)
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
      .message("Input `ids` must be a collection of `String`") # [!code focus]
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
      .message("Input `ids` must be a collection of `String`") # [!code focus]
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
