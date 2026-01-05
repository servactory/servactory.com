---
title: Динамические опции для атрибутов
description: Описание и примеры использования динамических опций для всех атрибутов сервиса
prev: Расширенный режим опций
next: Использование действий в сервисе
---

# Динамические опции <Badge type="tip" text="Начиная с 2.4.0" />

Динамические опции — опции на основе `must`, принимающие значения как аргументы.
В отличие от [пользовательских хелперов](../attributes/input#пользовательские), динамические опции работают с аргументами.

Servactory из коробки предоставляет следующий набор динамических опций:

- `consists_of`;
- `format`;
- `inclusion`;
- `max`;
- `min`;
- `multiple_of`;
- `schema`.

По умолчанию включены `consists_of`, `inclusion` и `schema`.
Остальные включаются через готовые наборы в конфигурации хелперов опций для каждого атрибута.

## Готовые опции

### Опция `consists_of` <Badge type="tip" text="Начиная с 2.6.0" />

- Набор: `Servactory::ToolKit::DynamicOptions::ConsistsOf`
- Основано на: `must`
- Включено по умолчанию: Да
- [Исходный код](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/consists_of.rb)

### Опция `format`

- Набор: `Servactory::ToolKit::DynamicOptions::Format`
- Основано на: `must`
- Включено по умолчанию: Нет
- [Исходный код](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/format.rb)

#### Поддерживаемые форматы

- `uuid`;
- `email`;
- `password`;
- `duration`;
- `date`;
- `time`;
- `datetime`;
- `boolean`.

#### Кастомизация

Перезаписывайте существующие форматы или добавляйте собственные через атрибут `formats` в методе `use`:

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

#### Установка и использование

::: code-group

```ruby [Установка]
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

```ruby [Использование]
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

### Опция `inclusion` <Badge type="tip" text="Начиная с 2.12.0" />

- Набор: `Servactory::ToolKit::DynamicOptions::Inclusion`
- Основано на: `must`
- Включено по умолчанию: Да
- [Исходный код](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/inclusion.rb)

### Опция `max`

- Набор: `Servactory::ToolKit::DynamicOptions::Max`
- Основано на: `must`
- Включено по умолчанию: Нет
- [Исходный код](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/max.rb)

#### Установка и использование

::: code-group

```ruby [Установка]
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

```ruby [Использование]
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

### Опция `min`

- Набор: `Servactory::ToolKit::DynamicOptions::Min`
- Основано на: `must`
- Включено по умолчанию: Нет
- [Исходный код](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/min.rb)

#### Установка и использование

::: code-group

```ruby [Установка]
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

```ruby [Использование]
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

### Опция `multiple_of`

- Набор: `Servactory::ToolKit::DynamicOptions::MultipleOf`
- Основано на: `must`
- Включено по умолчанию: Нет
- [Исходный код](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/multiple_of.rb)

#### Установка и использование

::: code-group

```ruby [Установка]
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

```ruby [Использование]
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

### Опция `schema` <Badge type="tip" text="Начиная с 2.12.0" />

- Набор: `Servactory::ToolKit::DynamicOptions::Schema`
- Основано на: `must`
- Включено по умолчанию: Да
- [Исходный код](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/schema.rb)

## Пользовательские опции

Создавайте собственные динамические опции по шаблону ниже.

Располагайте файл класса в `app/services/application_service/dynamic_options`.

### Шаблон

::: code-group

```ruby [app/services/application_service/dynamic_options/my_option.rb]
module ApplicationService
  module DynamicOptions
    class MyOption < Servactory::ToolKit::DynamicOptions::Must
      def self.use(option_name = :my_option, **options)
        new(option_name).must(:be_the_best)
      end

      def condition_for_input_with(input:, value:, option:)
        # Здесь должны быть условия, предназначенные для атрибута input
      end

      def condition_for_internal_with(internal:, value:, option:)
        # Здесь должны быть условия, предназначенные для атрибута internal
      end

      def condition_for_output_with(output:, value:, option:)
        # Здесь должны быть условия, предназначенные для атрибута output
      end

      def message_for_input_with(service:, input:, value:, option_value:, **)
        # Здесь должен быть текст сообщения на случай, если условие не будет соблюдено
      end

      def message_for_internal_with(service:, internal:, value:, option_value:, **)
        # Здесь должен быть текст сообщения на случай, если условие не будет соблюдено
      end

      def message_for_output_with(service:, output:, value:, option_value:, **)
        # Здесь должен быть текст сообщения на случай, если условие не будет соблюдено
      end
    end
  end
end
```

:::

### Применение

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
