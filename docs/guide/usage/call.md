---
title: Service call
description: Description and examples of calling the service
prev: Getting started
next: Service result
---

# Service call

The service can only be called through the `.call` and `.call!` methods.

## Method `.call!`

Calling a service via the `.call!` method will throw an exception if any problem occurs within the service.

::: code-group

```ruby [Call]
UsersService::Accept.call!(user: User.first)
```

```ruby [Success]
# => #<ApplicationService::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

```ruby [Failure]
# => ApplicationService::Exceptions::Input: [UsersService::Accept] Required input `user` is missing

# => ApplicationService::Exceptions::Failure: There is some problem with the user
```

:::

## Method `.call`

Calling a service via the `.call` method will throw an exception only if there are problems with input attributes.
All other errors will be logged and provided via the `Result` class.

::: code-group

```ruby [Call]
UsersService::Accept.call(user: User.first)
```

```ruby [Success]
# => #<ApplicationService::Result @failure?=false, @success?=true, @user=..., @user?=true>
```

```ruby [Failure]
# => ApplicationService::Exceptions::Input: [UsersService::Accept] Required input `user` is missing

# => #<ApplicationService::Result @error=There is some problem with the user, @failure?=true, @success?=false>
```

:::
