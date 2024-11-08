---
title: Advanced operating mode for attribute options
description: Description and examples of using advanced operating modes of options for all service attributes
prev: Options for service attributes
next: Dynamic options
---

# Advanced mode

Advanced mode involves more detailed work with the attribute option.

## Option `required` <Badge type="info" text="input" />

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

Before version `2.6.0`, `service_class_name:` was used instead of `service:`.
In the `2.6.0` release, this attribute was replaced by `service:`,
which is an object with prepared data.

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

## Option `inclusion` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

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

Before version `2.6.0`, `service_class_name:` was used instead of `service:`.
In the `2.6.0` release, this attribute was replaced by `service:`,
which is an object with prepared data.

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

## Option `consists_of` <Badge type="info" text="input (^2.0.0)" /> <Badge type="info" text="internal (^2.0.0)" /> <Badge type="info" text="output (^2.0.0)" />

::: info

Since version `2.6.0` this option is [dynamic](../options/dynamic#option-consists-of).

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

## Option `schema` <Badge type="info" text="input (^2.0.0)" /> <Badge type="info" text="internal (^2.0.0)" /> <Badge type="info" text="output (^2.0.0)" />

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

## Option `must` <Badge type="info" text="input" /> <Badge type="info" text="internal (^2.2.0)" /> <Badge type="info" text="output (^2.2.0)" />

::: info

The `must` option can work only in advanced mode.

:::

::: code-group

```ruby [input]
input :invoice_numbers,
      type: Array,
      consists_of: String,
      must: {
        be_6_characters: {
          is: ->(value:) { value.all? { |id| id.size == 6 } }
        }
      }
```

```ruby [internal]
internal :invoice_numbers,
         type: Array,
         consists_of: String,
         must: {
           be_6_characters: {
             is: ->(value:) { value.all? { |id| id.size == 6 } }
           }
         }
```

```ruby [output]
output :invoice_numbers,
       type: Array,
       consists_of: String,
       must: {
         be_6_characters: {
           is: ->(value:) { value.all? { |id| id.size == 6 } }
         }
       }
```

:::

::: info

Before version `2.6.0`, `service_class_name:` was used instead of `service:`.
In the `2.6.0` release, this attribute was replaced by `service:`,
which is an object with prepared data.

:::

::: code-group

```ruby [input]
input :invoice_numbers,
      type: Array,
      consists_of: String,
      must: {
        be_6_characters: {
          is: ->(value:) { value.all? { |id| id.size == 6 } },
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
             is: ->(value:) { value.all? { |id| id.size == 6 } },
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
           is: ->(value:) { value.all? { |id| id.size == 6 } },
           message: lambda do |service:, output:, value:, code:|
             "Wrong IDs in `#{output.name}`"
           end
         }
       }
```

:::
