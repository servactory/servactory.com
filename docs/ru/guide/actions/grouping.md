---
title: Группирование действий в сервисе
description: Описание и примеры группирования действий (методов) в сервисе
prev: Опции для действий в сервисе
next: Раннее успешное завершение
---

# Группирование действий

Собрать в одну группу выполнение несколько методов можно при помощи метода `stage`.

::: info

Использование опции `position` для `make` будет сортировать только внутри `stage`.

:::

```ruby
stage do
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Опция `only_if`

Перед вызовом методов внутри `stage` будет проверено условие, описанное в `only_if`.

```ruby {2}
stage do
  only_if ->(context:) { Settings.features.preview.enabled }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Опция `only_unless`

Противоположность опции `only_if`.

```ruby {2}
stage do
  only_unless ->(context:) { Settings.features.preview.disabled }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Опция `wrap_in`

Группу методов, находящийхся в `stage` можно обернуть во что-то.
Например, это может быть `ActiveRecord::Base.transaction` от Rails.

```ruby {2}
stage do
  wrap_in ->(methods:) { ActiveRecord::Base.transaction { methods.call } }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Опция `rollback`

Если в одном из методов в группе или в `wrap_in` возникло исключение, то это можно обработать при помощи метода `rollback`.

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
