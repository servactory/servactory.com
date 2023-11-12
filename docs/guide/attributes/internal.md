---
title: Service internal attributes
description: Description and examples of using internal attributes of service
prev: Service input attributes
next: Service output attributes
---

# Internal attributes

Internal private attributes can be added via the `internal` method.

## Usage

The assignment and use of internal service attributes is done through the `internals=`/`internals` methods.

```ruby
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  internal :full_name, type: String

  # ...

  def assign_full_name
    internals.full_name = [
      inputs.first_name,
      inputs.middle_name,
      inputs.last_name
    ].join(" ")
  end

  def create!
    outputs.user = User.create!(full_name: internals.full_name)
  end
end
```

## Options

### Option `type`

This option is validation.
It will check that the passed value corresponds to the specified type (class).
In this case `is_a?` method is used.

```ruby{4,14}
class NotificationsService::Create < ApplicationService::Base
  input :user, type: User

  internal :inviter, type: User

  output :notification, type: Notification

  make :assign_inviter
  make :create_notification!

  private

  def assign_inviter
    internals.inviter = inputs.user.inviter
  end

  def create_notification!
    outputs.notification = Notification.create!(user: inputs.user, inviter: internals.inviter)
  end
end
```

## Predicate methods

Any internal attribute can be accessed as a predicate method.


```ruby{8}
# ...

internal :full_name, type: String

# ...

def something
  return unless internals.full_name? # instead of `internals.full_name.present?`

  # ...
end
```
