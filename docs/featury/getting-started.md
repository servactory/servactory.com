---
title: Getting started with Featury
description: Featury is a feature flag and feature object framework for Ruby applications
prev: false
next: false
---

# Getting started with Featury

## Conventions

- All feature classes are subclasses of `Featury::Base` and are located in the `app/features` directory. It is common practice to create and inherit from `FeatureService::Base` class, which is a subclass of `Featury::Base`.
- Name features based on the process they relate to. Use nouns in names and try to equate them with model names whenever possible. For example, name the feature class `User::OnboardingFeature` instead of `User::OnboardFeature`.

## Version support

| Ruby/Rails | 8.1 | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|------------|---|---|---|---|---|---|---|---|---|---|
| 4.0        | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1        | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Installation

Add this to `Gemfile`:

```ruby
gem "featury"
```

And execute:

```shell
bundle install
```

## Preparation

As a first step, it is recommended to prepare the base class for further inheritance.
This base class should contain actions within itself with the integration of the tool for features in the project.
For example, it could be an ActiveRecord model, Flipper, or something else.

### ActiveRecord model

The `FeatureFlag` model will be used as an example.

::: code-group

```ruby [app/features/application_feature/base.rb]
module ApplicationFeature
  class Base < Featury::Base
    action :enabled? do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .enabled?
      end
    end

    action :disabled? do |features:, **options|
      features.any? do |feature|
        !FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .enabled?
      end
    end

    action :enable do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .update!(enabled: true)
      end
    end

    action :disable do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .update!(enabled: false)
      end
    end

    before do |action:, features:|
      Slack::API::Notify.call!(action:, features:)
    end

    after :enabled?, :disabled? do |action:, features:|
      Slack::API::Notify.call!(action:, features:)
    end
  end
end
```

:::
