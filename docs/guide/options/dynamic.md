---
title: Dynamic options for attributes
description: Description and examples of using dynamic options for all service attributes
prev: Advanced options mode
next: Using actions in service
---

# Dynamic options <Badge type="tip" text="Since 2.4.0" />

Dynamic options are `must`-based options that accept values as arguments.
Unlike [custom helpers](../attributes/input#custom), dynamic options work with arguments.

Servactory out of the box provides the following set of dynamic options:

- `consists_of`;
- `format`;
- `inclusion`;
- `max`;
- `min`;
- `multiple_of`;
- `schema`;
- `target`.

By default, `consists_of`, `inclusion`, and `schema` are enabled.
Enable the rest via ready-made sets in the option helpers configuration for each attribute.

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

Overwrite existing formats or add custom ones via the `formats` attribute in the `use` method:

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

### Option `inclusion` <Badge type="tip" text="Since 2.12.0" />

- Kit: `Servactory::ToolKit::DynamicOptions::Inclusion`
- Based on: `must`
- Enabled by default: Yes
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/inclusion.rb)

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

### Option `multiple_of`

- Kit: `Servactory::ToolKit::DynamicOptions::MultipleOf`
- Based on: `must`
- Enabled by default: No
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/multiple_of.rb)

#### Installation and usage

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

### Option `schema` <Badge type="tip" text="Since 2.12.0" />

- Kit: `Servactory::ToolKit::DynamicOptions::Schema`
- Based on: `must`
- Enabled by default: Yes
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/schema.rb)

### Option `target` <Badge type="tip" text="Since 3.0.0" />

- Kit: `Servactory::ToolKit::DynamicOptions::Target`
- Based on: `must`
- Enabled by default: No
- [Source code](https://github.com/servactory/servactory/blob/main/lib/servactory/tool_kit/dynamic_options/target.rb)

#### Installation and usage

::: code-group

```ruby [Installation]
input_option_helpers([
  Servactory::ToolKit::DynamicOptions::Target.use
])

internal_option_helpers([
  Servactory::ToolKit::DynamicOptions::Target.use(:expect)
])

output_option_helpers([
  Servactory::ToolKit::DynamicOptions::Target.use
])
```

```ruby [Usage]
input :service_class,
      type: Class,
      target: MyFirstService

internal :service_class,
         type: Class,
         expect: { in: [MyFirstService, MySecondService] }

output :service_class,
       type: Class,
       target: {
         in: [MyFirstService, MySecondService],
         message: lambda do |output:, value:, option_value:, **|
           "Output `#{output.name}`: #{value.inspect} is not allowed. " \
             "Allowed: #{Array(option_value).map(&:name).join(', ')}"
         end
       }
```

:::

## Custom options

Create custom dynamic options using the template below.

Place the class file in `app/services/application_service/dynamic_options`.

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

      def message_for_input_with(service:, input:, value:, option_value:, **)
        # There should be a message text here in case the condition is not met
      end

      def message_for_internal_with(service:, internal:, value:, option_value:, **)
        # There should be a message text here in case the condition is not met
      end

      def message_for_output_with(service:, output:, value:, option_value:, **)
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
