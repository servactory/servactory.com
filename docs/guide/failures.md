---
title: Service failures and error handling
description: Description and examples of use of service failures
prev: Configuration
next: Extensions
---

# Failures

In a simple use case, all service failures (or exceptions) will come from input, internal, or output.
That would be considered as unexpected behavior in service operation.

But in addition to this, you can also describe expected errors in the service.
The methods presented below are provided for this.

## Method `fail!`

The basic `fail!` method allows you to pass the error text, as well as additional information through the `meta` attribute.

When calling a service through the `.call!` method, an exception with the class `Servactory::Errors::Failure` will occur.

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

## Method `fail_input!`

It differs from `fail!` by the mandatory indication of the name of the input attribute on behalf of which the error will be created.

When calling a service through the `.call!` method, an exception with the class `Servactory::Errors::InputError` will be thrown.

```ruby{6}
make :check!

def check!
  return if inputs.invoice_number.start_with?("AA")

  fail_input!(:invoice_number, message: "Invalid invoice number")
end
```

## Method `fail_internal!`

It differs from `fail!` by the mandatory indication of the name of the internal attribute on behalf of which the error will be created.

When calling a service through the `.call!` method, an exception with the class `Servactory::Errors::InternalError` will be thrown.

```ruby{6}
make :check!

def check!
  return if internals.invoice_number.start_with?("AA")

  fail_internal!(:invoice_number, message: "Invalid invoice number")
end
```

## Method `fail_output!`

It differs from `fail!` by the mandatory indication of the name of the output attribute on behalf of which the error will be created.

When calling a service through the `.call!` method, an exception with the class `Servactory::Errors::OutputError` will be thrown.

```ruby{6}
make :check!

def check!
  return if outputs.invoice_number.start_with?("AA")

  fail_output!(:invoice_number, message: "Invalid invoice number")
end
```
