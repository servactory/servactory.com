---
title: Dynamic options for attributes
description: Description and examples of using dynamic options for all service attributes
prev: Advanced options mode
next: Using actions in service
---

# Dynamic options <Badge type="tip" text="Since 2.4.0" />

Dynamic options are additional `must`-based options that can take values as arguments.
Dynamic options are similar to [custom helpers](../attributes/input#custom),
but what sets them apart is their ability to work with arguments.

Servactory out of the box provides the following set of dynamic options:

- `consists_of`;
- `format`;
- `min`;
- `max`.

By default, only the `consists_of` option is enabled.
For the rest to work, you need to use ready-made sets in the configuration
of option helpers for each of the existing attributes.

## Ready-made options

### Option `consists_of` <Badge type="tip" text="Since 2.6.0" />

- Kit: `Servactory::ToolKit::DynamicOptions::ConsistsOf`
- Based on: `must`
- Enabled by default: Yes
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/consists_of.rb)

### Option `format`

- Kit: `Servactory::ToolKit::DynamicOptions::Format`
- Based on: `must`
- Enabled by default: No
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/format.rb)

#### Supported formats

- `uuid`;
- `email`;
- `password`;
- `duration`;
- `date`;
- `time`;
- `datetime`;
- `boolean`.

#### Customization

You can overwrite existing formats and add your own.
To do this, use the `formats` attribute in the `use` method:

```ruby
Servactory::ToolKit::DynamicOptions::Format.use(
  formats: {
    email: {
      pattern: /@/,
      validator: ->(value:) { value.present? }
    }
  }
)
```

#### Installation and usage

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

### Option `min`

- Kit: `Servactory::ToolKit::DynamicOptions::Min`
- Based on: `must`
- Enabled by default: No
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/min.rb)

#### Installation and usage

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

### Option `max`

- Kit: `Servactory::ToolKit::DynamicOptions::Max`
- Based on: `must`
- Enabled by default: No
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/max.rb)

#### Installation and usage

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

## Custom options

You can create your own dynamic options.

Use the prepared template provided below to implement your own dynamic option.

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
        # There should be conditions here that are intended for the input attribute
      end

      def condition_for_internal_with(internal:, value:, option:)
        # There should be conditions here that are intended for the internal attribute
      end

      def condition_for_output_with(output:, value:, option:)
        # There should be conditions here that are intended for the output attribute
      end

      def message_for_input_with(service_class_name:, input:, value:, option_value:, **)
        # There should be a message text here in case the condition is not met
      end

      def message_for_internal_with(service_class_name:, internal:, value:, option_value:, **)
        # There should be a message text here in case the condition is not met
      end

      def message_for_output_with(service_class_name:, output:, value:, option_value:, **)
        # There should be a message text here in case the condition is not met
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
