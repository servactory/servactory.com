---
title: Getting Started with Featury
description: Guide to installing and configuring Featury
prev: false
next: false
---

# Getting Started with Featury

## What is Featury?

Featury is a library for managing feature flags in Ruby/Rails applications. It provides a convenient API for working with feature flags and their groups.

## Development Conventions

Featury follows certain conventions to ensure code consistency:

- All feature classes must inherit from `Featury::Base` and be placed in the `app/features` directory
- It is recommended to create a base class `ApplicationFeature::Base` that inherits from `Featury::Base`
- Feature names should reflect their belonging to the process
- Use nouns in feature names (e.g., `User::OnboardingFeature` instead of `User::OnboardFeature`)

## Version Support

Featury supports the following Ruby and Rails versions:

| Ruby/Rails  | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|-------------|---|---|---|---|---|---|---|---|---|
| 3.5 Preview | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1         | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Installation

### Adding the Gem

Add Featury to your `Gemfile`:

```ruby
gem "featury"
```

### Installing Dependencies

Run the command to install the gem:

```shell
bundle install
```

## Environment Setup

### Creating a Base Class

To start, it is recommended to prepare a base class for further inheritance.
This base class should contain actions with integration of the feature tool in the project.
For example, it could be an ActiveRecord model, Flipper, or something else.

### Example with ActiveRecord

The `FeatureFlag` model will be used as an example:

::: code-group

```ruby [app/features/application_feature/base.rb]
module ApplicationFeature
  class Base < Featury::Base
    # Check if feature is enabled
    action :enabled? do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .enabled?
      end
    end

    # Check if feature is disabled
    action :disabled? do |features:, **options|
      features.any? do |feature|
        !FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .enabled?
      end
    end

    # Enable feature
    action :enable do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .update!(enabled: true)
      end
    end

    # Disable feature
    action :disable do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .update!(enabled: false)
      end
    end

    # Hook before executing any action
    before do |action:, features:|
      Slack::API::Notify.call!(action:, features:)
    end

    # Hook after executing enabled? and disabled? actions
    after :enabled?, :disabled? do |action:, features:|
      Slack::API::Notify.call!(action:, features:)
    end
  end
end
```

:::

## Creating the First Feature

### Feature Example

```ruby
class User::OnboardingFeature < ApplicationFeature::Base
  # Prefix for feature flags
  prefix :onboarding

  # User resource
  resource :user, type: User

  # Condition for working with the feature
  condition ->(resources:) { resources.user.onboarding_awaiting? }

  # Set of feature flags
  features :passage, :integration

  # Groups of feature flags
  groups BillingFeature,
         PaymentSystemFeature
end
```

### Usage

```ruby
# Check if feature is enabled
User::OnboardingFeature.enabled?(user: current_user)

# Enable feature
User::OnboardingFeature.enable(user: current_user)

# Check if feature is disabled
User::OnboardingFeature.disabled?(user: current_user)

# Disable feature
User::OnboardingFeature.disable(user: current_user)
```
