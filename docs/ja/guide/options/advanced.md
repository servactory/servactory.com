---
title: アトリビュートオプションの応用動作モード
description: サービスの全アトリビュートに対するオプションの応用動作モードの説明と例
prev: サービスアトリビュートのオプション
next: ダイナミックオプション
---

# 応用モード

応用モードはアトリビュートオプションの詳細な制御を可能にします。

## オプション`required` <Badge type="info" text="input" />

::: code-group

```ruby [input]
input :first_name,
      type: String,
      required: {
        is: true,
        message: "Input `first_name` is required"
      }
```

:::

::: info

バージョン`2.6.0`より前では、`service:`の代わりに`service_class_name:`が使用されていました。
`2.6.0`リリースで、このアトリビュートは`service:`に置き換えられました。
`service:`は準備されたデータを持つオブジェクトです。

:::

::: code-group

```ruby [input]
input :first_name,
      type: String,
      required: {
        message: lambda do |service:, input:, value:|
          "Input `first_name` is required"
        end
      }
```

:::

## オプション`inclusion` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

::: info

バージョン`2.12.0`以降、このオプションは[ダイナミック](../options/dynamic#オプション-inclusion)です。

:::

::: code-group

```ruby [input]
input :event_name,
      type: String,
      inclusion: {
        in: %w[created rejected approved]
      }
```

```ruby [internal]
internal :event_name,
         type: String,
         inclusion: {
           in: %w[created rejected approved]
         }
```

```ruby [output]
output :event_name,
       type: String,
       inclusion: {
         in: %w[created rejected approved]
       }
```

:::

::: info

バージョン`2.6.0`より前では、`service:`の代わりに`service_class_name:`が使用されていました。
`2.6.0`リリースで、このアトリビュートは`service:`に置き換えられました。
`service:`は準備されたデータを持つオブジェクトです。

:::

::: code-group

```ruby [input]
input :event_name,
      type: String,
      inclusion: {
        in: %w[created rejected approved],
        message: lambda do |service:, input:, value:|
          value.present? ? "Incorrect `#{input.name}` specified: `#{value}`" : "Event name not specified"
        end
      }
```

```ruby [internal]
internal :event_name,
         type: String,
         inclusion: {
           in: %w[created rejected approved],
           message: lambda do |service:, internal:, value:|
             value.present? ? "Incorrect `#{internal.name}` specified: `#{value}`" : "Event name not specified"
           end
         }
```

```ruby [output]
output :event_name,
       type: String,
       inclusion: {
         in: %w[created rejected approved],
         message: lambda do |service:, output:, value:|
           value.present? ? "Incorrect `#{output.name}` specified: `#{value}`" : "Event name not specified"
         end
       }
```

:::

## オプション`consists_of` <Badge type="info" text="input (^2.0.0)" /> <Badge type="info" text="internal (^2.0.0)" /> <Badge type="info" text="output (^2.0.0)" />

::: info

バージョン`2.6.0`以降、このオプションは[ダイナミック](../options/dynamic#オプション-consists-of)です。

:::

::: code-group

```ruby [input]
input :ids,
      type: Array,
      consists_of: {
        type: String,
        message: "ID can only be of String type"
      }
```

```ruby [internal]
internal :ids,
         type: Array,
         consists_of: {
           type: String,
           message: "ID can only be of String type"
         }
```

```ruby [output]
output :ids,
       type: Array,
       consists_of: {
         type: String,
         message: "ID can only be of String type"
       }
```

:::

::: code-group

```ruby [input]
input :ids,
      type: Array,
      # The default array element type is String
      consists_of: {
        message: "ID can only be of String type"
      }
```

```ruby [internal]
internal :ids,
         type: Array,
         # The default array element type is String
         consists_of: {
           message: "ID can only be of String type"
         }
```

```ruby [output]
output :ids,
       type: Array,
       # The default array element type is String
       consists_of: {
         message: "ID can only be of String type"
       }
```

:::

## オプション`schema` <Badge type="info" text="input (^2.0.0)" /> <Badge type="info" text="internal (^2.0.0)" /> <Badge type="info" text="output (^2.0.0)" />

::: info

バージョン`2.12.0`以降、このオプションは[ダイナミック](../options/dynamic#オプション-schema)です。

:::

::: code-group

```ruby [input]
input :payload,
      type: Hash,
      schema: {
        is: {
          request_id: { type: String, required: true },
          # ...
        },
        message: "Problem with the value in the schema"
      }
```

```ruby [internal]
internal :payload,
         type: Hash,
         schema: {
           is: {
             request_id: { type: String, required: true },
             # ...
           },
           message: "Problem with the value in the schema"
         }
```

```ruby [output]
output :payload,
       type: Hash,
       schema: {
         is: {
           request_id: { type: String, required: true },
           # ...
         },
         message: "Problem with the value in the schema"
       }
```

:::

::: code-group

```ruby [input]
input :payload,
      type: Hash,
      schema: {
        is: {
          request_id: { type: String, required: true },
          # ...
        },
        message: lambda do |input_name:, key_name:, expected_type:, given_type:|
          "Problem with the value in the `#{input_name}` schema: " \
            "`#{key_name}` has `#{given_type}` instead of `#{expected_type}`"
        end
      }
```

```ruby [internal]
internal :payload,
         type: Hash,
         schema: {
           is: {
             request_id: { type: String, required: true },
             # ...
           },
           message: lambda do |input_name:, key_name:, expected_type:, given_type:|
             "Problem with the value in the `#{input_name}` schema: " \
               "`#{key_name}` has `#{given_type}` instead of `#{expected_type}`"
           end
         }
```

```ruby [output]
output :payload,
       type: Hash,
       schema: {
         is: {
           request_id: { type: String, required: true },
           # ...
         },
         message: lambda do |input_name:, key_name:, expected_type:, given_type:|
           "Problem with the value in the `#{input_name}` schema: " \
             "`#{key_name}` has `#{given_type}` instead of `#{expected_type}`"
         end
       }
```

:::

## オプション`must` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

::: info

`must`オプションは応用モードでのみ動作します。

:::

::: warning 3.0.0以降

`is`ラムダは真値ではなく、正確に`true`を返す必要があります。`1`、`"string"`、`[]`などの値はバリデーションに失敗します。

:::

::: code-group

```ruby [input]
input :invoice_numbers,
      type: Array,
      consists_of: String,
      must: {
        be_6_characters: {
          is: ->(value:, input:) { value.all? { |id| id.size == 6 } }
        }
      }
```

```ruby [internal]
internal :invoice_numbers,
         type: Array,
         consists_of: String,
         must: {
           be_6_characters: {
             is: ->(value:, internal:) { value.all? { |id| id.size == 6 } }
           }
         }
```

```ruby [output]
output :invoice_numbers,
       type: Array,
       consists_of: String,
       must: {
         be_6_characters: {
           is: ->(value:, output:) { value.all? { |id| id.size == 6 } }
         }
       }
```

:::

::: info

バージョン`2.6.0`より前では、`service:`の代わりに`service_class_name:`が使用されていました。
`2.6.0`リリースで、このアトリビュートは`service:`に置き換えられました。
`service:`は準備されたデータを持つオブジェクトです。

:::

::: code-group

```ruby [input]
input :invoice_numbers,
      type: Array,
      consists_of: String,
      must: {
        be_6_characters: {
          is: ->(value:, input:) { value.all? { |id| id.size == 6 } },
          message: lambda do |service:, input:, value:, code:|
            "Wrong IDs in `#{input.name}`"
          end
        }
      }
```

```ruby [internal]
internal :invoice_numbers,
         type: Array,
         consists_of: String,
         must: {
           be_6_characters: {
             is: ->(value:, internal:) { value.all? { |id| id.size == 6 } },
             message: lambda do |service:, internal:, value:, code:, reason:|
               "Wrong IDs in `#{internal.name}`"
             end
           }
         }
```

```ruby [output]
output :invoice_numbers,
       type: Array,
       consists_of: String,
       must: {
         be_6_characters: {
           is: ->(value:, output:) { value.all? { |id| id.size == 6 } },
           message: lambda do |service:, output:, value:, code:|
             "Wrong IDs in `#{output.name}`"
           end
         }
       }
```

:::
