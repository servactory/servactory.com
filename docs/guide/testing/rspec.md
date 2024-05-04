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
  allow_service_as_failure!(UsersService::Accept) do
    ApplicationService::Exceptions::Failure.new(
      message: "Some error"
    )
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

```ruby
it do
  expect { perform }.to(
    have_input(:ids)
      .type(Array)
      .consists_of(String) { "Input `ids` must be an array of `String`" }
      .required
  )
end
```

#### `inclusion`

Checks the values of the `inclusion` option of the input.

```ruby
it do
  expect { perform }.to(
    have_input(:event_name)
      .type(String)
      .required
      .inclusion(%w[created rejected approved])
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

```ruby
it do
  expect { perform }.to(
    have_internal(:ids)
      .type(Array)
      .consists_of(String) { "Input `ids` must be an array of `String`" }
  )
end
```

#### `inclusion`

Checks the values of the `inclusion` option of an internal attribute.

```ruby
it do
  expect { perform }.to(
    have_internal(:event_name)
      .type(String)
      .inclusion(%w[created rejected approved])
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

#### `nested`

Points to the nested value of the output attribute.

```ruby
it do
  expect(perform).to(
    have_output(:event)
      .nested(:id)
      .with("14fe213e-1b0a-4a68-bca9-ce082db0f2c6")
  )
end
```

#### `with`

Checks the value of the output attribute.

```ruby
it do
  expect(perform).to(
    have_output(:full_name)
      .with("John Fitzgerald Kennedy")
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
