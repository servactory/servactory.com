---
title: RSpec — Testing services
description: Description and examples of service testing using RSpec
outline:
  level: deep
prev: Configuration
next: Extensions
---

# RSpec <Badge type="tip" text="Since 2.5.0" />

:::warning

This functionality was added in the `2.5.0` release and is currently experimental.
Some matchers may be changed without maintaining compatibility.
This documentation will attempt to detail the migration process should such a situation arise.

:::

## Installation

::: code-group

```ruby [spec/rails_helper.rb]
require "servactory/test_kit/rspec/helpers"
require "servactory/test_kit/rspec/matchers"
```

:::

::: code-group

```ruby [spec/rails_helper.rb]
RSpec.configure do |config|
  config.include Servactory::TestKit::Rspec::Helpers
  config.include Servactory::TestKit::Rspec::Matchers

  # ...
end
```

:::

## Helpers

### Helper `allow_service_as_success!`

Intended for mocking a call via `call!` with a successful result.

```ruby
before do
  allow_service_as_success!(UsersService::Accept)
end
```

```ruby
before do
  allow_service_as_success!(UsersService::Accept) do
    {
      user: user
    }
  end
end
```

### Helper `allow_service_as_success`

Intended for mocking a call via `call` with a successful result.

```ruby
before do
  allow_service_as_success(UsersService::Accept)
end
```

```ruby
before do
  allow_service_as_success(UsersService::Accept) do
    {
      user: user
    }
  end
end
```

### Helper `allow_service_as_failure!`

Intended for mocking a call via `call!` with a failed result.

```ruby
before do
  allow_service_as_failure!(UsersService::Accept) do
    ApplicationService::Exceptions::Failure.new(
      message: "Some error"
    )
  end
end
```

### Helper `allow_service_as_failure`

Intended for mocking a call via `call` with a failed result.

```ruby
before do
  allow_service_as_failure(UsersService::Accept) do
    ApplicationService::Exceptions::Failure.new(
      message: "Some error"
    )
  end
end
```

### Options

#### Option `with`

The methods `allow_service_as_success!`, `allow_service_as_success`,
`allow_service_as_failure!`, and `allow_service_as_failure` support the `with` option.

By default, this option does not require passing service arguments and will automatically
determine this data based on the `info` method.

```ruby
before do
  allow_service_as_success!(
    UsersService::Accept,
    with: { user: user } # [!code focus]
  )
end
```

```ruby
before do
  allow_service_as_success!(
    UsersService::Accept,
    with: { user: user } # [!code focus]
  ) do
    {
      user: user
    }
  end
end
```

## Matchers

### Matcher `have_service_input`

Alias: `have_input`

#### `type`

Checks the input type. Intended for one meaning.

```ruby
it do
  expect { perform }.to(
    have_input(:id)
      .type(Integer)
  )
end
```

#### `types`

Checks input types. Intended for multiple values.

```ruby
it do
  expect { perform }.to(
    have_input(:ids)
      .types(Integer, String)
  )
end
```

#### `required`

Checks whether the input is required.

```ruby
it do
  expect { perform }.to(
    have_input(:id)
      .type(Integer)
      .required
  )
end
```

#### `optional`

Checks whether the input is optional.

```ruby
it do
  expect { perform }.to(
    have_input(:middle_name)
      .type(String)
      .optional
  )
end
```

#### `default`

Checks the default value of the input.

```ruby
it do
  expect { perform }.to(
    have_input(:middle_name)
      .type(String)
      .optional
      .default("<unknown>")
  )
end
```

#### `consists_of`

Checks the nested types of the input collection. You can specify multiple values.

::: code-group

```ruby [Without message]
it do
  expect { perform }.to(
    have_input(:ids)
      .type(Array)
      .required
      .consists_of(String)
  )
end
```

```ruby [With message]
it do
  expect { perform }.to(
    have_input(:ids)
      .type(Array)
      .required
      .consists_of(String)
      .message("Input `ids` must be a collection of `String`") # [!code focus]
  )
end
```

:::

#### `inclusion`

Checks the values of the `inclusion` option of the input.

::: code-group

```ruby [Without message]
it do
  expect { perform }.to(
    have_input(:event_name)
      .type(String)
      .required
      .inclusion(%w[created rejected approved])
  )
end
```

```ruby [With message]
it do
  expect { perform }.to(
    have_input(:event_name)
      .type(String)
      .required
      .inclusion(%w[created rejected approved])
      .message(be_a(Proc)) # [!code focus]
  )
end
```

:::

#### `schema` <Badge type="info" text="input (^2.12.0)" /> <Badge type="info" text="internal (^2.12.0)" /> <Badge type="info" text="output (^2.12.0)" />

Checks the values of the `schema` option of the input.

::: code-group

```ruby [Without message]
it do
  expect { perform }.to(
    have_input(:payload)
      .type(Hash)
      .required
      .schema(
        {
          request_id: { type: String, required: true },
          user: {
            # ...
          }
        }
      )
  )
end
```

```ruby [With message]
it do
  expect { perform }.to(
    have_input(:payload)
      .type(Hash)
      .required
      .schema(
        {
          request_id: { type: String, required: true },
          user: {
            # ...
          }
        }
      )
      .message("Problem with the value in the schema") # [!code focus]
  )
end
```

:::

#### `message` <Badge type="info" text="input (^2.12.0)" /> <Badge type="info" text="internal (^2.12.0)" /> <Badge type="info" text="output (^2.12.0)" />

Checks `message` from the last chain.
Currently only works with `consists_of`, `inclusion` and `schema` chains.

```ruby
it do
  expect { perform }.to(
    have_input(:ids)
      .type(Array)
      .required
      .consists_of(String) # [!code focus]
      .message("Input `ids` must be a collection of `String`") # [!code focus]
  )
end
```

#### `must`

Checks for the presence of the expected key in the `must` input.
You can specify multiple values.

```ruby
it do
  expect { perform }.to(
    have_input(:invoice_numbers)
      .type(Array)
      .consists_of(String)
      .required
      .must(:be_6_characters)
  )
end
```

#### `valid_with`

This chain will try to check the actual behavior of the input based on the data passed.

```ruby
subject(:perform) { described_class.call!(**attributes) }

let(:attributes) do
  {
    first_name: first_name,
    middle_name: middle_name,
    last_name: last_name
  }
end

it do
  expect { perform }.to(
    have_input(:first_name)
      .valid_with(attributes)
      .type(String)
      .required
  )
end
```

### Matcher `have_service_internal`

Alias: `have_internal`

#### `type`

Checks the type of an internal attribute. Intended for one meaning.

```ruby
it do
  expect { perform }.to(
    have_internal(:id)
      .type(Integer)
  )
end
```

#### `types`

Checks the types of an internal attribute. Intended for multiple values.

```ruby
it do
  expect { perform }.to(
    have_internal(:ids)
      .types(Integer, String)
  )
end
```

#### `consists_of`

Checks the nested types of an internal attribute collection.
You can specify multiple values.

::: code-group

```ruby [Without message]
it do
  expect { perform }.to(
    have_internal(:ids)
      .type(Array)
      .consists_of(String)
  )
end
```

```ruby [With message]
it do
  expect { perform }.to(
    have_internal(:ids)
      .type(Array)
      .consists_of(String)
      .message("Input `ids` must be a collection of `String`") # [!code focus]
  )
end
```

:::

#### `inclusion`

Checks the values of the `inclusion` option of an internal attribute.

::: code-group

```ruby [Without message]
it do
  expect { perform }.to(
    have_internal(:event_name)
      .type(String)
      .inclusion(%w[created rejected approved])
  )
end
```

```ruby [With message]
it do
  expect { perform }.to(
    have_internal(:event_name)
      .type(String)
      .inclusion(%w[created rejected approved])
      .message(be_a(Proc)) # [!code focus]
  )
end
```

:::

#### `schema` <Badge type="info" text="input (^2.12.0)" /> <Badge type="info" text="internal (^2.12.0)" /> <Badge type="info" text="output (^2.12.0)" />

Checks the values of the `schema` option of an internal attribute.

::: code-group

```ruby [Without message]
it do
  expect { perform }.to(
    have_input(:payload)
      .type(Hash)
      .schema(
        {
          request_id: { type: String, required: true },
          user: {
            # ...
          }
        }
      )
  )
end
```

```ruby [With message]
it do
  expect { perform }.to(
    have_input(:payload)
      .type(Hash)
      .schema(
        {
          request_id: { type: String, required: true },
          user: {
            # ...
          }
        }
      )
      .message("Problem with the value in the schema") # [!code focus]
  )
end
```

:::

#### `message` <Badge type="info" text="input (^2.12.0)" /> <Badge type="info" text="internal (^2.12.0)" /> <Badge type="info" text="output (^2.12.0)" />

Checks `message` from the last chain.
Currently only works with `consists_of`, `inclusion` and `schema` chains.

```ruby
it do
  expect { perform }.to(
    have_input(:ids)
      .type(Array)
      .consists_of(String) # [!code focus]
      .message("Input `ids` must be a collection of `String`") # [!code focus]
  )
end
```

#### `must`

Checks for the presence of the expected key in the `must` internal attribute.
You can specify multiple values.

```ruby
it do
  expect { perform }.to(
    have_internal(:invoice_numbers)
      .type(Array)
      .consists_of(String)
      .must(:be_6_characters)
  )
end
```

### Matcher `have_service_output`

Alias: `have_output`

#### `instance_of`

Checks the type of the output attribute.

```ruby
it do
  expect(perform).to(
    have_output(:event)
      .instance_of(Event)
  )
end
```

#### `contains`

:::info

In release `2.9.0` the `with` chain was renamed to `contains`.

:::

Checks the value of the output attribute.

```ruby
it do
  expect(perform).to(
    have_output(:full_name)
      .contains("John Fitzgerald Kennedy")
  )
end
```

#### `nested`

Points to the nested value of the output attribute.

```ruby
it do
  expect(perform).to(
    have_output(:event)
      .nested(:id)
      .contains("14fe213e-1b0a-4a68-bca9-ce082db0f2c6")
  )
end
```

### Matcher `be_success_service`

::: code-group

```ruby [minimal]
it { expect(perform).to be_success_service }
```

:::

#### `with_output`

```ruby
it do
  expect(result.child_result).to(
    be_success_service
      .with_output(:id, "...")
  )
end
```

#### `with_outputs`

```ruby
it do
  expect(result.child_result).to(
    be_success_service
      .with_outputs(
        id: "...",
        full_name: "...",
        # ...
      )
  )
end
```

### Matcher `be_failure_service`

::: code-group

```ruby [minimal]
it { expect(perform).to be_failure_service }
```

```ruby [full]
it "returns expected failure" do
  expect(perform).to(
    be_failure_service
      .with(ApplicationService::Exceptions::Failure)
      .type(:base)
      .message("Some error")
      .meta(nil)
  )
end
```

:::

#### `with`

```ruby
it "returns expected failure" do
  expect(perform).to(
    be_failure_service
      .with(ApplicationService::Exceptions::Failure)
  )
end
```

#### `type`

```ruby
it "returns expected failure" do
  expect(perform).to(
    be_failure_service
      .type(:base)
  )
end
```

#### `message`

```ruby
it "returns expected failure" do
  expect(perform).to(
    be_failure_service
      .message("Some error")
  )
end
```

#### `meta`

```ruby
it "returns expected failure" do
  expect(perform).to(
    be_failure_service
      .meta(nil)
  )
end
```
