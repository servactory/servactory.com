---
title: Расширенный режим работы для опций атрибутов
description: Описание и примеры использования расширенных режимов работы опций для всех атрибутов сервиса
prev: Опции для атрибутов сервиса
next: Использование действий в сервисе
---

# Расширенный режим

Расширенный режим подразумевает более детальную работу с опцией атрибута.

## Опция `required` <Badge type="info" text="input" />

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

## Опция `inclusion` <Badge type="info" text="input" />

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

## Опция `consists_of` <Badge type="info" text="input" /> <Badge type="info" text="internal" /> <Badge type="info" text="output" />

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
      # Тип элемента массива по умолчанию — String
      consists_of: {
        message: "ID can only be of String type"
      }
```

```ruby [internal]
internal :ids,
         type: Array,
         # Тип элемента массива по умолчанию — String
         consists_of: {
           message: "ID can only be of String type"
         }
```

```ruby [output]
output :ids,
       type: Array,
       # Тип элемента массива по умолчанию — String
       consists_of: {
         message: "ID can only be of String type"
       }
```

:::

## Опция `schema` <Badge type="info" text="input" /> <Badge type="info" text="internal" /> <Badge type="info" text="output" />

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

## Опция `must` <Badge type="info" text="input" />

::: info

Опция `must` может работать только в расширенном режиме.

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
