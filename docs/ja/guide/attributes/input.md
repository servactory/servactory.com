---
title: サービスの入力アトリビュート
description: サービスの入力アトリビュートの説明と使用例
prev: サービスの呼び出しと実行結果
next: サービスの内部アトリビュート
---

# 入力アトリビュート

`input`メソッドで期待されるすべてのアトリビュートを追加します。予期しない引数（inputアトリビュートとして定義されていないもの）はエラーになります。

## 使い方

`inputs`メソッドでinputアトリビュートにアクセスします。

```ruby{2-4,15-17}
class UsersService::Create < ApplicationService::Base
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

Servactoryはビルトインヘルパーを提供し、カスタムヘルパーもサポートしています。ヘルパーは特定のオプションに展開される省略記法です。

### ヘルパー`optional`

`required: false`と同等です。

```ruby{6}
class UsersService::Create < ApplicationService::Base
  input :first_name,
        type: String

  input :middle_name,
        :optional,
        type: String

  input :last_name,
        type: String

  # ...
end
```

### カスタム

`configuration`の`input_option_helpers`でカスタムヘルパーを追加します。ヘルパーは既存のオプションに基づいて作成できます。

[設定例](../configuration#inputのヘルパー)

#### `must`の例

```ruby{3}
class PaymentsService::Create < ApplicationService::Base
  input :invoice_numbers,
        :must_be_6_characters,
        type: Array,
        consists_of: String

  # ...
end
```

#### `prepare`の例

```ruby{3}
class PaymentsService::Create < ApplicationService::Base
  input :amount_cents,
        :to_money,
        as: :amount,
        type: Integer

  # ...
end
```

## メソッド

### メソッド`only`

`only`メソッドで`inputs`をフィルタリングします。指定されたアトリビュートを含むHashを返します。

```ruby{2}
outputs.full_name =
  inputs.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### メソッド`except`

`except`メソッドで`inputs`をフィルタリングします。指定されたアトリビュートを除いたHashを返します。

```ruby{2}
outputs.full_name =
  inputs.except(:gender)
    .values
    .compact
    .join(" ")
```

### プレディケートメソッド

任意のinputアトリビュートをプレディケートメソッドとしてアクセスできます。

```ruby{6}
input :first_name, type: String

# ...

def something
  return unless inputs.user? # instead of `inputs.user.present?`
  
  # ...
end
```
