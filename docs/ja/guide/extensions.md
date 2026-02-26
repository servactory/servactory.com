---
title: 拡張機能
description: Stromaフックシステムを使用したカスタム拡張機能でサービスの機能を拡張する
prev: RSpecマイグレーション
next: Railsジェネレーター
---

# 拡張機能 <Badge type="tip" text="3.0.0以降" />

拡張機能は[Stroma](https://github.com/servactory/stroma)フックシステムを通じて基底サービスの機能を拡張できます。
サービス実行ステージの前後に実行されるカスタム動作を定義します。

`app/services/application_service/extensions`ディレクトリに拡張機能を作成します。

## クイックスタート

### 拡張機能の生成

```shell
rails generate servactory:extension StatusActive
```

`app/services/application_service/extensions/status_active/dsl.rb`が作成されます。

### 拡張機能の接続

::: code-group

```ruby {4-6} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    extensions do
      before :actions, ApplicationService::Extensions::StatusActive::DSL
    end
  end
end
```

:::

### サービスでの使用

```ruby {5}
class Posts::Create < ApplicationService::Base
  input :user, type: User
  input :title, type: String

  status_active! :user

  make :create_post

  private

  def create_post
    # ...
  end
end
```

## 拡張機能の作成

### ジェネレーターの使用

```shell
rails generate servactory:extension MyExtension
```

オプション:

| オプション | デフォルト | 説明 |
|------------|-----------|------|
| `--path` | `app/services/application_service/extensions` | 出力ディレクトリ |
| `--namespace` | `ApplicationService` | 基底ネームスペース |

例:

```shell
# Basic
rails generate servactory:extension Auditable

# Nested namespace
rails generate servactory:extension Admin::AuditTrail

# Custom path
rails generate servactory:extension MyExtension --path=lib/extensions
```

### 拡張機能の構造

::: code-group

```ruby [app/services/application_service/extensions/my_extension/dsl.rb]
module ApplicationService
  module Extensions
    module MyExtension
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def my_extension!(value)
            stroma.settings[:actions][:my_extension][:value] = value
          end
        end

        module InstanceMethods
          private

          def call!(**)
            value = self.class.stroma.settings[:actions][:my_extension][:value]

            if value.present?
              # Before logic
            end

            super

            # After logic
          end
        end
      end
    end
  end
end
```

:::

### モジュール構造の説明

| モジュール | 目的 |
|------------|------|
| `DSL` | エントリーポイントモジュール、フックで接続 |
| `ClassMethods` | クラス定義時に呼び出されるDSLメソッド |
| `InstanceMethods` | サービス実行時に呼び出されるランタイムメソッド |

- `base.extend(ClassMethods)` — クラスレベルの設定メソッドを追加
- `base.include(InstanceMethods)` — インスタンスレベルのランタイム動作を追加

### ファイル構成

複雑な拡張機能の場合、別々のファイルに分割します。

```
extensions/my_extension/
├── dsl.rb              # Main DSL module with self.included
├── class_methods.rb    # ClassMethods module
└── instance_methods.rb # InstanceMethods module
```

## 拡張機能の接続

### フック: beforeとafter

```ruby
class ApplicationService::Base < Servactory::Base
  extensions do
    before :actions, ApplicationService::Extensions::Authorization::DSL
    after :actions, ApplicationService::Extensions::Publishable::DSL
  end
end
```

### 利用可能なフックキー

フックは以下のステージ（実行順序）にアタッチできます。

| キー | 説明 |
|------|------|
| `:configuration` | サービス設定 |
| `:info` | サービス情報 |
| `:context` | コンテキスト設定 |
| `:inputs` | input処理 |
| `:internals` | internal属性 |
| `:outputs` | output処理 |
| `:actions` | アクション実行 |

ほとんどの拡張機能は`:actions`（メインの実行ポイント）を使用します。

### 複数の拡張機能

```ruby {4-9}
class ApplicationService::Base < Servactory::Base
  extensions do
    # Before hooks (execute in order)
    before :actions, ApplicationService::Extensions::Authorization::DSL
    before :actions, ApplicationService::Extensions::StatusActive::DSL

    # After hooks (execute in order)
    after :actions, ApplicationService::Extensions::Publishable::DSL
    after :actions, ApplicationService::Extensions::PostCondition::DSL
  end
end
```

### 実行順序

1. `before`フックは宣言順に実行
2. サービスアクション（`make`メソッド）
3. `after`フックは宣言順に実行

### `super`の理解

拡張機能は呼び出しチェーンを形成します。`super`は次のモジュールに実行を渡します。

```ruby
def call!(**)
  # Before logic (runs first)
  settings = self.class.stroma.settings[:actions][:my_extension]
  fail!(message: "Not configured") if settings[:required] && settings[:value].blank?

  super  # Calls next extension or service actions

  # After logic (runs after service completes)
  Rails.logger.info("Service completed: #{self.class.name}")
end
```

| パターン | `super`の配置 | ユースケース |
|----------|---------------|-------------|
| Before | `super`の前にロジック | バリデーション、認可 |
| After | `super`の後にロジック | ロギング、パブリッシュ |
| Around | `super`をラップ | トランザクション、計測 |
| Short-circuit | `super`をスキップ | キャッシュ、早期リターン |

### 複雑な拡張機能の整理

複雑なロジックを持つ拡張機能の場合、拡張機能モジュールにメソッドを追加する代わりに専用の`Tools`クラスに分離します。このパターンはServactory内部でも使用されています。

**ファイル構造:**

```
extensions/authorization/
├── dsl.rb
└── tools/
    └── permission_checker.rb
```

::: code-group

```ruby [dsl.rb]
module ApplicationService
  module Extensions
    module Authorization
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def authorize_with(method_name)
            stroma.settings[:actions][:authorization][:method_name] = method_name
          end
        end

        module InstanceMethods
          private

          def call!(incoming_arguments: {}, **)
            method_name = self.class.stroma.settings[:actions][:authorization][:method_name]

            if method_name.present?
              # PORO class for extension logic, not a Servactory service
              Tools::PermissionChecker.check!(self, incoming_arguments, method_name)
            end

            super
          end
        end
      end
    end
  end
end
```

```ruby [tools/permission_checker.rb]
module ApplicationService
  module Extensions
    module Authorization
      module Tools
        class PermissionChecker
          def self.check!(...)
            new(...).check!
          end

          def initialize(context, arguments, method_name)
            @context = context
            @arguments = arguments
            @method_name = method_name
          end

          def check!
            authorized = @context.send(@method_name, @arguments)

            return if authorized

            @context.fail!(
              :unauthorized,
              message: "Not authorized to perform this action"
            )
          end
        end
      end
    end
  end
end
```

:::

**メリット:**

- ロジックが専用クラスに分離される
- 拡張機能モジュールのメソッド汚染がない
- 各Toolを個別にテストしやすい
- 複雑な拡張機能に対してスケールしやすい

## Stroma設定

拡張機能はStroma設定に設定情報を保存します。

### キー構造

```
stroma.settings[:registry_key][:extension_name][:setting_key]
```

| レベル | 説明 | 例 |
|--------|------|-----|
| `registry_key` | フックターゲット | `:actions` |
| `extension_name` | 拡張機能の識別子 | `:authorization` |
| `setting_key` | 個別の設定 | `:method_name` |

### 設定の書き込み

`ClassMethods`内:

```ruby
def authorize_with(method_name)
  stroma.settings[:actions][:authorization][:method_name] = method_name
end
```

### 設定の読み取り

`InstanceMethods`内:

```ruby
def call!(**)
  method_name = self.class.stroma.settings[:actions][:authorization][:method_name]
  # ...
  super
end
```

### 自動vivification

ネストされたオブジェクトは最初のアクセス時に自動的に作成されます。

```ruby
# This works without explicit initialization
stroma.settings[:actions][:my_extension][:enabled] = true
stroma.settings[:actions][:my_extension][:options] = { timeout: 30 }
```

## 拡張機能パターン

### Beforeパターン

サービス実行前に条件のバリデーションまたはチェックを行います。

::: code-group

```ruby [extensions/authorization/dsl.rb]
module ApplicationService
  module Extensions
    module Authorization
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def authorize_with(method_name)
            stroma.settings[:actions][:authorization][:method_name] = method_name
          end
        end

        module InstanceMethods
          private

          def call!(incoming_arguments: {}, **)
            method_name = self.class.stroma.settings[:actions][:authorization][:method_name]

            if method_name.present?
              authorized = send(method_name, incoming_arguments)

              unless authorized
                fail!(
                  :unauthorized,
                  message: "Not authorized to perform this action"
                )
              end
            end

            super
          end
        end
      end
    end
  end
end
```

```ruby [使い方]
class Posts::Delete < ApplicationService::Base
  input :post, type: Post
  input :user, type: User

  authorize_with :user_can_delete?

  make :delete_post

  private

  def user_can_delete?(args)
    args[:user].admin? || args[:post].author_id == args[:user].id
  end

  def delete_post
    inputs.post.destroy!
  end
end
```

:::

### Aroundパターン

サービス実行をコンテキストでラップします。

::: code-group

```ruby [extensions/transactional/dsl.rb]
module ApplicationService
  module Extensions
    module Transactional
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def transactional!(transaction_class: nil)
            stroma.settings[:actions][:transactional][:enabled] = true
            stroma.settings[:actions][:transactional][:class] = transaction_class
          end
        end

        module InstanceMethods
          private

          def call!(**)
            settings = self.class.stroma.settings[:actions][:transactional]
            enabled = settings[:enabled]

            unless enabled
              super
              return
            end

            transaction_class = settings[:class]

            fail!(message: "Transaction class not configured") if transaction_class.nil?

            transaction_class.transaction { super }
          end
        end
      end
    end
  end
end
```

```ruby [使い方]
class Orders::Create < ApplicationService::Base
  transactional! transaction_class: ActiveRecord::Base

  input :user, type: User
  input :items, type: Array

  output :order, type: Order

  make :create_order
  make :create_line_items
  make :charge_payment

  private

  def create_order
    outputs.order = Order.create!(user: inputs.user)
  end

  def create_line_items
    inputs.items.each do |item|
      outputs.order.line_items.create!(item)
    end
  end

  def charge_payment
    Payments::Charge.call!(amount: outputs.order.total_amount)
  end
end
```

:::

### Afterパターン

サービス実行後に結果を処理します。

::: code-group

```ruby [extensions/publishable/dsl.rb]
module ApplicationService
  module Extensions
    module Publishable
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def publishes(event_name, with: nil, event_bus: nil)
            stroma.settings[:actions][:publishable][:configurations] ||= []
            stroma.settings[:actions][:publishable][:configurations] << {
              event_name:,
              payload_method: with,
              event_bus:
            }
          end
        end

        module InstanceMethods
          private

          def call!(**)
            super

            configurations = self.class.stroma.settings[:actions][:publishable][:configurations] || []

            configurations.each do |config|
              event_name = config[:event_name]
              payload_method = config[:payload_method]
              event_bus = config[:event_bus]

              payload = payload_method.present? ? send(payload_method) : {}
              event_bus.publish(event_name, payload)
            end
          end
        end
      end
    end
  end
end
```

```ruby [使い方]
class Users::Create < ApplicationService::Base
  publishes :user_created, with: :user_payload, event_bus: EventPublisher

  input :email, type: String
  input :name, type: String

  output :user, type: User

  make :create_user

  private

  def create_user
    outputs.user = User.create!(email: inputs.email, name: inputs.name)
  end

  def user_payload
    { user_id: outputs.user.id, email: outputs.user.email }
  end
end
```

:::

### Rescueパターン

エラーを処理しクリーンアップを実行します。

::: code-group

```ruby [extensions/rollbackable/dsl.rb]
module ApplicationService
  module Extensions
    module Rollbackable
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def on_rollback(method_name)
            stroma.settings[:actions][:rollbackable][:method_name] = method_name
          end
        end

        module InstanceMethods
          private

          def call!(**)
            super
          rescue StandardError => e
            raise e if e.is_a?(Servactory::Exceptions::Success)

            method_name = self.class.stroma.settings[:actions][:rollbackable][:method_name]

            send(method_name) if method_name.present?

            raise
          end
        end
      end
    end
  end
end
```

```ruby [使い方]
class Payments::Process < ApplicationService::Base
  on_rollback :cleanup_resources

  input :order, type: Order
  input :payment_method, type: PaymentMethod

  output :payment, type: Payment

  make :reserve_inventory
  make :charge_payment
  make :confirm_order

  private

  def reserve_inventory
    Inventory::Reserve.call!(items: inputs.order.items)
  end

  def charge_payment
    result = Payments::Charge.call!(
      payment_method: inputs.payment_method,
      amount: inputs.order.total_amount
    )
    outputs.payment = result.payment
  end

  def confirm_order
    inputs.order.confirm!
  end

  def cleanup_resources
    Inventory::Release.call!(items: inputs.order.items)
    Payments::Refund.call!(payment: outputs.payment) if outputs.payment.present?
  end
end
```

:::

## 2.xからの移行

::: warning
`Servactory::DSL.with_extensions(...)`は非推奨であり、将来のリリースで削除されます。新しい`extensions do`ブロック構文に移行してください。
:::

### 構文の変更

::: code-group

```ruby [3.x (現行)]
module ApplicationService
  class Base < Servactory::Base
    extensions do
      before :actions, ApplicationService::Extensions::StatusActive::DSL
    end
  end
end
```

```ruby [2.x (レガシー)]
module ApplicationService
  class Base
    include Servactory::DSL.with_extensions(
      ApplicationService::Extensions::StatusActive::DSL
    )
  end
end
```

:::

### 設定ストレージの変更

| 観点 | 3.x | 2.x |
|------|-----|-----|
| ストレージ | `stroma.settings[:key][:ext][:setting]` | `attr_accessor` (class instance variable) |
| アクセス | `self.class.stroma.settings[:key][:ext][:setting]` | `self.class.send(:var)` |
| 継承 | 自動ディープコピー | 手動処理 |

### 拡張機能コードの変更

::: code-group

```ruby [3.x (現行)]
module ClassMethods
  private

  def status_active!(model_name)
    stroma.settings[:actions][:status_active][:model_name] = model_name
  end
end

module InstanceMethods
  private

  def call!(**)
    model_name = self.class.stroma.settings[:actions][:status_active][:model_name]
    # ...
    super
  end
end
```

```ruby [2.x (レガシー)]
module ClassMethods
  private

  attr_accessor :status_active_model_name

  def status_active!(model_name)
    self.status_active_model_name = model_name
  end
end

module InstanceMethods
  private

  def call!(**)
    super

    model_name = self.class.send(:status_active_model_name)
    # ...
  end
end
```

:::
