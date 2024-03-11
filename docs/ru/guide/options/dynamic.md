---
title: Динамические опции для атрибутов
description: Описание и примеры использования динамических опций для всех атрибутов сервиса
prev: Расширенный режим опций
next: Использование действий в сервисе
---

# Динамические опции <Badge type="tip" text="Начиная с 2.4.0" />

Динамические опции — это дополнительные опции, основанные на `must`,
которые могут принимать значения в виде аргументов.
Динамические опции похожи на [пользовательские хелперы](../attributes/input#пользовательские),
но отличает их друг от друга возможность работать с аргументами.

Servactory из коробки предоставляет следующий набор динамических опций:

- `min`;
- `max`.

По умолчанию эти опции не включены.
Для их работы необходимо применить готовые наборы в конфигурации хелперов
опций для каждого из существующих атрибутов.

## Готовые опции

### Опция `min`

- Набор: `Servactory::ToolKit::DynamicOptions::Min`
- Основан на: `must`

::: code-group

```ruby [Установка]
input_option_helpers([
  Servactory::ToolKit::DynamicOptions::Min.setup
])

internal_option_helpers([
  Servactory::ToolKit::DynamicOptions::Min.setup(:minimum)
])

output_option_helpers([
  Servactory::ToolKit::DynamicOptions::Min.setup
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

### Опция `max`

- Набор: `Servactory::ToolKit::DynamicOptions::Max`
- Основан на: `must`

::: code-group

```ruby [Установка]
input_option_helpers([
  Servactory::ToolKit::DynamicOptions::Max.setup
])

internal_option_helpers([
  Servactory::ToolKit::DynamicOptions::Max.setup(:maximum)
])

output_option_helpers([
  Servactory::ToolKit::DynamicOptions::Max.setup
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

## Пользовательские

Вы можете создавать собственные динамические опции.

Используйте подготовленный шаблон, который предоставлен ниже, для реализации
собственной динамической опции.

Рекомендуется расположить файл класса в директории
`app/services/application_service/dynamic_options` вашего проекта.

### Шаблон

::: code-group

```ruby [app/services/application_service/dynamic_options/my_option.rb]
module ApplicationService
  module DynamicOptions
    class MyOption < Servactory::ToolKit::DynamicOptions::Must
      def self.setup(option_name = :my_option)
        new(option_name).must(:be_the_best)
      end

      def condition_for_input_with(input:, value:, option_value:)
        # Здесь должны быть условия, предназначенные для атрибута input
      end

      def condition_for_internal_with(internal:, value:, option_value:)
        # Здесь должны быть условия, предназначенные для атрибута internal
      end

      def condition_for_output_with(output:, value:, option_value:)
        # Здесь должны быть условия, предназначенные для атрибута output
      end

      def message_for_input_with(service_class_name:, input:, value:, option_value:, **)
        # Здесь должен быть текст сообщения на случай, если условие не будет соблюдено
      end

      def message_for_internal_with(service_class_name:, internal:, value:, option_value:, **)
        # Здесь должен быть текст сообщения на случай, если условие не будет соблюдено
      end

      def message_for_output_with(service_class_name:, output:, value:, option_value:, **)
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
   ApplicationService::DynamicOptions::MyOption.setup
])

internal_option_helpers([
  ApplicationService::DynamicOptions::MyOption.setup(:my_best_option)
])

output_option_helpers([
  ApplicationService::DynamicOptions::MyOption.setup
])
```
