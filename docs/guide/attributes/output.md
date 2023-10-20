---
title: Service output attributes
description: Description and examples of using output attributes of service
prev: Service internal attributes
next:  Service actions
---

# Service output attributes

All attributes that the service should return in `Result` must be added using the `output` method.

## Usage

The assignment and use of service output attributes is done through the `outputs=`/`outputs` methods or their `out=`/`out` aliases.

```ruby
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  output :full_name, type: String

  # ...

  def something
    outputs.full_name = [inputs.first_name, inputs.middle_name, inputs.last_name].compact.join(" ")
    # or
    # out.full_name = [inp.first_name, inp.middle_name, inp.last_name].compact.join(" ")
  end
end
```

## Options

### Option `type`

This option is validation.
It will check that the value set to `output` corresponds to the specified type (class).
In this case `is_a?` method is used.

```ruby{4,11}
class NotificationService::Create < ApplicationService::Base
  input :user, type: User

  output :notification, type: Notification

  make :create_notification!
  
  private
  
  def create_notification!
    outputs.notification = Notification.create!(user: inputs.user)
  end
end
```

## Predicate methods

Any output attribute can be accessed as a predicate method.


```ruby{8}
# ...

output :full_name, type: String

# ...

def something
  return unless outputs.full_name? # instead of `outputs.full_name.present?`

  # ...
end
```
