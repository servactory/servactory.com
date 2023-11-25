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

### Опция `consists_of`

Эта опция является валидацией.
Будет проверять чтобы каждое значение в коллекции соответствовало указанному типу (классу).
Используется метод `is_a?`.

Явное применение этой опции необязательно.
По умолчанию установлено значение `String`.

```ruby
input :ids,
      type: Array,
      consists_of: String
```

## Режим хеша

Для того чтобы включить режим хеша, необходимо в качестве типа входящего атрибута указать `Hash`.
Вы также можете указать собственный тип под задачи проекта через использование конфигурации `hash_mode_class_names`.


### Опция `schema`

Эта опция является валидацией.
Требует значение в виде хеша, которое должно описывать структуру значения входящего атрибута.

Явное применение опции необязательно.
Если значение схемы не указано, то валиация будет пропущена.
По умолчанию значение не указано.

```ruby
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

### Опция `required`

```ruby
input :first_name,
      type: String,
      required: {
        is: true,
        message: "Input `first_name` is required"
      }
```

```ruby
input :first_name,
      type: String,
      required: {
        message: lambda do |service_class_name:, input:, value:|
          "Input `first_name` is required"
        end
      }
```

### Опция `inclusion`

```ruby
input :event_name,
      type: String,
      inclusion: {
        in: %w[created rejected approved]
      }
```

```ruby
input :event_name,
      type: String,
      inclusion: {
        in: %w[created rejected approved],
        message: lambda do |service_class_name:, input:, value:|
          value.present? ? "Incorrect `event_name` specified: `#{value}`" : "Event name not specified"
        end
      }
```

### Опция `must`

::: info

Опция `must` может работать только в расширенном режиме.

:::

```ruby
input :invoice_numbers,
      type: Array,
      consists_of: String,
      must: {
        be_6_characters: {
          is: ->(value:) { value.all? { |id| id.size == 6 } }
        }
      }
```

```ruby
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

### Опция `consists_of`

Опция от [режима коллекции](./modes#опция-consists-of).

```ruby
input :ids,
      type: Array,
      consists_of: {
        type: String,
        message: "ID can only be of String type"
      }
```

```ruby
input :ids,
      type: Array,
      # Тип элемента массива по умолчанию — String
      consists_of: {
        message: "ID can only be of String type"
      }
```
