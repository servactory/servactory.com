---
title: Неудачи и обработка ошибок
description: Описание и примеры использования неудач и падений сервиса
prev: Конфигурация
next: Расширения
---

# Неудачи и обработка ошибок

При простом сценарии использования все неудачи (или исключения) сервиса будут возникать из input, internal или output.
Это все будет считаться неожиданным поведением в работе сервиса.

Но помимо этого можно также описать ожидаемые ошибки в работе сервиса.
Для этого предусмотрены методы, представленные ниже.

## Метод `fail!`

Базовый метод `fail!` позволяет передать текст ошибки, а также дополнительную информацию через атрибут `meta`.

При вызове сервиса через метод `.call!` будет происходить исключение с классом `Servactory::Errors::Failure`.

```ruby{6}
make :check!

def check!
  return if inputs.invoice_number.start_with?("AA")

  fail!(message: "Invalid invoice number")
end
```

```ruby{3-5}
fail!(
  message: "Invalid invoice number",
  meta: {
    invoice_number: inputs.invoice_number
  }
)
```

```ruby
exception.detailed_message  # => Invalid invoice number (ApplicationService::Errors::Failure)
exception.message           # => Invalid invoice number
exception.type              # => :fail
exception.meta              # => {:invoice_number=>"BB-7650AE"}
```

## Метод `fail_input!`

Отличается от `fail!` обязательным указыванием имени атрибута input, от лица которого будет создана ошибка.

При вызове сервиса через метод `.call!` будет вызываться исключение с классом `Servactory::Errors::InputError`.

```ruby{6}
make :check!

def check!
  return if inputs.invoice_number.start_with?("AA")

  fail_input!(:invoice_number, message: "Invalid invoice number")
end
```

## Метод `fail_internal!`

Отличается от `fail!` обязательным указыванием имени атрибута internal, от лица которого будет создана ошибка.

При вызове сервиса через метод `.call!` будет вызываться исключение с классом `Servactory::Errors::InternalError`.

```ruby{6}
make :check!

def check!
  return if internals.invoice_number.start_with?("AA")

  fail_internal!(:invoice_number, message: "Invalid invoice number")
end
```

## Метод `fail_output!`

Отличается от `fail!` обязательным указыванием имени атрибута output, от лица которого будет создана ошибка.

При вызове сервиса через метод `.call!` будет вызываться исключение с классом `Servactory::Errors::OutputError`.

```ruby{6}
make :check!

def check!
  return if outputs.invoice_number.start_with?("AA")

  fail_output!(:invoice_number, message: "Invalid invoice number")
end
```
