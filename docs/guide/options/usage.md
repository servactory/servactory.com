---
title: Using attribute options
description: Description and examples of using options for all service attributes
prev: false
next: false
---

# Using options

## Option `type` <Badge type="tip" text="input" /> <Badge type="tip" text="internal" /> <Badge type="tip" text="output" />

This option is validation.
It will check that the passed value corresponds to the specified type (class).
The `is_a?` method is used.

Always required to specify. May contain one or more classes.

::: code-group

```ruby{2,3,11,16,21} [input]
class NotificationsService::Create < ApplicationService::Base
  input :user, type: User
  input :need_to_notify, type: [TrueClass, FalseClass]

  internal :inviter, type: User

  output :notification, type: Notification

  make :assign_inviter
  make :create_notification!
  make :notify_by_email, if: ->(context:) { context.inputs.need_to_notify }

  private

  def assign_inviter
    internals.inviter = inputs.user.inviter
  end

  def create_notification!
    outputs.notification = Notification.create!(
      user: inputs.user, 
      inviter: internals.inviter
    )
  end

  def notify_by_email
    NotificationsMailer.notify_about_new(outputs.notification).deliver_now
  end
end
```

```ruby{5,16,22} [internal]
class NotificationsService::Create < ApplicationService::Base
  input :user, type: User
  input :need_to_notify, type: [TrueClass, FalseClass]

  internal :inviter, type: User

  output :notification, type: Notification

  make :assign_inviter
  make :create_notification!
  make :notify_by_email, if: ->(context:) { context.inputs.need_to_notify }

  private

  def assign_inviter
    internals.inviter = inputs.user.inviter
  end

  def create_notification!
    outputs.notification = Notification.create!(
      user: inputs.user, 
      inviter: internals.inviter
    )
  end

  def notify_by_email
    NotificationsMailer.notify_about_new(outputs.notification).deliver_now
  end
end
```

```ruby{7,20,27} [output]
class NotificationsService::Create < ApplicationService::Base
  input :user, type: User
  input :need_to_notify, type: [TrueClass, FalseClass]

  internal :inviter, type: User

  output :notification, type: Notification

  make :assign_inviter
  make :create_notification!
  make :notify_by_email, if: ->(context:) { context.inputs.need_to_notify }

  private

  def assign_inviter
    internals.inviter = inputs.user.inviter
  end

  def create_notification!
    outputs.notification = Notification.create!(
      user: inputs.user, 
      inviter: internals.inviter
    )
  end

  def notify_by_email
    NotificationsMailer.notify_about_new(outputs.notification).deliver_now
  end
end
```

:::

## Option `required` <Badge type="tip" text="input" />

This option is validation.
It will check that the passed value is not empty.
The `present?` method is used.

By default, `required` is set to `true`.

::: code-group

```ruby{7} [input]
class UsersService::Create < ApplicationService::Base
  input :first_name,
        type: String
  
  input :middle_name,
        type: String,
        required: false
  
  input :last_name,
        type: String

  # ...
end
```

:::

## Option `default` <Badge type="tip" text="input" />

This option is not validation.
It will assign a value to the attribute if one was not passed to the service.

::: code-group

```ruby [input]
# soon
```

:::

## Option `as` <Badge type="tip" text="input" />

This option is not validation.
It will indicate the new name of the attribute to work within the service.
The original name inside the service will no longer be available.

::: code-group

```ruby{3,10} [input]
class NotificationsService::Create < ApplicationService::Base
  input :user,
        as: :recipient,
        type: User

  # ...

  def create!
    outputs.notification =
      Notification.create!(recipient: inputs.recipient)
  end
end
```

:::

## Option `inclusion` <Badge type="tip" text="input" />

This option is validation.
It will check that the passed value is in the specified array.
The `include?` method is used.

::: code-group

```ruby{4} [input]
class EventsService::Send < ApplicationService::Base
  input :event_name,
        type: String,
        inclusion: %w[created rejected approved]

  # ...
end
```

:::

## Option `consists_of` <Badge type="tip" text="input" /> <Badge type="tip" text="internal" /> <Badge type="tip" text="output" />

You can find out more about this option in the section on advanced operation of [collection mode](../options/modes#option-consists-of).

## Option `schema` <Badge type="tip" text="input" /> <Badge type="tip" text="internal" /> <Badge type="tip" text="output" />

You can find out more about this option in the section on advanced operation of [hash mode](../options/modes#option-schema).

## Option `must` <Badge type="tip" text="input" />

This option is validation.
Allows you to create your own validations.

::: code-group

```ruby{5-9} [input]
class PaymentsService::Create < ApplicationService::Base
  input :invoice_numbers,
        type: Array,
        consists_of: String,
        must: {
          be_6_characters: {
            is: ->(value:) { value.all? { |id| id.size == 6 } }
          }
        }

  # ...
end
```

:::

## Option `prepare` <Badge type="tip" text="input" />

This option is not validation.
It is used to prepare the passed value.

::: warning

Use the `prepare` option carefully and only for simple preparatory actions.

:::

::: code-group

```ruby{5,11} [input]
class PaymentsService::Create < ApplicationService::Base
  input :amount_cents,
        as: :amount,
        type: Integer,
        prepare: ->(value:) { Money.from_cents(value, :USD) }

  # ...

  def create!
    outputs.payment = Payment.create!(amount: inputs.amount)
  end
end
```

:::
