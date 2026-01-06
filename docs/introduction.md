---
title: Why Servactory
description: Introduction to Servactory - unified approach to building reliable Ruby/Rails services
prev: false
next: Getting started
---

# Why Servactory

## About Servactory

Servactory standardizes building reliable services of any complexity.

Create simple services:

```ruby
class MinimalService < ApplicationService::Base
  def call
    # ...
  end
end
```

Then call:

```ruby
MinimalService.call! # or MinimalService.call
```

Or build complex services:

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

Call like this:

```ruby
# comment = Comment.first
# provider = NotificationProvider.first

NotificationsService::Send.call!(comment:, provider:)
# Or
# NotificationsService::Send.call(comment:, provider:)
```

## Reasons to use Servactory

### Unified approach

Ruby's flexibility leads to inconsistent service implementations across applications. Over time, this inconsistency complicates development and makes services harder to understand.

Servactory enforces a consistent API for service implementation, ensuring uniform logic structure across all classes.

### Testing

Test Servactory services like standard Ruby classes. The unified approach ensures consistent testing patterns.
