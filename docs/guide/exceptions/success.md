---
title: Early successful termination
description: Description and examples of using early manual successful termination of the service
prev: Grouping actions in service
next: Service failures and error handling
---

# Early successful termination <Badge type="tip" text="Since 2.2.0" />

Terminate the service prematurely and successfully by calling the `success!` method.

For Servactory this is also an exception, but a successful one.

## Usage

Example: a notification service that operates depending on the environment.

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

This service immediately succeeds in non-production environments.
Especially useful in complex implementations with multiple conditions.
