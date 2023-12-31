---
title: Why Servactory
prev: false
next: Getting started
---

# Why Servactory

## About Servactory

Servactory is a standardization of a unified approach to the development of reliable services of any complexity.

With Servactory you can do something simple, just like that:

```ruby
class MinimalService < ApplicationService::Base
  def call
    # ...
  end
end
```

And then call with:

```ruby
MinimalService.call! # or MinimalService.call
```

Or create something more complex:

```ruby
class NotificationsService::Send < ApplicationService::Base
  input :comment, type: Comment
  input :provider, type: NotificationProvider

  internal :user, type: User
  internal :status, type: String
  internal :response, type: NotificatorApi::Models::Notification

  output :notification, type: Notification

  make :assign_user
  make :assign_status

  make :create_notification!
  make :send_notification
  make :update_notification!
  make :update_comment!
  make :assign_status

  private

  def assign_user
    internals.user = inputs.comment.user
  end

  def assign_status
    internals.status = StatusEnum::NOTIFIED
  end

  def create_notification!
    outputs.notification = Notification.create!(user:, comment: inputs.comment, provider: inputs.provider)
  end

  def send_notification
    service_result = NotificatorService::API::Send.call(notification: outputs.notification)

    return fail!(message: service_result.error.message) if service_result.failure?

    internals.response = service_result.response
  end

  def update_notification!
    outputs.notification.update!(original_data: internals.response)
  end

  def update_comment!
    inputs.comment.update!(status: internals.status)
  end
end
```

With a call like this:

```ruby
# comment = Comment.first
# provider = NotificationProvider.first

NotificationsService::Send.call!(comment:, provider:)
# Or
# NotificationsService::Send.call(comment:, provider:)
```

## Reasons to use Servactory

### Unified approach

The Ruby language is flexible and versatile.
This fact indicates that the services in the applications begin to vary greatly, implementing a different development approach.
Over time, this case complicates the development in the project and can make it difficult to understand the services.

Servactory standardizes the approach to development by offering the implementation of services only through the proposed API, describing the logic within classes uniformly.

### Testing

Services written under Servactory are tested like standard Ruby classes.
As a result of the unified approach to the development of services, their testing also becomes uniform.
