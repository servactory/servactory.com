---
title: RSpec — Testing services
description: Description and examples of service testing using RSpec
outline:
  level: deep
prev: Configuration
next: RSpec (Legacy)
---

# RSpec <Badge type="tip" text="Since 3.0.0" />

This page documents the recommended testing helpers with method chaining support.

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

### Helper `allow_service`

Mocks a `.call` invocation with a specified result.

Returns a builder object that supports method chaining.

```ruby
before do
  allow_service(PaymentService)
    .succeeds(transaction_id: "txn_123", status: :completed)
end
```

### Helper `allow_service!`

Mocks a `.call!` invocation with a specified result.

When failure is configured, raises an exception instead of returning a Result with error.

```ruby
before do
  allow_service!(PaymentService)
    .succeeds(transaction_id: "txn_123", status: :completed)
end
```

### Chainable Methods

#### `succeeds`

Configures the mock to return a successful result with specified outputs.

```ruby
allow_service(PaymentService)
  .succeeds(transaction_id: "txn_123", status: :completed)
```

#### `fails`

Configures the mock to return a failure result.

```ruby
allow_service(PaymentService)
  .fails(type: :payment_declined, message: "Card declined")
```

With meta information:

```ruby
allow_service(PaymentService)
  .fails(type: :validation, message: "Invalid amount", meta: { field: :amount })
```

With custom exception class:

```ruby
allow_service(PaymentService)
  .fails(
    CustomException,
    type: :payment_declined,
    message: "Card declined"
  )
```

#### `with`

Specifies the expected inputs for the mock to match.

```ruby
allow_service(PaymentService)
  .with(amount: 100, currency: "USD")
  .succeeds(transaction_id: "txn_100")
```

The `with` method supports argument matchers (see [Argument Matchers](#argument-matchers)).

#### `then_succeeds`

Configures sequential return values for multiple calls.

```ruby
allow_service(RetryService)
  .succeeds(status: :pending)
  .then_succeeds(status: :completed)
```

#### `then_fails`

Configures sequential return with failure on subsequent call.

```ruby
allow_service(RetryService)
  .succeeds(status: :pending)
  .then_fails(type: :timeout, message: "Request timed out")
```

### Argument Matchers

#### `including`

Matches inputs containing at least the specified key-value pairs.

```ruby
allow_service(OrderService)
  .with(including(quantity: 5))
  .succeeds(total: 500)
```

```ruby
allow_service(OrderService)
  .with(including(product_id: "PROD-001", quantity: 5))
  .succeeds(total: 1000)
```

#### `excluding`

Matches inputs that do not contain the specified keys.

```ruby
allow_service(OrderService)
  .with(excluding(secret_key: anything))
  .succeeds(total: 750)
```

#### `any_inputs`

Matches any arguments passed to the service.

```ruby
allow_service(NotificationService)
  .with(any_inputs)
  .succeeds(sent: true)
```

#### `no_inputs`

Matches when no arguments are passed.

```ruby
allow_service(HealthCheckService)
  .with(no_inputs)
  .succeeds(healthy: true)
```

### Automatic Validation

The helpers automatically validate inputs and outputs against the service definition.

#### Input Validation

When using `with`, the helper validates that specified inputs exist in the service:

```ruby
# Raises ValidationError: unknown_input is not defined in ServiceClass
allow_service!(ServiceClass)
  .with(unknown_input: "value")
  .succeeds(result: "ok")
```

#### Output Validation

The helper validates that specified outputs exist and match expected types:

```ruby
# Raises ValidationError: unknown_output is not defined in ServiceClass
allow_service!(ServiceClass)
  .succeeds(unknown_output: "value")
```

```ruby
# Raises ValidationError: order_number expects Integer, got String
allow_service!(ServiceClass)
  .succeeds(order_number: "not_an_integer")
```

## Example

::: code-group

```ruby [RSpec]
RSpec.describe UsersService::Create, type: :service do
  describe ".call!" do
    subject(:perform) { described_class.call!(**attributes) }

    let(:attributes) do
      {
        email:,
        first_name:,
        last_name:
      }
    end

    let(:email) { "john@example.com" }
    let(:first_name) { "John" }
    let(:last_name) { "Kennedy" }

    describe "validations" do
      describe "inputs" do
        it do
          expect { perform }.to(
            have_input(:email)
              .type(String)
              .required
          )
        end

        it do
          expect { perform }.to(
            have_input(:first_name)
              .type(String)
              .required
          )
        end

        it do
          expect { perform }.to(
            have_input(:last_name)
              .type(String)
              .optional
          )
        end
      end

      describe "internals" do
        it do
          expect { perform }.to(
            have_internal(:email_verification)
              .type(Servactory::Result)
          )
        end
      end

      describe "outputs" do
        it do
          expect(perform).to(
            have_output(:user)
              .instance_of(User)
          )
        end
      end
    end

    describe "and the data required for work is also valid" do
      before do
        allow_service!(EmailVerificationService)
          .with(email: "john@example.com")
          .succeeds(valid: true, normalized: "john@example.com")
      end

      it do
        expect(perform).to(
          be_success_service
            .with_output(:user, be_a(User))
        )
      end
    end

    describe "but the data required for work is invalid" do
      describe "because email verification fails" do
        before do
          allow_service!(EmailVerificationService)
            .fails(type: :invalid_email, message: "Email is not valid")
        end

        it "returns expected error", :aggregate_failures do
          expect { perform }.to(
            raise_error do |exception|
              expect(exception).to be_a(ApplicationService::Exceptions::Failure)
              expect(exception.type).to eq(:invalid_email)
              expect(exception.message).to eq("Email is not valid")
              expect(exception.meta).to be_nil
            end
          )
        end
      end
    end
  end
end
```

```ruby [Service]
class UsersService::Create < ApplicationService::Base
  input :email, type: String
  input :first_name, type: String
  input :last_name, type: String, required: false

  internal :email_verification, type: Servactory::Result

  output :user, type: User

  make :verify_email
  make :create_user

  private

  def verify_email
    internals.email_verification = EmailVerificationService.call!(
      email: inputs.email
    )
  end

  def create_user
    outputs.user = User.create!(
      email: internals.email_verification.normalized,
      first_name: inputs.first_name,
      last_name: inputs.last_name
    )
  end
end
```

:::

## Matchers

### Matcher `have_input` <Badge type="info" text="have_service_input" />

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
    have_input(:id)
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

#### `target`

Checks the values of the `target` option of the input.

::: code-group

```ruby [Without message]
it do
  expect { perform }.to(
    have_input(:service_class)
      .type(Class)
      .target([MyFirstService, MySecondService])
  )
end
```

```ruby [With message]
it do
  expect { perform }.to(
    have_input(:service_class)
      .type(Class)
      .target([MyFirstService, MySecondService])
      .message("Must be a valid service class") # [!code focus]
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

### Matcher `have_internal` <Badge type="info" text="have_service_internal" />

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
    have_internal(:id)
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
      .message("Internal `ids` must be a collection of `String`") # [!code focus]
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

#### `target`

Checks the values of the `target` option of an internal attribute.

::: code-group

```ruby [Without message]
it do
  expect { perform }.to(
    have_internal(:service_class)
      .type(Class)
      .target([MyFirstService, MySecondService])
  )
end
```

```ruby [With message]
it do
  expect { perform }.to(
    have_internal(:service_class)
      .type(Class)
      .target([MyFirstService, MySecondService])
      .message("Must be a valid service class") # [!code focus]
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
    have_internal(:payload)
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
    have_internal(:payload)
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
    have_internal(:ids)
      .type(Array)
      .consists_of(String) # [!code focus]
      .message("Internal `ids` must be a collection of `String`") # [!code focus]
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

### Matcher `have_output` <Badge type="info" text="have_service_output" />

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
  expect(perform).to(
    be_success_service
      .with_output(:id, "...")
  )
end
```

#### `with_outputs`

```ruby
it do
  expect(perform).to(
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
