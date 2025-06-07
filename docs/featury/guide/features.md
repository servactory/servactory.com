---
title: Feature object by Featury
description: Description and examples of using the Featury feature object
prev: false
next: false
---

# Feature object Featury

A feature object can contain work with either one specific feature flag or several feature flags.
Several feature flags can also be represented as a group — a nested feature object.

## Prefix

A feature object always has a prefix.
By default, it is built based on the class name of the feature object.
For example, for `User::OnboardingFeature` the default prefix will be `user_onboarding`.

You can change the prefix using the `prefix` method:

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding # [!code focus]
  
  # ...
end
```

## Resources

A feature object may expect a resource to be passed to it as input.
These resources can be used in actions as an addition to working with feature flags.

### Options

#### Option `option`

Makes the resource optional for calling the feature object.
Defaults to `false`.

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User, option: true # [!code focus]

  # ...
end
```

#### Option `nested`

Passes a resource to nested feature objects via `groups`.
Defaults to `false`.

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User, nested: true # [!code focus]

  # ...
end
```

## Condition

A feature object can contain a basic condition for operation.
For example, this can be useful if you want to allow work with a resource only in a certain state.

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? } # [!code focus]

  # ...
end
```

## Set of features

Within a single feature object, you can specify one feature flag or several feature flags.

::: code-group

```ruby [One]
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? }

  features :passage # [!code focus]
end
```

```ruby [Several]
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? }

  features :passage, :integration # [!code focus]
end
```

:::

Together with the `onboarding` prefix, an example of which is presented above, these feature flags will be collected:

::: code-group

```ruby [One]
# => onboarding_passage
```

```ruby [Several]
# => onboarding_passage
# => onboarding_integration
```

:::

## Groups of feature sets

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? }

  features :passage

  groups BillingFeature, # [!code focus]
         PaymentSystemFeature # [!code focus]
end
```