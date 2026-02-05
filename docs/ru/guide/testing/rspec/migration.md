---
title: Руководство по миграции — Legacy в Fluent
description: Как мигрировать с Legacy RSpec хелперов на новый Fluent API
outline:
  level: deep
prev: RSpec (Legacy)
next: Расширения
---

# Руководство по миграции <Badge type="tip" text="Начиная с 3.0.0" />

Это руководство помогает мигрировать с Legacy RSpec хелперов на новый Fluent API.

## Краткая справка

| Legacy | Fluent |
|--------|--------|
| `allow_service_as_success!(S) { out }` | `allow_service!(S).succeeds(out)` |
| `allow_service_as_success(S) { out }` | `allow_service(S).succeeds(out)` |
| `allow_service_as_failure!(S) { exc }` | `allow_service!(S).fails(type:, message:)` |
| `allow_service_as_failure(S) { exc }` | `allow_service(S).fails(type:, message:)` |

## Миграция Success моков

### Базовый Success

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

### Success с матчингом инпутов

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

## Миграция Failure моков

### Базовый Failure

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

### Failure с Meta

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

### Failure с кастомным классом исключения

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

## Новые возможности Fluent API

### Последовательные вызовы

Тестирование сервисов, которые вызываются несколько раз с разными результатами:

```ruby
before do
  allow_service!(RetryService)
    .succeeds(status: :pending)
    .then_succeeds(status: :processing)
    .then_succeeds(status: :completed)
end
```

### Failure после Success

Тестирование сценариев retry, где сервис в итоге возвращает ошибку:

```ruby
before do
  allow_service!(ExternalApiService)
    .succeeds(response: { status: "pending" })
    .then_fails(type: :timeout, message: "Request timed out")
end
```

### Кастомные классы исключений

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

## Ключевые различия

| Аспект | Legacy | Fluent |
|--------|--------|--------|
| Стиль | Блоки | Цепочка методов |
| Outputs | Возврат из блока | Аргументы методов |
| Исключения | Создание вручную в блоке | Построение из параметров |
| Последовательность | Не поддерживается | `then_succeeds`, `then_fails` |
| Валидация | Базовая | Автоматическая по определению сервиса |

## Что не требует миграции

Следующие компоненты **не изменились** между Legacy и Fluent API:

### Матчеры

Все матчеры работают одинаково в обоих API:

- `have_input` / `have_service_input`
- `have_internal` / `have_service_internal`
- `have_output` / `have_service_output`
- `be_success_service`
- `be_failure_service`

```ruby
# Эти тесты работают одинаково в Legacy и Fluent
it { expect { perform }.to have_input(:email).type(String).required }
it { expect { perform }.to have_internal(:result).type(Servactory::Result) }
it { expect(perform).to have_output(:user).instance_of(User) }
it { expect(perform).to be_success_service }
it { expect(perform).to be_failure_service }
```

### Установка

Процесс установки идентичен — те же requires, та же конфигурация RSpec.
