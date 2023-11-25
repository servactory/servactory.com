---
title: Режимы работы для опций атрибутов
description: Описание и примеры использования режимов работы опций для всех атрибутов сервиса
prev: false
next: false
---

# Режимы работы опций

## Режим коллекции

Для того чтобы включить режим коллекции, необходимо в качестве типа входящего атрибута указать `Array` или `Set`.
Вы также можете указать собственный тип под задачи проекта через использование конфигурации `collection_mode_class_names`.

### Опция `consists_of` <Badge type="tip" text="input" /> <Badge type="tip" text="internal" /> <Badge type="tip" text="output" />

Эта опция является валидацией.
Будет проверять чтобы каждое значение в коллекции соответствовало указанному типу (классу).
Используется метод `is_a?`.

Явное применение этой опции необязательно.
По умолчанию установлено значение `String`.

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

## Режим хеша

Для того чтобы включить режим хеша, необходимо в качестве типа входящего атрибута указать `Hash`.
Вы также можете указать собственный тип под задачи проекта через использование конфигурации `hash_mode_class_names`.


### Опция `schema` <Badge type="tip" text="input" /> <Badge type="tip" text="internal" /> <Badge type="tip" text="output" />

Эта опция является валидацией.
Требует значение в виде хеша, которое должно описывать структуру значения входящего атрибута.

Явное применение опции необязательно.
Если значение схемы не указано, то валиация будет пропущена.
По умолчанию значение не указано.

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

Каждый ожидаемый ключ хеша должен быть описан в таком формате:

```ruby
{
  request_id: { type: String, required: true }
}
```

Допускаются следующие опции: `type`, `required` и опциональная `default`.

Если в `type` указывается значение `Hash`, то можно описать вложенность в таком же формате.

## Расширенный режим

Расширенный режим подразумевает более детальную работу с опцией атрибута.

### Опция `required` <Badge type="tip" text="input" />

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

### Опция `inclusion` <Badge type="tip" text="input" />

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

### Опция `must` <Badge type="tip" text="input" />

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

### Опция `consists_of` <Badge type="tip" text="input" /> <Badge type="tip" text="internal" /> <Badge type="tip" text="output" />

Опция от [режима коллекции](./modes#опция-consists-of).

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
