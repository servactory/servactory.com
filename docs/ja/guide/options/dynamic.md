---
title: アトリビュートのダイナミックオプション
description: サービスの全アトリビュートに対するダイナミックオプションの使い方の説明と例
prev: 応用オプションモード
next: サービス内のアクションの使い方
---

# ダイナミックオプション <Badge type="tip" text="2.4.0以降" />

ダイナミックオプションは引数として値を受け取る`must`ベースのオプションです。
[カスタムヘルパー](../attributes/input#カスタムヘルパー)とは異なり、ダイナミックオプションは引数を扱えます。

Servactoryはデフォルトで以下のダイナミックオプションセットを提供します:

- `consists_of`;
- `format`;
- `inclusion`;
- `max`;
- `min`;
- `multiple_of`;
- `schema`;
- `target`.

デフォルトでは`consists_of`、`inclusion`、`schema`が有効です。
残りは各アトリビュートのオプションヘルパーコンフィグレーションで用意されたセットを通じて有効にできます。

## 用意されたオプション

### オプション`consists_of` <Badge type="tip" text="2.6.0以降" />

- キット: `Servactory::ToolKit::DynamicOptions::ConsistsOf`
- ベース: `must`
- デフォルトで有効: はい
- [ソースコード](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/consists_of.rb)

### オプション`format`

- キット: `Servactory::ToolKit::DynamicOptions::Format`
- ベース: `must`
- デフォルトで有効: いいえ
- [ソースコード](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/format.rb)

#### サポートされるフォーマット

- `uuid`;
- `email`;
- `password`;
- `duration`;
- `date`;
- `time`;
- `datetime`;
- `boolean`.

#### カスタマイズ

`use`メソッドの`formats`アトリビュートを通じて、既存のフォーマットを上書きしたり、カスタムフォーマットを追加できます:

```ruby
Servactory::ToolKit::DynamicOptions::Format.use(
  formats: {
    email: {
      pattern: /@/,
      validator: ->(value:) { value.present? }
    },
    invoice: {
      pattern: /^([A]{2})-([0-9A-Z]{6})$/,
      validator: ->(value:) { value.present? }
    }
  }
)
```

#### インストールと使い方

::: code-group

```ruby [インストール]
input_option_helpers([
  Servactory::ToolKit::DynamicOptions::Min.use
])

internal_option_helpers([
  Servactory::ToolKit::DynamicOptions::Min.use(:minimum)
])

output_option_helpers([
  Servactory::ToolKit::DynamicOptions::Min.use
])
```

```ruby [使い方]
input :email,
      type: String,
      format: :email

internal :email,
         type: String,
         format: { is: :email }

output :data,
       type: String,
       format: {
         is: :email,
         message: lambda do |output:, value:, option_value:, **|
           "Incorrect `email` format in `#{output.name}`"
         end
       }
```

:::

### オプション`inclusion` <Badge type="tip" text="2.12.0以降" />

- キット: `Servactory::ToolKit::DynamicOptions::Inclusion`
- ベース: `must`
- デフォルトで有効: はい
- [ソースコード](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/inclusion.rb)

### オプション`max`

- キット: `Servactory::ToolKit::DynamicOptions::Max`
- ベース: `must`
- デフォルトで有効: いいえ
- [ソースコード](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/max.rb)

#### インストールと使い方

::: code-group

```ruby [インストール]
input_option_helpers([
  Servactory::ToolKit::DynamicOptions::Max.use
])

internal_option_helpers([
  Servactory::ToolKit::DynamicOptions::Max.use(:maximum)
])

output_option_helpers([
  Servactory::ToolKit::DynamicOptions::Max.use
])
```

```ruby [使い方]
input :data,
      type: Integer,
      max: 10

internal :data,
         type: String,
         maximum: { is: 10 }

output :data,
       type: Array,
       max: {
         is: 10,
         message: lambda do |output:, value:, option_value:, **|
           "The size of the `#{output.name}` value must be less than or " \
             "equal to `#{option_value}` (got: `#{value}`)"
         end
       }
```

:::

### オプション`min`

- キット: `Servactory::ToolKit::DynamicOptions::Min`
- ベース: `must`
- デフォルトで有効: いいえ
- [ソースコード](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/min.rb)

#### インストールと使い方

::: code-group

```ruby [インストール]
input_option_helpers([
  Servactory::ToolKit::DynamicOptions::Min.use
])

internal_option_helpers([
  Servactory::ToolKit::DynamicOptions::Min.use(:minimum)
])

output_option_helpers([
  Servactory::ToolKit::DynamicOptions::Min.use
])
```

```ruby [使い方]
input :data,
      type: Integer,
      min: 1

internal :data,
         type: String,
         minimum: { is: 1 }

output :data,
       type: Array,
       min: {
         is: 1,
         message: lambda do |output:, value:, option_value:, **|
           "The size of the `#{output.name}` value must be greater than or " \
             "equal to `#{option_value}` (got: `#{value}`)"
         end
       }
```

:::

### オプション`multiple_of`

- キット: `Servactory::ToolKit::DynamicOptions::MultipleOf`
- ベース: `must`
- デフォルトで有効: いいえ
- [ソースコード](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/multiple_of.rb)

#### インストールと使い方

::: code-group

```ruby [インストール]
input_option_helpers([
 Servactory::ToolKit::DynamicOptions::MultipleOf.use
])

internal_option_helpers([
  Servactory::ToolKit::DynamicOptions::MultipleOf.use(:divisible_by)
])

output_option_helpers([
  Servactory::ToolKit::DynamicOptions::MultipleOf.use
])
```

```ruby [使い方]
input :data,
      type: Integer,
      multiple_of: 2

internal :data,
         type: Integer,
         divisible_by: { is: 2 }

output :data,
       type: Float,
       multiple_of: {
         is: 2,
         message: lambda do |output:, value:, option_value:, **|
           "Output `#{output.name}` has the value `#{value}`, " \
             "which is not a multiple of `#{option_value}`"
         end
       }
```

:::

### オプション`schema` <Badge type="tip" text="2.12.0以降" />

- キット: `Servactory::ToolKit::DynamicOptions::Schema`
- ベース: `must`
- デフォルトで有効: はい
- [ソースコード](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/schema.rb)

### オプション`target` <Badge type="tip" text="3.0.0以降" />

- キット: `Servactory::ToolKit::DynamicOptions::Target`
- ベース: `must`
- デフォルトで有効: いいえ
- [ソースコード](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/target.rb)

#### インストールと使い方

::: code-group

```ruby [インストール]
input_option_helpers([
  Servactory::ToolKit::DynamicOptions::Target.use
])

internal_option_helpers([
  Servactory::ToolKit::DynamicOptions::Target.use(:expect)
])

output_option_helpers([
  Servactory::ToolKit::DynamicOptions::Target.use
])
```

```ruby [使い方]
input :service_class,
      type: Class,
      target: MyFirstService

internal :service_class,
         type: Class,
         expect: { in: [MyFirstService, MySecondService] }

output :service_class,
       type: Class,
       target: {
         in: [MyFirstService, MySecondService],
         message: lambda do |output:, value:, option_value:, **|
           "Output `#{output.name}`: #{value.inspect} is not allowed. " \
             "Allowed: #{Array(option_value).map(&:name).join(', ')}"
         end
       }
```

:::

## カスタムオプション

以下のテンプレートを使用してカスタムダイナミックオプションを作成できます。

クラスファイルは`app/services/application_service/dynamic_options`に配置してください。

### テンプレート

::: code-group

```ruby [app/services/application_service/dynamic_options/my_option.rb]
module ApplicationService
  module DynamicOptions
    class MyOption < Servactory::ToolKit::DynamicOptions::Must
      def self.use(option_name = :my_option, **options)
        new(option_name).must(:be_the_best)
      end

      def condition_for_input_with(input:, value:, option:)
        # There should be conditions here that are intended for the input attribute
      end

      def condition_for_internal_with(internal:, value:, option:)
        # There should be conditions here that are intended for the internal attribute
      end

      def condition_for_output_with(output:, value:, option:)
        # There should be conditions here that are intended for the output attribute
      end

      def message_for_input_with(service:, input:, value:, option_value:, **)
        # There should be a message text here in case the condition is not met
      end

      def message_for_internal_with(service:, internal:, value:, option_value:, **)
        # There should be a message text here in case the condition is not met
      end

      def message_for_output_with(service:, output:, value:, option_value:, **)
        # There should be a message text here in case the condition is not met
      end
    end
  end
end
```

:::

### 適用

```ruby
input_option_helpers([
   ApplicationService::DynamicOptions::MyOption.use
])

internal_option_helpers([
  ApplicationService::DynamicOptions::MyOption.use(:my_best_option)
])

output_option_helpers([
  ApplicationService::DynamicOptions::MyOption.use(some: :data)
])
```
