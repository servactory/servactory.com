---
title: Неудача и обработка ошибок
description: Описание и примеры использования неудач и падений сервиса
prev: Раннее успешное завершение
next: Конфигурация
---

# Неудача и обработка ошибок

## Описание методов и исключений

Завершите работу сервиса преждевременно вызовом одного из этих методов:

- `fail_input!`;
- `fail_internal!`;
- `fail_output!`;
- `fail!`;
- `fail_result!`.

Эти методы вызывают исключение.

Из списка выше только следующие методы можно будет обработать после вызова через `call`:

- `fail!`;
- `fail_result!`.

Остальные методы всегда вызывают исключение.

Автоматические проверки input, internal и output атрибутов также присутствуют.
Валидационные проблемы с этими атрибутами вызывают соответствующее исключение.
Это поведение идентично вызову этих методов:

- `fail_input!`;
- `fail_internal!`;
- `fail_output!`.

Логика сервиса может вызывать свои исключения (например, `ActiveRecord::RecordInvalid`).
Обрабатывайте такие случаи методом `fail_on!` на уровне класса.

## Методы

### Метод `fail_input!`

Вызывает исключение от лица input атрибута.

Метод `fail_input!` принимает текст ошибки, дополнительную информацию через `meta`
и требует имя input атрибута.

Любой вызов сервиса вызывает исключение `ApplicationService::Exceptions::Input`.

```ruby{6}
make :check!

def check!
  return if inputs.invoice_number.start_with?("AA")

  fail_input!(
    :invoice_number,
    message: "Invalid invoice number",
    meta: {
      received_invoice_number: inputs.invoice_number
    }
  )
end
```

Пример информации, которую может предоставить исключение `ApplicationService::Exceptions::Input`:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Input)
exception.message           # => Invalid invoice number
exception.input_name        # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### Метод `fail_internal!`

Вызывает исключение от лица internal атрибута.

Метод `fail_internal!` принимает текст ошибки, дополнительную информацию через `meta`
и требует имя internal атрибута.

Любой вызов сервиса вызывает исключение `ApplicationService::Exceptions::Internal`.

```ruby{6}
make :check!

def check!
  return if internals.invoice_number.start_with?("AA")

  fail_internal!(
    :invoice_number,
    message: "Invalid invoice number",
    meta: {
      received_invoice_number: internals.invoice_number
    }
  )
end
```

Пример информации, которую может предоставить исключение `ApplicationService::Exceptions::Internal`:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Internal)
exception.message           # => Invalid invoice number
exception.internal_name     # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### Метод `fail_output!`

Вызывает исключение от лица output атрибута.

Метод `fail_output!` принимает текст ошибки, дополнительную информацию через `meta`
и требует имя output атрибута.

Любой вызов сервиса вызывает исключение `ApplicationService::Exceptions::Output`.

```ruby{6}
make :check!

def check!
  return if outputs.invoice_number.start_with?("AA")

  fail_output!(
    :invoice_number,
    message: "Invalid invoice number",
    meta: {
      received_invoice_number: outputs.invoice_number
    }
  )
end
```

Пример информации, которую может предоставить исключение `ApplicationService::Exceptions::Output`:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Output)
exception.message           # => Invalid invoice number
exception.output_name       # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### Метод `fail!`

Описывает пользовательские ошибки.

Метод `fail!` принимает текст ошибки, дополнительную информацию через `meta` и опциональный `type`.

По умолчанию `type` равен `base`. Передавайте любое значение для пользовательской обработки.

Вызов через `.call!` вызывает исключение `Servactory::Exceptions::Failure`.
Вызов через `.call` фиксирует ошибку и делает её доступной в `Result`.

#### Примеры

Минимальный пример с типом по умолчанию:

```ruby{6}
make :check!

def check!
  return if inputs.invoice_number.start_with?("AA")

  fail!(message: "Invalid invoice number")
end
```

Расширенный пример с типом по умолчанию и метаданными:

```ruby{2,4-6}
fail!(
  :base,
  message: "Invalid invoice number",
  meta: {
    invoice_number: inputs.invoice_number
  }
)
```

Пример с пользовательским типом `validation` и метаданными:

```ruby{7,9-12}
make :check!

def check!
  return if inputs.email.include?("@")

  fail!(
    :validation,
    message: "Email must contain @ symbol",
    meta: {
      field: :email,
      provided_value: inputs.email
    }
  )
end
```

Пример информации, которая будет предоставлена:

```ruby
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Failure)
exception.message           # => Invalid invoice number
exception.type              # => :base
exception.meta              # => {:invoice_number=>"BB-7650AE"}
```

Для примера с типом `validation`:

```ruby
exception.detailed_message  # => Email must contain @ symbol (ApplicationService::Exceptions::Failure)
exception.message           # => Email must contain @ symbol
exception.type              # => :validation
exception.meta              # => {:field=>:email, :provided_value=>"user.example.com"}
```

### Метод `fail_result!` <Badge type="tip" text="Начиная с 2.1.0" />

Требует `Result` и внутри себя вызывает метод `fail!`.

Предназначен для сокращенного написания кода для передачи ошибки из одного сервиса в текущий.
Например, из API сервиса в сервис приложения.

```ruby
fail_result!(service_result)
```

Код выше эквивалентен этому:

```ruby
fail!(
  service_result.error.type,
  message: service_result.error.message,
  meta: service_result.error.meta
)
```

### Метод `fail_on!` <Badge type="tip" text="Начиная с 2.5.0" />

Перехватывает указанные исключения.

Метод `fail_on!` принимает класс(ы) исключения и опционально кастомизирует текст сообщения.

Вместо указанных исключений вызывается `fail!`.
Информация об оригинальном исключении передаётся в `fail!` через `meta`.

#### Использование

```ruby
module ApplicationService
  class Base < Servactory::Base
    fail_on! ActiveRecord::RecordNotFound,
             ActiveRecord::RecordInvalid
    
    # ...
  end
end
```

Кастомизируйте текст сообщения следующим образом:

```ruby
fail_on! ActiveRecord::RecordNotFound,
         with: ->(exception:) { exception.message }
```

Альтернативный вариант:

```ruby
fail_on!(ActiveRecord::RecordNotFound) { |exception:| exception.message }
```
