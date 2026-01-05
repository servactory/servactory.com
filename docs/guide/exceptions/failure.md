---
title: Service failures and error handling
description: Description and examples of use of service failures
prev: Early successful termination
next: Configuration
---

# Failure and error handling

## Description of methods and exceptions

Terminate the service prematurely by calling one of these methods:

- `fail_input!`;
- `fail_internal!`;
- `fail_output!`;
- `fail!`;
- `fail_result!`.

These methods throw an exception.

From the list above, only the following methods can be processed after being called via `call`:

- `fail!`;
- `fail_result!`.

The remaining methods always throw an exception.

Automatic checks for input, internal, and output attributes also exist.
Validation problems with these attributes raise the corresponding exception.
This behavior is identical to calling these methods:

- `fail_input!`;
- `fail_internal!`;
- `fail_output!`.

Service logic may throw its own exceptions (e.g., `ActiveRecord::RecordInvalid`).
Handle such cases with the class-level `fail_on!` method.

## Methods

### Method `fail_input!`

Throws an exception on behalf of the input attribute.

The `fail_input!` method accepts error text, additional information via `meta`,
and requires the input attribute name.

Any service call throws an `ApplicationService::Exceptions::Input` exception.

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

Throws an exception on behalf of the internal attribute.

The `fail_internal!` method accepts error text, additional information via `meta`,
and requires the internal attribute name.

Any service call throws an `ApplicationService::Exceptions::Internal` exception.

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

Throws an exception on behalf of the output attribute.

The `fail_output!` method accepts error text, additional information via `meta`,
and requires the output attribute name.

Any service call throws an `ApplicationService::Exceptions::Output` exception.

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

Describes custom errors.

The `fail!` method accepts error text, additional information via `meta`, and optional `type`.

By default, `type` is `base`. Pass any value for custom processing.

Calling via `.call!` throws a `Servactory::Exceptions::Failure` exception.
Calling via `.call` logs the error and makes it available in `Result`.

#### Examples

Minimal example with default type:

```ruby{6}
make :check!

def check!
  return if inputs.invoice_number.start_with?("AA")

  fail!(message: "Invalid invoice number")
end
```

Extended example with default type and metadata:

```ruby{2,4-6}
fail!(
  :base,
  message: "Invalid invoice number",
  meta: {
    invoice_number: inputs.invoice_number
  }
)
```

Example with custom `validation` type and metadata:

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

Example of information that will be provided:

```ruby
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Failure)
exception.message           # => Invalid invoice number
exception.type              # => :base
exception.meta              # => {:invoice_number=>"BB-7650AE"}
```

For the example with `validation` type:

```ruby
exception.detailed_message  # => Email must contain @ symbol (ApplicationService::Exceptions::Failure)
exception.message           # => Email must contain @ symbol
exception.type              # => :validation
exception.meta              # => {:field=>:email, :provided_value=>"user.example.com"}
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

Catches specified exceptions.

The `fail_on!` method accepts exception class(es) and optionally customizes the message text.

Instead of the specified exceptions, `fail!` is called.
Original exception information passes to `fail!` via `meta`.

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

Customize the message text as follows:

```ruby
fail_on! ActiveRecord::RecordNotFound,
         with: ->(exception:) { exception.message }
```

Alternative option:

```ruby
fail_on!(ActiveRecord::RecordNotFound) { |exception:| exception.message }
```
