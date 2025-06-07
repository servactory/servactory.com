---
title: Early Successful Completion
description: Description and examples of using early manual successful completion of a service
prev: Grouping Actions in a Service
next: Failure and Error Handling
---

# Early Successful Completion <Badge type="tip" text="Since 2.2.0" />

The service execution can be terminated prematurely and successfully by calling the `success!` method.

For Servactory, this is also an exception, but a successful one.

## Usage

As an example, let's consider a notification service that should work depending on the environment where it is called.

```ruby
class NotificatorService::Slack::Error::Send < ApplicationService::Base
  # ...
  
  make :check_environment!

  make :send_message!
  
  private
  
  def check_environment!
    return if Rails.env.production?
    
    success!
  end
  
  def send_message!
    # Here is the API request in Slack
  end
end
```

Calling this service will immediately complete successfully in environments other than production.
This can be especially useful in more complex implementations where there are more conditions for operation.
