---
title: Actions on the Featury object
description: Description and examples of using actions on the Featury object
prev: false
next: false
---

# Featury Actions

To work with feature flags via Featury, you need to create actions.
Each action involves implementing logic for the names of the received feature flags and additional options.

## Example

As an example, let's imagine we have an ActiveRecord model responsible for all feature flags in the project.
It is called `FeatureFlag`.

Also, let's assume that the project requires 4 actions to work with feature flags:

- `enabled?`
- `disabled?`
- `enable`
- `disable`

In this case, the Featury actions will look like this:

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
  end
end
```

:::
