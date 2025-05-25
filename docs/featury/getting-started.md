---
title: Getting started — Datory
description: Description and examples of use
prev: false
next: false
---

# Getting started

## Conventions

- All feature classes are subclasses of `Featury::Base` and are located in the `app/features` directory. It is common practice to create and inherit from `FeatureService::Base` class, which is a subclass of `Featury::Base`.
- Name features based on the process they relate to. Use nouns in names and try to equate them with model names whenever possible. For example, name the feature class `User::OnboardingFeature` instead of `User::OnboardFeature`.

## Version support

| Ruby/Rails  | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|-------------|---|---|---|---|---|---|---|---|---|
| 3.5 Preview | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1         | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Installation

Add this to `Gemfile`:

```ruby
gem "datory"
```

And execute:

```shell
bundle install
```
