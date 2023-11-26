---
title: Operating modes for attribute options
description: Description and examples of using operating modes of options for all service attributes
prev: Options for service attributes
next: Using actions in service
---

# Option operating modes

## Collection mode

To enable collection mode, you must specify `Array` or `Set` as the type of the output attribute.
You can also specify your own type for project purposes through the use of the `collection_mode_class_names` configuration.

### Option `consists_of` <Badge type="info" text="input" /> <Badge type="info" text="internal" /> <Badge type="info" text="output" />

This option is validation.
It will check that each value in the collection matches the specified type (class).
The `is_a?` method is used.

Explicit use of this option is optional.
The default value is `String`.

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

## Hash mode

To enable hash mode, you must specify `Hash` as the type of the output attribute.
You can also specify your own type for project purposes through the use of the `hash_mode_class_names` configuration.

### Option `schema` <Badge type="info" text="input" /> <Badge type="info" text="internal" /> <Badge type="info" text="output" />

This option is validation.
Requires a hash value that must describe the value structure of the output attribute.

Explicit use of this option is optional.
If the schema value is not specified, the validation will be skipped.
By default, no value is specified.

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

Each expected hash key must be described in the following format:

```ruby
{
  request_id: { type: String, required: true }
}
```

The following options are allowed: `type`, `required` and the optional `default`.

If the `type` value is `Hash`, then nesting can be described in the same format.

## Advanced mode

Advanced mode involves more detailed work with the attribute option.

### Option `required` <Badge type="info" text="input" />

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

::: code-group

```ruby [input]
input :first_name,
      type: String,
      required: {
        message: lambda do |service_class_name:, input:, value:|
          "Input `first_name` is required"
        end
      }
```

:::

### Option `inclusion` <Badge type="info" text="input" />

::: code-group

```ruby [input]
input :event_name,
      type: String,
      inclusion: {
        in: %w[created rejected approved]
      }
```

:::

::: code-group

```ruby [input]
input :event_name,
      type: String,
      inclusion: {
        in: %w[created rejected approved],
        message: lambda do |service_class_name:, input:, value:|
          value.present? ? "Incorrect `event_name` specified: `#{value}`" : "Event name not specified"
        end
      }
```

:::

### Option `must` <Badge type="info" text="input" />

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

:::

::: code-group

```ruby [input]
input :invoice_numbers,
      type: Array,
      consists_of: String,
      must: {
        be_6_characters: {
          is: ->(value:) { value.all? { |id| id.size == 6 } },
          message: lambda do |service_class_name:, input:, value:, code:|
            "Wrong IDs in `#{input.name}`"
          end
        }
      }
```

:::

### Option `consists_of` <Badge type="info" text="input" /> <Badge type="info" text="internal" /> <Badge type="info" text="output" />

Option from [collection mode](./modes#collection-mode).

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
