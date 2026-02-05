---
title: Migration Guide — Legacy to Fluent
description: How to migrate from Legacy RSpec helpers to the new Fluent API
outline:
  level: deep
prev: RSpec (Legacy)
next: Extensions
---

# Migration Guide <Badge type="tip" text="Since 3.0.0" />

This guide helps you migrate from the Legacy RSpec helpers to the new Fluent API.

## Quick Reference

| Legacy | Fluent |
|--------|--------|
| `allow_service_as_success!(S) { out }` | `allow_service!(S).succeeds(out)` |
| `allow_service_as_success(S) { out }` | `allow_service(S).succeeds(out)` |
| `allow_service_as_failure!(S) { exc }` | `allow_service!(S).fails(type:, message:)` |
| `allow_service_as_failure(S) { exc }` | `allow_service(S).fails(type:, message:)` |

## Migrating Success Mocks

### Basic Success

::: code-group

```ruby [Legacy]
before do
  allow_service_as_success!(UsersService::Create) do
    { user: user }
  end
end
```

```ruby [Fluent]
before do
  allow_service!(UsersService::Create)
    .succeeds(user: user)
end
```

:::

### Success with Input Matching

::: code-group

```ruby [Legacy]
before do
  allow_service_as_success!(PaymentService, with: { amount: 100 }) do
    { transaction_id: "txn_123" }
  end
end
```

```ruby [Fluent]
before do
  allow_service!(PaymentService)
    .with(amount: 100)
    .succeeds(transaction_id: "txn_123")
end
```

:::

## Migrating Failure Mocks

### Basic Failure

::: code-group

```ruby [Legacy]
before do
  allow_service_as_failure!(PaymentService) do
    {
      exception: ApplicationService::Exceptions::Failure.new(
        type: :payment_declined,
        message: "Card declined"
      )
    }
  end
end
```

```ruby [Fluent]
before do
  allow_service!(PaymentService)
    .fails(type: :payment_declined, message: "Card declined")
end
```

:::

### Failure with Meta

::: code-group

```ruby [Legacy]
before do
  allow_service_as_failure!(ValidationService) do
    {
      exception: ApplicationService::Exceptions::Failure.new(
        type: :validation,
        message: "Invalid input",
        meta: { field: :email }
      )
    }
  end
end
```

```ruby [Fluent]
before do
  allow_service!(ValidationService)
    .fails(
      type: :validation,
      message: "Invalid input",
      meta: { field: :email }
    )
end
```

:::

### Failure with Custom Exception Class

::: code-group

```ruby [Legacy]
before do
  allow_service_as_failure!(PaymentService) do
    {
      exception: CustomPaymentException.new(
        type: :declined,
        message: "Insufficient funds"
      )
    }
  end
end
```

```ruby [Fluent]
before do
  allow_service!(PaymentService)
    .fails(
      CustomPaymentException,
      type: :declined,
      message: "Insufficient funds"
    )
end
```

:::

## New Features in Fluent API

### Sequential Calls

Test services that are called multiple times with different results:

```ruby
before do
  allow_service!(RetryService)
    .succeeds(status: :pending)
    .then_succeeds(status: :processing)
    .then_succeeds(status: :completed)
end
```

### Failure After Success

Test retry scenarios where service eventually fails:

```ruby
before do
  allow_service!(ExternalApiService)
    .succeeds(response: { status: "pending" })
    .then_fails(type: :timeout, message: "Request timed out")
end
```

### Custom Exception Classes

```ruby
before do
  allow_service!(PaymentService)
    .fails(
      CustomPaymentException,
      type: :declined,
      message: "Insufficient funds"
    )
end
```

## Key Differences

| Aspect | Legacy | Fluent |
|--------|--------|--------|
| Style | Block-based | Method chaining |
| Outputs | Returned from block | Passed as arguments |
| Exceptions | Create manually in block | Built from parameters |
| Sequential | Not supported | `then_succeeds`, `then_fails` |
| Validation | Basic | Automatic against service |

## What Doesn't Need Migration

The following components are **unchanged** between Legacy and Fluent APIs:

### Matchers

All matchers work identically in both APIs:

- `have_input` / `have_service_input`
- `have_internal` / `have_service_internal`
- `have_output` / `have_service_output`
- `be_success_service`
- `be_failure_service`

```ruby
# These tests work the same way in Legacy and Fluent
it { expect { perform }.to have_input(:email).type(String).required }
it { expect { perform }.to have_internal(:result).type(Servactory::Result) }
it { expect(perform).to have_output(:user).instance_of(User) }
it { expect(perform).to be_success_service }
it { expect(perform).to be_failure_service }
```

### Installation

The installation process is identical — same requires, same RSpec configuration.
