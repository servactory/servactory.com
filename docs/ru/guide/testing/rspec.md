---
title: RSpec — Тестирование сервисов
description: Описание и примеры тестирования сервисов с применением RSpec
outline:
  level: deep
prev: Конфигурация
next: Расширения
---

# RSpec

## Хелперы

### Хелпер `allow_service_as_success!`

Предназначен для мока вызова через `call!` с успешным результатом.

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

Предназначен для мока вызова через `call` с успешным результатом.

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

### Хелпер `allow_service_as_failure!`

Предназначен для мока вызова через `call!` с неудачным результатом.

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

Предназначен для мока вызова через `call` с неудачным результатом.

```ruby
before do
  allow_service_as_failure!(UsersService::Accept) do
    ApplicationService::Exceptions::Failure.new(
      message: "Some error"
    )
  end
end
```

## Матчеры

### Матчер `have_service_input`

Алиас: `have_input`

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

Проверяет значения опции `inclusion` инпута.

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

Этот чейн будет пытаться проверить реальное поведение инпута на основе переданных данных.

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

### Матчер `have_service_internal`

Алиас: `have_internal`

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

Проверяет значения опции `inclusion` внутреннего атрибута.

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

### Матчер `have_service_output`

Алиас: `have_output`

#### `type`

Проверяет тип выходящего атрибута. Предназначен для одного значения.

```ruby
it do
  expect { perform }.to(
    have_output(:id)
      .type(Integer)
  )
end
```

#### `types`

Проверяет типы выходящего атрибута. Предназначен для нескольких значений.

```ruby
it do
  expect { perform }.to(
    have_output(:ids)
      .types(Integer, String)
  )
end
```

#### `consists_of`

Проверяет вложенные типы коллекции выходящего атрибута.
Можно указать несколько значений.

```ruby
it do
  expect { perform }.to(
    have_output(:ids)
      .type(Array)
      .consists_of(String) { "Input `ids` must be an array of `String`" }
  )
end
```

#### `inclusion`

Проверяет значения опции `inclusion` выходящего атрибута.

```ruby
it do
  expect { perform }.to(
    have_output(:event_name)
      .type(String)
      .inclusion(%w[created rejected approved])
  )
end
```

#### `must`

Проверяет наличие ожидаемого ключа в `must` выходящего атрибута.
Можно указать несколько значений.

```ruby
it do
  expect { perform }.to(
    have_output(:invoice_numbers)
      .type(Array)
      .consists_of(String)
      .must(:be_6_characters)
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
