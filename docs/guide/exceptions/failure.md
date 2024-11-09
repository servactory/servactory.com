---
title: Service failures and error handling
description: Description and examples of use of service failures
prev: Early successful termination
next: Configuration
---

# Failure and error handling

## Description of methods and exceptions

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

There may be logic inside the service that will throw its own exceptions.
For example, this could be `ActiveRecord::RecordInvalid`.
For such cases, the `fail_on!` method was developed at the class level.

## Methods

### Method `fail_input!`

Designed to throw an exception on behalf of the input attribute.

The `fail_input!` method allows you to pass the error text,
additional information through the `meta` attribute,
and also requires you to specify the name of the input attribute.

Any call to the service will throw an exception with the class `ApplicationService::Exceptions::Input`.

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

Example of information that the exception `ApplicationService::Exceptions::Input` might provide:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Input)
exception.message           # => Invalid invoice number
exception.input_name        # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### Method `fail_internal!`

Designed to throw an exception on behalf of the internal attribute.

The `fail_internal!` method allows you to pass the error text,
additional information through the `meta` attribute,
and also requires you to specify the name of the internal attribute.

Any call to the service will throw an exception with the class `ApplicationService::Exceptions::Internal`.

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

Example of information that the exception `ApplicationService::Exceptions::Internal` might provide:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Internal)
exception.message           # => Invalid invoice number
exception.internal_name     # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### Method `fail_output!`

Designed to throw an exception on behalf of the output attribute.

The `fail_output!` method allows you to pass the error text,
additional information through the `meta` attribute,
and also requires you to specify the name of the output attribute.

Any call to the service will throw an exception with the class `ApplicationService::Exceptions::Output`.

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

Example of information that the exception `ApplicationService::Exceptions::Output` might provide:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Output)
exception.message           # => Invalid invoice number
exception.output_name       # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### Method `fail!`

Designed to describe user errors.

The `fail!` method allows you to pass the error text,
additional information through the `meta` attribute,
and also allows you to specify `type`.

By default, `type` is `base`, but you can pass any value for further processing.

When calling a service through the `call!` method, an exception with the class `Servactory::Exceptions::Failure` will be thrown.
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
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Failure)
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

### Method `fail_on!` <Badge type="tip" text="Since 2.5.0" />

Intended to catch specified exceptions.

The `fail_on!` method allows you to pass the class of the exception or exceptions,
and also allows you to customize the text of the message.

Instead of the specified exceptions, the `fail!` method call will be used.
Information about the original exception will be passed to the `fail!` method via `meta`.

#### Usage

```ruby
module ApplicationService
  class Base < Servactory::Base
    fail_on! ActiveRecord::RecordNotFound,
             ActiveRecord::RecordInvalid
    
    # ...
  end
end
```

If you need to customize the text of the message, you can do it as follows:

```ruby
fail_on! ActiveRecord::RecordNotFound,
         with: ->(exception:) { exception.message }
```

Alternative option:

```ruby
fail_on!(ActiveRecord::RecordNotFound) { |exception:| exception.message }
```
