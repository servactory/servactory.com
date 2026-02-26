---
title: アトリビュートでのオプションの使い方
description: サービスの全アトリビュートに対するオプションの使い方の説明と例
prev: サービスのoutputアトリビュート
next: 応用オプションモード
---

# アトリビュートでのオプションの使い方

## オプション`type` <Badge type="info" text="input" /> <Badge type="info" text="internal" /> <Badge type="info" text="output" />

バリデーションオプションです。渡された値が指定された型（クラス）に一致するかを`is_a?`で検証します。

必須です。1つまたは複数のクラスを指定できます。

::: code-group

```ruby{2,3} [input]
class Notifications::Create < ApplicationService::Base
  input :user, type: User
  input :need_to_notify, type: [TrueClass, FalseClass]

  # ...
end
```

```ruby{4} [internal]
class Notifications::Create < ApplicationService::Base
  # ...

  internal :inviter, type: User

  # ...
end
```

```ruby{4} [output]
class Notifications::Create < ApplicationService::Base
  # ...

  output :notification, type: Notification

  # ...
end
```

:::

## オプション`required` <Badge type="info" text="input" />

バリデーションオプションです。渡された値が空でないことを`present?`で検証します。

デフォルトは`true`です。

::: code-group

```ruby{7} [input]
class Users::Create < ApplicationService::Base
  input :first_name,
        type: String

  input :middle_name,
        type: String,
        required: false

  input :last_name,
        type: String

  # ...
end
```

:::

## オプション`default` <Badge type="info" text="input" />

バリデーション以外のオプションです。サービスに値が渡されなかった場合に値を割り当てます。

::: code-group

```ruby{7} [input]
class Users::Create < ApplicationService::Base
  # ...

  input :middle_name,
        type: String,
        required: false,
        default: "<unknown>"

  # ...
end
```

:::

## オプション`as` <Badge type="info" text="input" />

バリデーション以外のオプションです。サービス内部でのアトリビュートのエイリアスを指定します。元の名前はサービス内部で使用できなくなります。

::: code-group

```ruby{3,10} [input]
class Notifications::Create < ApplicationService::Base
  input :user,
        as: :recipient,
        type: User

  # ...

  def create!
    outputs.notification =
      Notification.create!(recipient: inputs.recipient)
  end
end
```

:::

## オプション`inclusion` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

::: info

バージョン`2.12.0`以降、このオプションは[ダイナミック](../options/dynamic#オプション-inclusion)です。

:::

ダイナミックバリデーションオプションです。渡された値が指定された配列に含まれるかを`include?`で検証します。

::: code-group

```ruby{4} [input]
class Events::Send < ApplicationService::Base
  input :event_name,
        type: String,
        inclusion: %w[created rejected approved]

  # ...
end
```

```ruby{6} [internal]
class Events::Send < ApplicationService::Base
  # ...

  internal :event_name,
           type: String,
           inclusion: %w[created rejected approved]

  # ...
end
```

```ruby{6} [output]
class Events::Send < ApplicationService::Base
  # ...

  output :event_name,
         type: String,
         inclusion: %w[created rejected approved]

  # ...
end
```

:::

## オプション`consists_of` <Badge type="info" text="input (^2.0.0)" /> <Badge type="info" text="internal (^2.0.0)" /> <Badge type="info" text="output (^2.0.0)" />

::: info

バージョン`2.6.0`以降、このオプションは[ダイナミック](../options/dynamic#オプション-consists-of)です。

:::

ダイナミックバリデーションオプションです。コレクション内の各値がネストされた値も含めて指定された型（クラス）に一致するかを`is_a?`で検証します。

`Array`および`Set`型でのみ動作します。[`collection_mode_class_names`](../configuration#コレクションモード)コンフィグレーションでカスタム型を追加できます。

任意です。デフォルトは`String`です。

::: code-group

```ruby [input]
input :ids,
      type: Array,
      consists_of: String
```

```ruby [internal]
internal :ids,
         type: Array,
         consists_of: String
```

```ruby [output]
output :ids,
       type: Array,
       consists_of: String
```

:::

## オプション`schema` <Badge type="info" text="input (^2.0.0)" /> <Badge type="info" text="internal (^2.0.0)" /> <Badge type="info" text="output (^2.0.0)" />

::: info

バージョン`2.12.0`以降、このオプションは[ダイナミック](../options/dynamic#オプション-schema)です。

:::

ダイナミックバリデーションオプションです。アトリビュートの値構造を記述するハッシュ値が必要です。

`Hash`型でのみ動作します。[`hash_mode_class_names`](../configuration#ハッシュモード)コンフィグレーションでカスタム型を追加できます。

任意です。指定しない場合、バリデーションはスキップされます。デフォルト値はありません。

::: code-group

```ruby [input]
input :payload,
      type: Hash,
      schema: {
        request_id: { type: String, required: true },
        user: {
          type: Hash,
          required: true,
          first_name: { type: String, required: true },
          middle_name: { type: String, required: false, default: "<unknown>" },
          last_name: { type: String, required: true },
          pass: {
            type: Hash,
            required: true,
            series: { type: String, required: true },
            number: { type: String, required: true }
          }
        }
      }
```

```ruby [internal]
internal :payload,
         type: Hash,
         schema: {
           request_id: { type: String, required: true },
           user: {
             type: Hash,
             required: true,
             first_name: { type: String, required: true },
             middle_name: { type: String, required: false, default: "<unknown>" },
             last_name: { type: String, required: true },
             pass: {
               type: Hash,
               required: true,
               series: { type: String, required: true },
               number: { type: String, required: true }
             }
           }
         }
```

```ruby [output]
output :payload,
       type: Hash,
       schema: {
         request_id: { type: String, required: true },
         user: {
           type: Hash,
           required: true,
           first_name: { type: String, required: true },
           middle_name: { type: String, required: false, default: "<unknown>" },
           last_name: { type: String, required: true },
           pass: {
             type: Hash,
             required: true,
             series: { type: String, required: true },
             number: { type: String, required: true }
           }
         }
       }
```

:::

期待される各ハッシュキーを以下の形式で記述してください:

```ruby
{
  request_id: { type: String, required: true }
}
```

許可されるオプション: 必須の`type`、`required`、および任意の`default`、`prepare`。`default`と`prepare`オプションは`input`内でのみ使用可能です。

`type`に`Hash`を指定した場合、同じ形式でネストを記述してください。

## オプション`must` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

バリデーションオプションです。カスタムバリデーションを作成します。

::: warning 3.0.0以降

`is`ラムダは真値ではなく、正確に`true`を返す必要があります。`1`、`"string"`、`[]`などの値はバリデーションに失敗します。

:::

::: code-group

```ruby{5-9} [input]
class Payments::Create < ApplicationService::Base
  input :invoice_numbers,
        type: Array,
        consists_of: String,
        must: {
          be_6_characters: {
            is: ->(value:, input:) { value.all? { |id| id.size == 6 } }
          }
        }

  # ...
end
```

```ruby{7-11} [internal]
class Events::Send < ApplicationService::Base
  # ...

  internal :invoice_numbers,
           type: Array,
           consists_of: String,
           must: {
             be_6_characters: {
               is: ->(value:, internal:) { value.all? { |id| id.size == 6 } }
             }
           }

  # ...
end
```

```ruby{7-11} [output]
class Events::Send < ApplicationService::Base
  # ...

  output :invoice_numbers,
         type: Array,
         consists_of: String,
         must: {
           be_6_characters: {
             is: ->(value:, output:) { value.all? { |id| id.size == 6 } }
           }
         }

  # ...
end
```

:::

## オプション`format` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

ダイナミックバリデーションオプション（メインオプションには含まれません）。[詳細](./dynamic#オプション-format)をご覧ください。

## オプション`max` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

ダイナミックバリデーションオプション（メインオプションには含まれません）。[詳細](./dynamic#オプション-max)をご覧ください。

## オプション`min` <Badge type="info" text="input (^2.4.0)" /> <Badge type="info" text="internal (^2.4.0)" /> <Badge type="info" text="output (^2.4.0)" />

ダイナミックバリデーションオプション（メインオプションには含まれません）。[詳細](./dynamic#オプション-min)をご覧ください。

## オプション`target` <Badge type="info" text="input (^3.0.0)" /> <Badge type="info" text="internal (^3.0.0)" /> <Badge type="info" text="output (^3.0.0)" />

Class型のアトリビュート用のダイナミックバリデーションオプション（メインオプションには含まれません）。[詳細](./dynamic#オプション-target)をご覧ください。

## オプション`prepare` <Badge type="info" text="input" />

バリデーション以外のオプションです。渡された値を準備します。

::: warning

`prepare`は簡単な準備処理にのみ慎重に使用してください。複雑なロジックは[`make`](../actions/usage)アクションで適用する方がよいです。

:::

::: code-group

```ruby{5,10} [input]
class Payments::Create < ApplicationService::Base
  input :amount_cents,
        as: :amount,
        type: Integer,
        prepare: ->(value:) { Money.from_cents(value, :USD) }

  # ...

  def create!
    outputs.payment = Payment.create!(amount: inputs.amount)
  end
end
```

:::
