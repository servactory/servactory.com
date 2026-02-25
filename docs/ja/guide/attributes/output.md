---
title: サービスの出力アトリビュート
description: サービスの出力アトリビュートの説明と使用例
prev: サービスの内部アトリビュート
next: サービスアトリビュートのオプション
---

# 出力アトリビュート

`output`メソッドですべての戻り値アトリビュートを追加します。これらは`Result`クラスを通じて利用できます。

## 使い方

`outputs=`/`outputs`メソッドでoutputアトリビュートの割り当てとアクセスを行います。

```ruby{8,22}
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

Servactoryはプロジェクト用のカスタムヘルパーをサポートしています。ヘルパーは特定のオプションに展開される省略記法です。

### カスタム

`configuration`の`output_option_helpers`でカスタムヘルパーを追加します。ヘルパーは既存のオプションに基づいて作成できます。

[設定例](../configuration#outputのヘルパー)

#### `must`の例

```ruby{5}
class PaymentsService::Create < ApplicationService::Base
  # ...

  output :invoice_numbers,
         :must_be_6_characters,
         type: Array,
         consists_of: String

  # ...
end
```

## メソッド

### メソッド`only`

`only`メソッドで`outputs`をフィルタリングします。指定されたアトリビュートを含むHashを返します。

```ruby{2}
outputs.full_name =
  outputs.only(:first_name, :middle_name, :last_name)
    .values
    .compact
    .join(" ")
```

### メソッド`except`

`except`メソッドで`outputs`をフィルタリングします。指定されたアトリビュートを除いたHashを返します。

```ruby{2}
outputs.full_name =
  outputs.except(:gender)
    .values
    .compact
    .join(" ")
```

### プレディケートメソッド

任意のoutputアトリビュートをプレディケートメソッドとしてアクセスできます。

```ruby{8}
# ...

output :full_name, type: String

# ...

def something
  return unless outputs.full_name? # instead of `outputs.full_name.present?`

  # ...
end
```
