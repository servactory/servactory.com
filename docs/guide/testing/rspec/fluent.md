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
RSpec.describe OrderService::Create, type: :service do
  describe ".call!" do
    subject(:perform) { described_class.call!(**attributes) }

    let(:attributes) do
      {
        product_id:,
        quantity:
      }
    end

    let(:product_id) { "PROD-001" }
    let(:quantity) { 5 }

    describe "validations" do
      describe "inputs" do
        it do
          expect { perform }.to(
            have_input(:product_id)
              .type(String)
              .required
          )
        end

        it do
          expect { perform }.to(
            have_input(:quantity)
              .type(Integer)
              .required
          )
        end
      end

      describe "outputs" do
        it do
          expect(perform).to(
            have_output(:order_total)
              .instance_of(Integer)
          )
        end
      end
    end

    context "when required data for work is valid" do
      before do
        allow_service!(InventoryService)
          .with(product_id: "PROD-001", quantity: 5)
          .succeeds(available: true, unit_price: 100)
      end

      it do
        expect(perform).to(
          be_success_service
            .with_output(:order_total, 500)
        )
      end
    end

    context "when inventory service fails" do
      before do
        allow_service!(InventoryService)
          .fails(type: :out_of_stock, message: "Product not available")
      end

      it "raises expected exception", :aggregate_failures do
        expect { perform }.to raise_error(ApplicationService::Exceptions::Failure) do |exception|
          expect(exception.type).to eq(:out_of_stock)
          expect(exception.message).to eq("Product not available")
        end
      end
    end
  end
end
```

```ruby [Service]
class OrderService::Create < ApplicationService::Base
  input :product_id, type: String
  input :quantity, type: Integer

  output :order_total, type: Integer

  make :check_inventory
  make :calculate_total

  private

  def check_inventory
    InventoryService.call!(
      product_id: inputs.product_id,
      quantity: inputs.quantity
    )
  end

  def calculate_total
    inventory = InventoryService.call!(
      product_id: inputs.product_id,
      quantity: inputs.quantity
    )

    outputs.order_total = inventory.unit_price * inputs.quantity
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
