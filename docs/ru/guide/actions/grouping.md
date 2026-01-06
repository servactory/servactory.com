---
title: Группирование действий в сервисе
description: Описание и примеры группирования действий (методов) в сервисе
prev: Опции для действий в сервисе
next: Раннее успешное завершение
---

# Группирование действий

Группируйте несколько методов в одну группу выполнения через метод `stage`.

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

Проверяет условие `only_if` перед вызовом методов внутри `stage`.

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

Оборачивайте методы в `stage` обёрткой.
Пример: `ActiveRecord::Base.transaction` от Rails.

```ruby {2}
stage do
  wrap_in ->(methods:, context:) { ActiveRecord::Base.transaction { methods.call } }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### Опция `rollback`

Обрабатывайте исключения из методов группы или из `wrap_in` через метод `rollback`.

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
