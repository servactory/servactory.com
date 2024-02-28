---
title: Service result
description: Description and examples of using the service result
prev: Service call
next: Service information
---

# Service result

After the call, the service has the result of its work, if an exception was not thrown before.
The result of the work can be successful or failure.

## Successful result

A successful result is the result of the service when everything inside went without any problems.

In that case, this example:

```ruby
service_result = UsersService::Accept.call(user: User.first)
```

Will return this:

```ruby
# => <Servactory::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

## Failed result

A failed result is the result of a service running when an expected problem occurred internally.
An expected problem means that an exception was not thrown, and the problem that arose, for example, was caused through one of the `fail!` methods.

A failed service result can only be present when called via the `.call` method.
This is necessary, for example, to be able to process the result of a response from an external API.

An example of the result when a problem occurs:

```ruby
# => <Servactory::Result @error=There is some problem with the user, @failure?=true, @success?=false>
```

## Result content

`Result` regardless of success or failure has a data set.

Upon successful operation, all output attributes are available,
and the `success?` and `failure?` helper methods are also available,
which can help determine the scenario for further work.

```ruby
service_result = UsersService::Accept.call(user: User.first)

service_result.success? # => true
service_result.failure? # => false
```

If the service fails, `Result` will also contain `error` with a full description of the error.

```ruby
service_result = UsersService::Accept.call(user: User.first)

service_result.success? # => false
service_result.failure? # => true

service_result.error
# => #<ApplicationService::Errors::Failure: There is some problem with the user>
```

You can learn more about the unsuccessful operation of the service [here](../exceptions/failure).

## Result processing

After calling a service via `call`, you can process its result.

There are two options for this - using the `success?` and `failure?` methods or using the `on_success` and `on_failure` hooks.

### Methods

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return if service_result.success? # or `unless service_result.failure?`

fail!(
  message: "The message was not sent to Slack", 
  meta: { reason: service_result.error.message }
)
```

You can pass a type to the `failure?` method. You can find out more about the types [here](../exceptions/failure#method-fail).
This gives you the opportunity to specify the type you are interested in when handling a failed result.
By default, `type` is `all`, which means any type fails, including your own types.

```ruby
service_result = NotificatorService::Slack::Error::Send.call(...)

return unless service_result.failure?(:all)

fail!(
  message: "The message was not sent to Slack", 
  meta: { reason: service_result.error.message }
)
```

### Hooks

This is an alternative way to process the result.

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

The `on_success` method has an `outputs` argument that provides access to all output attributes.

You can also pass a type to the `on_failure` method.

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
