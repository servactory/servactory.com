---
title: Failure and Error Handling
description: Description and examples of using service failures and errors
prev: Early Successful Completion
next: Configuration
---

# Failure and Error Handling

## Description of Methods and Exceptions

The service execution can be terminated prematurely by calling one of these methods:

- `fail_input!`;
- `fail_internal!`;
- `fail_output!`;
- `fail!`;
- `fail_result!`.

These methods will in turn raise an exception.

From the list above, only the following methods can be handled after calling via `call`:

- `fail!`;
- `fail_result!`.

The other methods will always raise an exception.

In addition, there are automatic checks for input, internal, and output attributes.
In case of validation issues with these attributes, the corresponding exception will also be raised.
This behavior will be identical to what happens when calling these methods:

- `fail_input!`;
- `fail_internal!`;
- `fail_output!`.

The service may contain logic that will raise its own exceptions.
For example, it could be `ActiveRecord::RecordInvalid`.
For such cases, the `fail_on!` method was developed at the class level.

## Methods

### Method `fail_input!`

Designed to raise an exception on behalf of an input attribute.

The `fail_input!` method allows you to pass an error message,
additional information through the `meta` attribute,
and requires specifying the name of the input attribute.

When calling the service, an exception with the class `ApplicationService::Exceptions::Input` will be raised.

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

Example of information that can be provided by the `ApplicationService::Exceptions::Input` exception:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Input)
exception.message           # => Invalid invoice number
exception.input_name        # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### Method `fail_internal!`

Designed to raise an exception on behalf of an internal attribute.

The `fail_internal!` method allows you to pass an error message,
additional information through the `meta` attribute,
and requires specifying the name of the internal attribute.

When calling the service, an exception with the class `ApplicationService::Exceptions::Internal` will be raised.

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

Example of information that can be provided by the `ApplicationService::Exceptions::Internal` exception:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Internal)
exception.message           # => Invalid invoice number
exception.internal_name     # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### Method `fail_output!`

Designed to raise an exception on behalf of an output attribute.

The `fail_output!` method allows you to pass an error message,
additional information through the `meta` attribute,
and requires specifying the name of the output attribute.

When calling the service, an exception with the class `ApplicationService::Exceptions::Output` will be raised.

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

Example of information that can be provided by the `ApplicationService::Exceptions::Output` exception:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Output)
exception.message           # => Invalid invoice number
exception.output_name       # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### Method `fail!`

Designed to describe custom errors.

The `fail!` method allows you to pass an error message,
additional information through the `meta` attribute,
and allows you to specify `type`.

By default, `type` has the value `base`, but you can pass any value for further processing.

When calling the service via the `call!` method, an exception with the class `Servactory::Exceptions::Failure` will be raised.
When calling the method via the `call` method, the error will be recorded and available in `Result`.

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

Designed for concise code writing to pass an error from one service to the current one.
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

Designed to catch specified exceptions.

The `fail_on!` method allows you to pass an exception class or classes,
and also allows you to customize the message text.

Instead of the specified exceptions, the `fail!` method will be used.
Information about the original exception will be passed to the `fail!` method through `meta`.

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

If you need to customize the message text, you can do it like this:

```ruby
fail_on! ActiveRecord::RecordNotFound,
         with: ->(exception:) { exception.message }
```

Alternative option:

```ruby
fail_on!(ActiveRecord::RecordNotFound) { |exception:| exception.message }
```
