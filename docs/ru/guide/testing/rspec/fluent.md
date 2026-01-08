---
title: RSpec — Тестирование сервисов
description: Описание и примеры тестирования сервисов с применением RSpec
outline:
  level: deep
prev: Конфигурация
next: RSpec (Legacy)
---

# RSpec <Badge type="tip" text="Начиная с 3.0.0" />

Эта страница документирует рекомендуемые тестовые хелперы с поддержкой цепочки методов.

## Установка

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

## Хелперы

### Хелпер `allow_service`

Выполняет мок вызова `.call` с указанным результатом.

Возвращает объект-билдер с поддержкой цепочки методов.

```ruby
before do
  allow_service(PaymentService)
    .succeeds(transaction_id: "txn_123", status: :completed)
end
```

### Хелпер `allow_service!`

Выполняет мок вызова `.call!` с указанным результатом.

При конфигурации неудачи выбрасывает исключение вместо возврата Result с ошибкой.

```ruby
before do
  allow_service!(PaymentService)
    .succeeds(transaction_id: "txn_123", status: :completed)
end
```

### Цепочки методов

#### `succeeds`

Конфигурирует мок для возврата успешного результата с указанными outputs.

```ruby
allow_service(PaymentService)
  .succeeds(transaction_id: "txn_123", status: :completed)
```

#### `fails`

Конфигурирует мок для возврата неудачного результата.

```ruby
allow_service(PaymentService)
  .fails(type: :payment_declined, message: "Card declined")
```

С мета-информацией:

```ruby
allow_service(PaymentService)
  .fails(type: :validation, message: "Invalid amount", meta: { field: :amount })
```

С пользовательским классом исключения:

```ruby
allow_service(PaymentService)
  .fails(
    CustomException,
    type: :payment_declined,
    message: "Card declined"
  )
```

#### `with`

Указывает ожидаемые inputs для срабатывания мока.

```ruby
allow_service(PaymentService)
  .with(amount: 100, currency: "USD")
  .succeeds(transaction_id: "txn_100")
```

Метод `with` поддерживает матчеры аргументов (см. [Матчеры аргументов](#матчеры-аргументов)).

#### `then_succeeds`

Конфигурирует последовательные возвращаемые значения для нескольких вызовов.

```ruby
allow_service(RetryService)
  .succeeds(status: :pending)
  .then_succeeds(status: :completed)
```

#### `then_fails`

Конфигурирует последовательный возврат с неудачей при следующем вызове.

```ruby
allow_service(RetryService)
  .succeeds(status: :pending)
  .then_fails(type: :timeout, message: "Request timed out")
```

### Матчеры аргументов

#### `including`

Сопоставляет inputs, содержащие как минимум указанные пары ключ-значение.

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

Сопоставляет inputs, не содержащие указанные ключи.

```ruby
allow_service(OrderService)
  .with(excluding(secret_key: anything))
  .succeeds(total: 750)
```

#### `any_inputs`

Сопоставляет любые аргументы, переданные сервису.

```ruby
allow_service(NotificationService)
  .with(any_inputs)
  .succeeds(sent: true)
```

#### `no_inputs`

Сопоставляет случай, когда аргументы не переданы.

```ruby
allow_service(HealthCheckService)
  .with(no_inputs)
  .succeeds(healthy: true)
```

### Автоматическая валидация

Хелперы автоматически валидируют inputs и outputs на соответствие определению сервиса.

#### Валидация inputs

При использовании `with` хелпер проверяет, что указанные inputs существуют в сервисе:

```ruby
# Вызывает ValidationError: unknown_input не определен в ServiceClass
allow_service!(ServiceClass)
  .with(unknown_input: "value")
  .succeeds(result: "ok")
```

#### Валидация outputs

Хелпер проверяет, что указанные outputs существуют и соответствуют ожидаемым типам:

```ruby
# Вызывает ValidationError: unknown_output не определен в ServiceClass
allow_service!(ServiceClass)
  .succeeds(unknown_output: "value")
```

```ruby
# Вызывает ValidationError: order_number ожидает Integer, получен String
allow_service!(ServiceClass)
  .succeeds(order_number: "not_an_integer")
```

## Пример

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

```ruby [Сервис]
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

## Матчеры

### Матчер `have_input` <Badge type="info" text="have_service_input" />

#### `type`

Проверяет тип инпута. Предназначен для одного значения.

```ruby
it do
  expect { perform }.to(
    have_input(:id)
      .type(Integer)
  )
end
```

#### `types`

Проверяет типы инпута. Предназначен для нескольких значений.

```ruby
it do
  expect { perform }.to(
    have_input(:id)
      .types(Integer, String)
  )
end
```

#### `required`

Проверяет обязательность инпута.

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

Проверяет опциональность инпута.

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

Проверяет дефолтное значение инпута.

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

Проверяет вложенные типы коллекции инпута. Можно указать несколько значений.

::: code-group

```ruby [Без message]
it do
  expect { perform }.to(
    have_input(:ids)
      .type(Array)
      .required
      .consists_of(String)
  )
end
```

```ruby [С message]
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

Проверяет значения опции `inclusion` инпута.

::: code-group

```ruby [Без message]
it do
  expect { perform }.to(
    have_input(:event_name)
      .type(String)
      .required
      .inclusion(%w[created rejected approved])
  )
end
```

```ruby [С message]
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

Проверяет значения опции `target` инпута.

::: code-group

```ruby [Без message]
it do
  expect { perform }.to(
    have_input(:service_class)
      .type(Class)
      .target([MyFirstService, MySecondService])
  )
end
```

```ruby [С message]
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

Проверяет значения опции `schema` инпута.

::: code-group

```ruby [Без message]
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

```ruby [С message]
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

Проверяет `message` из последнего чейна.
Работает только с чейнами `consists_of`, `inclusion` и `schema`.

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

Проверяет наличие ожидаемого ключа в `must` инпута.
Можно указать несколько значений.

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

### Матчер `have_internal` <Badge type="info" text="have_service_internal" />

#### `type`

Проверяет тип внутреннего атрибута. Предназначен для одного значения.

```ruby
it do
  expect { perform }.to(
    have_internal(:id)
      .type(Integer)
  )
end
```

#### `types`

Проверяет типы внутреннего атрибута. Предназначен для нескольких значений.

```ruby
it do
  expect { perform }.to(
    have_internal(:id)
      .types(Integer, String)
  )
end
```

#### `consists_of`

Проверяет вложенные типы коллекции внутреннего атрибута.
Можно указать несколько значений.

::: code-group

```ruby [Без message]
it do
  expect { perform }.to(
    have_internal(:ids)
      .type(Array)
      .consists_of(String)
  )
end
```

```ruby [С message]
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

Проверяет значения опции `inclusion` внутреннего атрибута.

::: code-group

```ruby [Без message]
it do
  expect { perform }.to(
    have_internal(:event_name)
      .type(String)
      .inclusion(%w[created rejected approved])
  )
end
```

```ruby [С message]
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

Проверяет значения опции `target` внутреннего атрибута.

::: code-group

```ruby [Без message]
it do
  expect { perform }.to(
    have_internal(:service_class)
      .type(Class)
      .target([MyFirstService, MySecondService])
  )
end
```

```ruby [С message]
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

Проверяет значения опции `schema` внутреннего атрибута.

::: code-group

```ruby [Без message]
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

```ruby [С message]
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

Проверяет `message` из последнего чейна.
Работает только с чейнами `consists_of`, `inclusion` и `schema`.

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

Проверяет наличие ожидаемого ключа в `must` внутреннего атрибута.
Можно указать несколько значений.

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

### Матчер `have_output` <Badge type="info" text="have_service_output" />

#### `instance_of`

Проверяет тип выходящего атрибута.

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

В релизе `2.9.0` чейн `with` был переименован в `contains`.

:::

Проверяет значение выходящего атрибута.

```ruby
it do
  expect(perform).to(
    have_output(:full_name)
      .contains("John Fitzgerald Kennedy")
  )
end
```

#### `nested`

Указывает на вложенное значение выходящего атрибута.

```ruby
it do
  expect(perform).to(
    have_output(:event)
      .nested(:id)
      .contains("14fe213e-1b0a-4a68-bca9-ce082db0f2c6")
  )
end
```

### Матчер `be_success_service`

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

### Матчер `be_failure_service`

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
