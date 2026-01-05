---
title: Grouping actions in service
description: Description and examples of grouping actions (methods) in service
prev: Options for actions in service
next: Early successful termination
---

# Grouping actions

Group multiple methods into one execution group via the `stage` method.

:::info

Usage of the `position` option for `make` will sort only in `stage`.

:::

```ruby
stage do
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Option `only_if`

Checks the `only_if` condition before calling methods inside `stage`.

```ruby {2}
stage do
  only_if ->(context:) { Settings.features.preview.enabled }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Option `only_unless`

The opposite of the `only_if` option.

```ruby {2}
stage do
  only_unless ->(context:) { Settings.features.preview.disabled }

  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Option `wrap_in`

Wrap methods in `stage` with a wrapper.
Example: `ActiveRecord::Base.transaction` from Rails.

```ruby {2}
stage do
  wrap_in ->(methods:, context:) { ActiveRecord::Base.transaction { methods.call } }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Option `rollback`

Handle exceptions from methods in the group or from `wrap_in` via the `rollback` method.

```ruby {3,12}
stage do
  wrap_in ->(methods:, context:) { ActiveRecord::Base.transaction { methods.call } }
  rollback :clear_data_and_fail!
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end

# ...

def clear_data_and_fail!(e)
  # ...

  fail!(message: "Failed to create data: #{e.message}")
end
```
