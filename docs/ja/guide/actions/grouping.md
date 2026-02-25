---
title: サービス内のアクションのグルーピング
description: サービス内のアクション（メソッド）のグルーピングに関する説明と例
prev: サービス内のアクションのオプション
next: 早期成功終了
---

# アクションのグルーピング

`stage`メソッドで複数のメソッドを1つの実行グループにまとめます。

:::info

`make`の`position`オプションは`stage`内でのみソートされます。

:::

```ruby
stage do
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### オプション`only_if`

`stage`内のメソッド呼び出しの前に`only_if`条件を確認します。

```ruby {2}
stage do
  only_if ->(context:) { Settings.features.preview.enabled }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### オプション`only_unless`

`only_if`オプションの逆です。

```ruby {2}
stage do
  only_unless ->(context:) { Settings.features.preview.disabled }

  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### オプション`wrap_in`

`stage`内のメソッドをラッパーで包みます。
例: Railsの`ActiveRecord::Base.transaction`。

```ruby {2}
stage do
  wrap_in ->(methods:, context:) { ActiveRecord::Base.transaction { methods.call } }
  
  make :create_user!
  make :create_blog_for_user!
  make :create_post_for_user_blog!
end
```

### オプション`rollback`

グループ内のメソッドまたは`wrap_in`からの例外を`rollback`メソッドで処理します。

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
