---
title: サービスの内部アトリビュート
description: サービスの内部アトリビュートの説明と使用例
prev: サービスの入力アトリビュート
next: サービスの出力アトリビュート
---

# 内部アトリビュート

`internal`メソッドでinternalプライベートアトリビュートを追加します。

## 使い方

`internals=`/`internals`メソッドでinternalアトリビュートの割り当てとアクセスを行います。

```ruby{6,14,22}
class Users::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  internal :full_name, type: String

  output :user, type: User

  make :assign_full_name
  make :create!

  def assign_full_name
    internals.full_name = [
      inputs.first_name,
      inputs.middle_name,
      inputs.last_name
    ].join(" ")
  end

  def create!
    outputs.user = User.create!(full_name: internals.full_name)
  end
end
```

## オプション

詳細は[オプションの使い方](../options/usage)を参照してください。

## ヘルパー

Servactoryはプロジェクト用のカスタムヘルパーをサポートしています。ヘルパーは特定のオプションに展開される省略記法です。

### カスタム

`configuration`の`internal_option_helpers`でカスタムヘルパーを追加します。ヘルパーは既存のオプションに基づいて作成できます。

[設定例](../configuration#internalのヘルパー)

#### `must`の例

```ruby{5}
class Payments::Create < ApplicationService::Base
  # ...

  internal :invoice_numbers,
           :must_be_6_characters,
           type: Array,
           consists_of: String

  # ...
end
```

## メソッド

### メソッド`only`

`only`メソッドで`internals`をフィルタリングします。指定されたアトリビュートを含むHashを返します。

```ruby{2}
outputs.full_name =
  internals.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### メソッド`except`

`except`メソッドで`internals`をフィルタリングします。指定されたアトリビュートを除いたHashを返します。

```ruby{2}
outputs.full_name =
  internals.except(:gender)
    .values
    .compact
    .join(" ")
```

### プレディケートメソッド

任意のinternalアトリビュートをプレディケートメソッドとしてアクセスできます。

```ruby{8}
# ...

internal :full_name, type: String

# ...

def something
  return unless internals.full_name? # instead of `internals.full_name.present?`

  # ...
end
```
