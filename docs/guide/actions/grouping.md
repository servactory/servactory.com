---
title: Grouping actions in service
description: Description and examples of grouping actions (methods) in service
prev: Options for actions in service
next: Configuration
---

# Grouping actions

You can use the `stage` method to group multiple methods into one execution group.

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

```ruby {2}
stage do
  only_unless ->(context:) { Settings.features.preview.disabled }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

The opposite of the `only_if` option.

### Option `wrap_in`

Group of methods in `stage` can be wrapped in something.
For example, it could be `ActiveRecord::Base.transaction` from Rails.

```ruby {2}
stage do
  wrap_in ->(methods:) { ActiveRecord::Base.transaction { methods.call } }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Option `rollback`

If an exception occurs in one of the methods in the group or in `wrap_in`, this can be handled using the `rollback` method.

```ruby {3,12}
stage do
  wrap_in ->(methods:) { ActiveRecord::Base.transaction { methods.call } }
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
