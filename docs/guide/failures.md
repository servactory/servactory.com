---
title: Service failures and error handling
description: Description and examples of use of service failures
prev: Configuration
next: Extensions
---

# Failures

In a simple use case, all service failures will come from input, output or internal attributes.
That would be considered as unexpected behavior in service operation.

In order to describe expected service crashes, the following methods were prepared.

## Fail

Base method that allows to pass text as message and additional information via `meta` attribute.

When the service is called via the `.call!` method, there will be called an exception with the class `Servactory::Errors::Failure`.

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

## Fail for input

This method differs from `.fail!` by obligatory indication of input-argument name.

If service is called through `.call!` method, it will cause exception with class `Servactory::Errors::InputError`.

```ruby{6}
make :check!

def check!
  return if inputs.invoice_number.start_with?("AA")

  fail_input!(:invoice_number, message: "Invalid invoice number")
end
```
