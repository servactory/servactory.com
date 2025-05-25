---
title: Actions on the Featury object
description: Description and examples of using actions on the Featury object
prev: false
next: false
---

# Actions of Featury

To work with feature flags via Featury, need to create actions.
Each action involves implementing logic over the names of the received feature flags and additional options.

## Example

As an example, let's imagine that we have an ActiveRecord model that is responsible for all the project's feature flags.
It's called `FeatureFlag`.

Let's also imagine that working with feature flags in a project requires 4 actions:

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
