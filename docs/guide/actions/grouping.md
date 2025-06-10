---
title: Grouping Actions in a Service
description: Description and examples of grouping actions (methods) in a service
prev: Options for Actions in a Service
next: Early Successful Completion
---

# Grouping Actions

You can group the execution of several methods using the `stage` method.

::: info

Using the `position` option for `make` will only sort within `stage`.

:::

```ruby
stage do
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Option `only_if`

Before calling methods inside `stage`, the condition described in `only_if` will be checked.

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

The group of methods in `stage` can be wrapped in something.
For example, it could be `ActiveRecord::Base.transaction` from Rails.

```ruby {2}
stage do
  wrap_in ->(methods:, context:) { ActiveRecord::Base.transaction { methods.call } }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Option `rollback`

If an exception occurs in one of the methods in the group or in `wrap_in`, it can be handled using the `rollback` method.

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
