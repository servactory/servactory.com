---
title: Service failures and error handling
description: Description and examples of use of service failures
prev: Early successful termination
next: Configuration
---

# Failure and error handling

## Описание методов и исключений

The service can be terminated prematurely by calling one of these methods:

- `fail_input!`;
- `fail_internal!`;
- `fail_output!`;
- `fail!`;
- `fail_result!`.

These methods will in turn throw an exception.

From the list above, only the following methods can be processed after being called via `call`:

- `fail!`;
- `fail_result!`.

The remaining methods will always throw an exception.

In addition, there are automatic checks for input, internal and output attributes.
In case of, for example, validation problems with these attributes, the corresponding exception will also be raised.
This behavior will be identical to what happens when these methods are called:

- `fail_input!`;
- `fail_internal!`;
- `fail_output!`.

## Methods

### Method `fail_input!`

Designed to throw an exception on behalf of the input attribute.

The `fail_input!` method allows you to pass the error text and also requires you to specify the name of the input attribute.

Any call to the service will throw an exception with the class `Servactory::Errors::InputError`.

```ruby{6}
make :check!

def check!
  return if inputs.invoice_number.start_with?("AA")

  fail_input!(:invoice_number, message: "Invalid invoice number")
end
```

### Method `fail_internal!`

Designed to throw an exception on behalf of the internal attribute.

The `fail_internal!` method allows you to pass the error text and also requires you to specify the name of the internal attribute.

Any call to the service will throw an exception with the class `Servactory::Errors::InternalError`.

```ruby{6}
make :check!

def check!
  return if internals.invoice_number.start_with?("AA")

  fail_internal!(:invoice_number, message: "Invalid invoice number")
end
```

### Method `fail_output!`

Designed to throw an exception on behalf of the output attribute.

The `fail_output!` method allows you to pass the error text and also requires you to specify the name of the output attribute.

Any call to the service will throw an exception with the class `Servactory::Errors::OutputError`.

```ruby{6}
make :check!

def check!
  return if outputs.invoice_number.start_with?("AA")

  fail_output!(:invoice_number, message: "Invalid invoice number")
end
```

### Method `fail!`

Designed to describe user errors.

The `fail!` method allows you to pass the error text, additional information through the `meta` attribute, and also allows you to specify `type`.

By default, `type` is `base`, but you can pass any value for further processing.

When calling a service through the `call!` method, an exception with the class `Servactory::Errors::Failure` will be thrown.
When calling a method via the `call` method, the error will be logged and available in the `Result`.

```ruby{6}
make :check!

def check!
  return if inputs.invoice_number.start_with?("AA")

  fail!(message: "Invalid invoice number")
end
```

```ruby{2,4-6}
fail!(
  :base,
  message: "Invalid invoice number",
  meta: {
    invoice_number: inputs.invoice_number
  }
)
```

Example of information that will be provided:

```ruby
exception.detailed_message  # => Invalid invoice number (ApplicationService::Errors::Failure)
exception.message           # => Invalid invoice number
exception.type              # => :base
exception.meta              # => {:invoice_number=>"BB-7650AE"}
```

### Method `fail_result!` <Badge type="tip" text="Since 2.1.0" />

Requires `Result` and internally calls the `fail!` method.

Designed for shorthand writing of code for passing an error from one service to the current one.
For example, from an API service to an application service.

```ruby
fail_result!(service_result)
```

The code above is equivalent to this:

```ruby
fail!(
  service_result.error.type,
  message: service_result.error.message,
  meta: service_result.error.meta
)
```
