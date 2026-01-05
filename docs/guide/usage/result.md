---
title: Service result
description: Description and examples of using the service result
prev: Service call
next: Service information
---

# Service result

Each service call returns a result (unless an exception is thrown). The result is either successful or failed.

## Successful result

A successful result indicates all operations completed without problems.

Example:

```ruby
service_result = UsersService::Accept.call(user: User.first)
```

Returns:

```ruby
# => <ApplicationService::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

## Failed result

A failed result indicates an expected problem occurred internally. Expected problems don't throw exceptions—they're triggered via `fail!` methods.

Failed results only occur when using the `.call` method. This enables processing responses from external APIs.

Example result on failure:

```ruby
# => <ApplicationService::Result @error=There is some problem with the user, @failure?=true, @success?=false>
```

## Result content

`Result` contains data regardless of outcome.

On success, all output attributes are available. The `success?` and `failure?` helper methods determine the outcome.

```ruby
service_result = UsersService::Accept.call(user: User.first)

service_result.success? # => true
service_result.failure? # => false
```

On failure, `Result` also contains `error` with the full error description.

```ruby
service_result = UsersService::Accept.call(user: User.first)

service_result.success? # => false
service_result.failure? # => true

service_result.error
# => #<ApplicationService::Exceptions::Failure: There is some problem with the user>
```

Learn more about service failures [here](../exceptions/failure).

## Result processing

Process the result after calling via `call`.

Two options: `success?`/`failure?` methods or `on_success`/`on_failure` hooks.

### Methods

#### Method `success?`

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return if service_result.success?

fail!(
  message: "The message was not sent to Slack",
  meta: { reason: service_result.error.message }
)
```

#### Method `failure?`

Pass a type to `failure?` to check specific failure types. See [failure types](../exceptions/failure#method-fail). Default type is `all` (matches any failure type).

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return unless service_result.failure?

fail!(
  message: "The message was not sent to Slack", 
  meta: { reason: service_result.error.message }
)
```

Check for a specific failure type:

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return unless service_result.failure?(:validation)

fail!(
    message: "The message was not sent to Slack",
    meta: { reason: service_result.error.message }
)
```

Predicate methods provide convenient type checking:

::: warning

`Result` output attributes also have predicate methods. Avoid naming conflicts.

:::

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return unless service_result.all?

fail!(
  message: "The message was not sent to Slack",
  meta: { reason: service_result.error.message }
)
```

### Hooks

Alternative approach to result processing:

```ruby
NotificatorService::Slack::Error::Send
  .call(...)
  .on_failure do |exception:| 
    fail!(
      message: "The message was not sent to Slack", 
      meta: { reason: exception.message }
    )
  end
```

The `on_success` method provides `outputs` argument with all output attributes. Pass a type to `on_failure`:

```ruby
NotificatorService::Slack::Error::Send
  .call(...)
  .on_success do |outputs:|
    notification.update!(original_data: outputs.response)
  end.on_failure(:all) do |exception:| 
    fail!(
      message: "The message was not sent to Slack", 
      meta: { reason: exception.message }
    )
  end
```
