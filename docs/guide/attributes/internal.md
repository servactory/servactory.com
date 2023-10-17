---
title: Service internal attributes
description: Description and examples of using internal attributes of service
prev: Service input arguments
next: Service output attributes
---

# Service internal attributes

Internal private attributes can be defined through the `internal` method.

## Usage

The assignment and use of internal service arguments is done through the `internals=`/`internals` methods or their `int=`/`int` aliases.

```ruby
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  internal :full_name, type: String

  # ...

  def something
    internals.full_name = [inputs.first_name, inputs.middle_name, inputs.last_name].compact.join(" ")
    # or
    # int.full_name = [inp.first_name, inp.middle_name, inp.last_name].compact.join(" ")
  end
end
```

## Options

### Option `type`

This option is validation.
It will check that the value set to `internal` corresponds to the specified type (class).
In this case `is_a?` method is used.

```ruby
class NotificationService::Create < ApplicationService::Base
  input :user, type: User

  # highlight-next-line
  internal :inviter, type: User

  output :notification, type: Notification

  make :assign_inviter
  make :create_notification!

  private

  def assign_inviter
    # highlight-next-line
    internals.inviter = inputs.user.inviter
  end

  def create_notification!
    outputs.notification = Notification.create!(user: inputs.user, inviter: internals.inviter)
  end
end
```

## Predicate methods

Every internal has a method with a question mark.
The data processing logic can be found [here](https://github.com/servactory/servactory/blob/main/lib/servactory/utils.rb#L39-L52).

```ruby
# ...

internal :full_name, type: String

# ...

def something
  # highlight-next-line
  return unless internals.full_name? # instead of `internals.full_name.present?`

  # ...
end
```