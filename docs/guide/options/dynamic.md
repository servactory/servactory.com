---
title: Dynamic Options for Attributes
description: Description and examples of using dynamic options for all service attributes
prev: Advanced Options Mode
next: Using Actions in a Service
---

# Dynamic Options <Badge type="tip" text="Since 2.4.0" />

Dynamic options are additional options based on `must`
that can accept values as arguments.
Dynamic options are similar to [custom helpers](../attributes/input#custom),
but what distinguishes them is the ability to work with arguments.

Servactory provides the following set of dynamic options out of the box:

- `consists_of`;
- `format`;
- `inclusion`;
- `max`;
- `min`;
- `multiple_of`;
- `schema`.

By default, the following options are enabled: `consists_of`, `inclusion`, and `schema`.
To use the others, you need to apply ready-made sets in the option helpers configuration
for each of the existing attributes.

## Ready-made Options

### `consists_of` Option <Badge type="tip" text="Since 2.6.0" />

- Set: `Servactory::ToolKit::DynamicOptions::ConsistsOf`
- Based on: `must`
- Enabled by default: Yes
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/consists_of.rb)

### `format` Option

- Set: `Servactory::ToolKit::DynamicOptions::Format`
- Based on: `must`
- Enabled by default: No
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/format.rb)

#### Supported Formats

- `uuid`;
- `email`;
- `password`;
- `duration`;
- `date`;
- `time`;
- `datetime`;
- `boolean`.

#### Customization

You can override existing formats and add your own.
To do this, use the `formats` attribute in the `use` method:

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

#### Installation and Usage

::: code-group

```ruby [Installation]
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

```ruby [Usage]
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

### `inclusion` Option <Badge type="tip" text="Since 2.12.0" />

- Set: `Servactory::ToolKit::DynamicOptions::Inclusion`
- Based on: `must`
- Enabled by default: Yes
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/inclusion.rb)

### `max` Option

- Set: `Servactory::ToolKit::DynamicOptions::Max`
- Based on: `must`
- Enabled by default: No
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/max.rb)

#### Installation and Usage

::: code-group

```ruby [Installation]
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

```ruby [Usage]
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

### `min` Option

- Set: `Servactory::ToolKit::DynamicOptions::Min`
- Based on: `must`
- Enabled by default: No
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/min.rb)

#### Installation and Usage

::: code-group

```ruby [Installation]
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

```ruby [Usage]
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

### `multiple_of` Option

- Set: `Servactory::ToolKit::DynamicOptions::MultipleOf`
- Based on: `must`
- Enabled by default: No
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/multiple_of.rb)

#### Installation and Usage

::: code-group

```ruby [Installation]
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

```ruby [Usage]
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

### `schema` Option <Badge type="tip" text="Since 2.12.0" />

- Set: `Servactory::ToolKit::DynamicOptions::Schema`
- Based on: `must`
- Enabled by default: Yes
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/schema.rb)

## Custom Options

You can create your own dynamic options.

Use the prepared template provided below to implement
your own dynamic option.

It is recommended to place the class file in the
`app/services/application_service/dynamic_options` directory of your project.

### Template

::: code-group

```ruby [app/services/application_service/dynamic_options/my_option.rb]
module ApplicationService
  module DynamicOptions
    class MyOption < Servactory::ToolKit::DynamicOptions::Must
      def self.use(option_name = :my_option, **options)
        new(option_name).must(:be_the_best)
      end

      def condition_for_input_with(input:, value:, option:)
        # Here should be conditions intended for the input attribute
      end

      def condition_for_internal_with(internal:, value:, option:)
        # Here should be conditions intended for the internal attribute
      end

      def condition_for_output_with(output:, value:, option:)
        # Here should be conditions intended for the output attribute
      end

      def message_for_input_with(service:, input:, value:, option_value:, **)
        # Here should be the message text in case the condition is not met
      end

      def message_for_internal_with(service:, internal:, value:, option_value:, **)
        # Here should be the message text in case the condition is not met
      end

      def message_for_output_with(service:, output:, value:, option_value:, **)
        # Here should be the message text in case the condition is not met
      end
    end
  end
end
```

:::

### Application

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
