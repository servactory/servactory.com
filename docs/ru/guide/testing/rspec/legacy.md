---
title: RSpec (Legacy) — Тестирование сервисов
description: Описание и примеры тестирования сервисов с применением RSpec
outline:
  level: deep
prev: RSpec
next: Расширения
---

# RSpec (Legacy) <Badge type="tip" text="Начиная с 2.5.0" />

:::warning

Этот функционал является устаревшим (deprecated) и будет поддерживаться только для обратной совместимости.
Для новых тестов рекомендуется использовать [новый API тестирования](./fluent).

:::

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

## Пример

### Структура

- `.call!` или `call`:
  - `subject`;
  - `validations`:
    - `inputs`;
    - `internals`;
    - `outputs`;
  - `when required data for work is valid`:
    - `be_success_service`;
    - `have_output`.
  - `when required data for work is invalid`:
    - `be_failure_service`.

### Файл

::: code-group

```ruby [RSpec]
RSpec.describe UsersService::Create, type: :service do
  describe ".call!" do
    subject(:perform) { described_class.call!(**attributes) }

    let(:attributes) do
      {
        first_name:,
        middle_name:,
        last_name:
      }
    end

    let(:first_name) { "John" }
    let(:middle_name) { "Fitzgerald" }
    let(:last_name) { "Kennedy" }

    describe "validations" do
      describe "inputs" do
        it do
          expect { perform }.to(
            have_input(:first_name)
              .valid_with(attributes)
              .type(String)
              .required
          )
        end

        it do
          expect { perform }.to(
            have_input(:middle_name)
              .valid_with(attributes)
              .type(String)
              .optional
          )
        end

        it do
          expect { perform }.to(
            have_input(:last_name)
              .valid_with(attributes)
              .type(String)
              .required
          )
        end
      end

      describe "outputs" do
        it do
          expect(perform).to(
            have_output(:full_name)
              .instance_of(String)
          )
        end
      end
    end

    context "when required data for work is valid" do
      it { expect(perform).to be_success_service }

      it do
        expect(perform).to(
          have_output(:full_name)
            .contains("John Fitzgerald Kennedy")
        )
      end

      describe "even if `middle_name` is not specified" do
        let(:middle_name) { nil }

        it do
          expect(perform).to(
            have_output(:full_name)
              .contains("John Kennedy")
          )
        end
      end
    end
  end
end
```

```ruby [Сервис]
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String, required: false
  input :last_name, type: String

  output :full_name, type: String

  make :assign_full_name

  private

  def assign_full_name
    outputs.full_name = [
      inputs.first_name,
      inputs.middle_name,
      inputs.last_name
    ].compact.join(" ")
  end
end
```

:::

## Хелперы

### Хелпер `allow_service_as_success!`

Выполняет мок вызова `.call!` с успешным результатом.

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

### Хелпер `allow_service_as_success`

Выполняет мок вызова `.call` с успешным результатом.

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

### Хелпер `allow_service_as_failure!`

Выполняет мок вызова `.call!` с неудачным результатом.

```ruby
before do
  allow_service_as_failure!(UsersService::Accept) do
    ApplicationService::Exceptions::Failure.new(
      message: "Some error"
    )
  end
end
```

### Хелпер `allow_service_as_failure`

Выполняет мок вызова `.call` с неудачным результатом.

```ruby
before do
  allow_service_as_failure(UsersService::Accept) do
    ApplicationService::Exceptions::Failure.new(
      message: "Some error"
    )
  end
end
```

### Опции

#### Опция `with`

Методы `allow_service_as_success!`, `allow_service_as_success`,
`allow_service_as_failure!` и `allow_service_as_failure` поддерживают опцию `with`.

По умолчанию эта опция не требует передачи аргументов сервиса и автоматически
определяет данные на основе метода `info`.

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
    have_input(:ids)
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

#### `valid_with`

Проверяет реальное поведение инпута на основе переданных данных.

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
    have_internal(:ids)
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
      .message("Input `ids` must be a collection of `String`") # [!code focus]
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
      .message("Input `ids` must be a collection of `String`") # [!code focus]
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
