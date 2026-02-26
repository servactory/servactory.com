---
title: 設定
description: サービスの設定に関する説明と例
prev: サービスの失敗とエラーハンドリング
next: RSpec
---

# 設定

`configuration`メソッドを使用してサービスを設定します。通常はベースクラスに配置します。

## 設定例

### 例外の設定

::: code-group

```ruby {4-6,8} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_exception_class ApplicationService::Exceptions::Input
      internal_exception_class ApplicationService::Exceptions::Internal
      output_exception_class ApplicationService::Exceptions::Output

      failure_class ApplicationService::Exceptions::Failure
    end
  end
end
```

```ruby {3-5,7} [app/services/application_service/exceptions.rb]
module ApplicationService
  module Exceptions
    class Input < Servactory::Exceptions::Input; end
    class Output < Servactory::Exceptions::Output; end
    class Internal < Servactory::Exceptions::Internal; end

    class Failure < Servactory::Exceptions::Failure; end
  end
end
```

:::

### 結果の設定 <Badge type="tip" text="2.5.0以降" />

::: code-group

```ruby {6} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      # ...

      result_class ApplicationService::Result
    end
  end
end
```

```ruby {2} [app/services/application_service/result.rb]
module ApplicationService
  class Result < Servactory::Result; end
end
```

:::

### コレクションモード

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      collection_mode_class_names([ActiveRecord::Relation])
    end
  end
end
```

:::

### ハッシュモード

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      hash_mode_class_names([CustomHash])
    end
  end
end
```

:::

### `input`のヘルパー

`must`および`prepare`オプションに基づく`input`のカスタムヘルパーです。

#### `must`の例

::: code-group

```ruby {4-20} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_option_helpers(
        [
          Servactory::Maintenance::Attributes::OptionHelper.new(
            name: :must_be_6_characters,
            equivalent: {
              must: {
                be_6_characters: {
                  is: ->(value:, input:) { value.all? { |id| id.size == 6 } },
                  message: lambda do |input:, **|
                    "Wrong IDs in `#{input.name}`"
                  end
                }
              }
            }
          )
        ]
      )
    end
  end
end
```

:::

#### `prepare`の例

::: code-group

```ruby {4-13} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_option_helpers(
        [
          Servactory::Maintenance::Attributes::OptionHelper.new(
            name: :to_money,
            equivalent: {
              prepare: ->(value:) { Money.from_cents(value, :USD) }
            }
          )
        ]
      )
    end
  end
end
```

:::

### `internal`のヘルパー

`must`オプションに基づく`internal`のカスタムヘルパーです。

#### `must`の例

::: code-group

```ruby {4-20} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      internal_option_helpers(
        [
          Servactory::Maintenance::Attributes::OptionHelper.new(
            name: :must_be_6_characters,
            equivalent: {
              must: {
                be_6_characters: {
                  is: ->(value:, internal:) { value.all? { |id| id.size == 6 } },
                  message: lambda do |internal:, **|
                    "Wrong IDs in `#{internal.name}`"
                  end
                }
              }
            }
          )
        ]
      )
    end
  end
end
```

:::

### `output`のヘルパー

`must`オプションに基づく`output`のカスタムヘルパーです。

#### `must`の例

::: code-group

```ruby {4-20} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      output_option_helpers(
        [
          Servactory::Maintenance::Attributes::OptionHelper.new(
            name: :must_be_6_characters,
            equivalent: {
              must: {
                be_6_characters: {
                  is: ->(value:, output:) { value.all? { |id| id.size == 6 } },
                  message: lambda do |output:, **|
                    "Wrong IDs in `#{output.name}`"
                  end
                }
              }
            }
          )
        ]
      )
    end
  end
end
```

:::

### `make`のエイリアス

`action_aliases`設定を使用して`make`の代替を追加します。

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      action_aliases %i[execute]
    end
  end
end
```

:::

### `make`のカスタマイズ

`action_shortcuts`設定を使用して`make`のショートカットを実装します。

値は`make`を置き換え、インスタンスメソッドのプレフィックスとして機能します。

#### シンプルモード

シンプルモードでは、値はシンボルの配列として渡されます。

::: code-group

```ruby {4-6} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      action_shortcuts(
        %i[assign perform]
      )
    end
  end
end
```

:::

::: details 使用例

```ruby
class CMS::API::Posts::Create < CMS::API::Base
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

:::

#### アドバンスドモード <Badge type="tip" text="2.14.0以降" />

アドバンスドモードでは、値はハッシュとして渡されます。

::: code-group

```ruby {6-11} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      action_shortcuts(
        %i[assign],
        {
          restrict: {             # replacement for make
            prefix: :create,      # method name prefix
            suffix: :restriction  # method name suffix
          }
        }
      )
    end
  end
end
```

:::

::: details 使用例

```ruby
class Payments::Restrictions::Create < ApplicationService::Base
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

:::

### プレディケートメソッド <Badge type="tip" text="2.5.0以降" />

すべてのアトリビュートに対するプレディケートメソッドはデフォルトで有効です。
必要に応じて無効にしてください。

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      predicate_methods_enabled false
    end
  end
end
```

:::

### I18nのルートキー <Badge type="tip" text="2.6.0以降" />

翻訳のデフォルトのルートキー（`servactory`）をオーバーライドします。

::: code-group

```ruby {4} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      i18n_root_key :my_app
    end
  end
end
```

:::

翻訳の検索が`servactory.*`から`my_app.*`に変更されます。

[国際化（I18n）](/ja/guide/i18n)も参照してください。
