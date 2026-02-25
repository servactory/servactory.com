---
title: サービスの失敗とエラーハンドリング
description: サービスの失敗の説明と使用例
prev: 早期成功終了
next: 設定
---

# 失敗とエラーハンドリング

## メソッドと例外の説明

以下のメソッドのいずれかを呼び出して、サービスを早期に終了させます:

- `fail_input!`;
- `fail_internal!`;
- `fail_output!`;
- `fail!`;
- `fail_result!`.

これらのメソッドは例外をスローします。

上記のリストのうち、`call`経由の呼び出し後に処理できるのは以下のメソッドのみです:

- `fail!`;
- `fail_result!`.

残りのメソッドは常に例外をスローします。

input、internal、outputアトリビュートの自動チェックも存在します。
これらのアトリビュートのバリデーション問題は対応する例外を発生させます。
この動作は以下のメソッドの呼び出しと同じです:

- `fail_input!`;
- `fail_internal!`;
- `fail_output!`.

サービスのロジックは独自の例外をスローすることがあります（例: `ActiveRecord::RecordInvalid`）。
そのような場合はクラスレベルの`fail_on!`メソッドで処理します。

## メソッド

### メソッド`fail_input!`

inputアトリビュートの代わりに例外をスローします。

`fail_input!`メソッドはエラーテキスト、`meta`による追加情報を受け取り、
inputアトリビュート名が必須です。

あらゆるサービス呼び出しで`ApplicationService::Exceptions::Input`例外がスローされます。

```ruby{6}
make :check!

def check!
  return if inputs.invoice_number.start_with?("AA")

  fail_input!(
    :invoice_number,
    message: "Invalid invoice number",
    meta: {
      received_invoice_number: inputs.invoice_number
    }
  )
end
```

`ApplicationService::Exceptions::Input`例外が提供する情報の例:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Input)
exception.message           # => Invalid invoice number
exception.input_name        # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### メソッド`fail_internal!`

internalアトリビュートの代わりに例外をスローします。

`fail_internal!`メソッドはエラーテキスト、`meta`による追加情報を受け取り、
internalアトリビュート名が必須です。

あらゆるサービス呼び出しで`ApplicationService::Exceptions::Internal`例外がスローされます。

```ruby{6}
make :check!

def check!
  return if internals.invoice_number.start_with?("AA")

  fail_internal!(
    :invoice_number,
    message: "Invalid invoice number",
    meta: {
      received_invoice_number: internals.invoice_number
    }
  )
end
```

`ApplicationService::Exceptions::Internal`例外が提供する情報の例:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Internal)
exception.message           # => Invalid invoice number
exception.internal_name     # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### メソッド`fail_output!`

outputアトリビュートの代わりに例外をスローします。

`fail_output!`メソッドはエラーテキスト、`meta`による追加情報を受け取り、
outputアトリビュート名が必須です。

あらゆるサービス呼び出しで`ApplicationService::Exceptions::Output`例外がスローされます。

```ruby{6}
make :check!

def check!
  return if outputs.invoice_number.start_with?("AA")

  fail_output!(
    :invoice_number,
    message: "Invalid invoice number",
    meta: {
      received_invoice_number: outputs.invoice_number
    }
  )
end
```

`ApplicationService::Exceptions::Output`例外が提供する情報の例:

```ruby
exception.service           # => <Actor: @class_name="InvoiceService::Check", @i18n_root_key="servactory">
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Output)
exception.message           # => Invalid invoice number
exception.output_name       # => :invoice_number
exception.meta              # => {:received_invoice_number=>"BB-7650AE"}
```

### メソッド`fail!`

カスタムエラーを記述します。

`fail!`メソッドはエラーテキスト、`meta`による追加情報、およびオプションの`type`を受け取ります。

デフォルトでは`type`は`base`です。カスタム処理には任意の値を渡してください。

`.call!`経由の呼び出しは`Servactory::Exceptions::Failure`例外をスローします。
`.call`経由の呼び出しはエラーを記録し、`Result`で利用可能にします。

#### 使用例

デフォルトタイプの最小限の例:

```ruby{6}
make :check!

def check!
  return if inputs.invoice_number.start_with?("AA")

  fail!(message: "Invalid invoice number")
end
```

デフォルトタイプとメタデータの拡張例:

```ruby{2,4-6}
fail!(
  :base,
  message: "Invalid invoice number",
  meta: {
    invoice_number: inputs.invoice_number
  }
)
```

カスタム`validation`タイプとメタデータの例:

```ruby{7,9-12}
make :check!

def check!
  return if inputs.email.include?("@")

  fail!(
    :validation,
    message: "Email must contain @ symbol",
    meta: {
      field: :email,
      provided_value: inputs.email
    }
  )
end
```

提供される情報の例:

```ruby
exception.detailed_message  # => Invalid invoice number (ApplicationService::Exceptions::Failure)
exception.message           # => Invalid invoice number
exception.type              # => :base
exception.meta              # => {:invoice_number=>"BB-7650AE"}
```

`validation`タイプの例:

```ruby
exception.detailed_message  # => Email must contain @ symbol (ApplicationService::Exceptions::Failure)
exception.message           # => Email must contain @ symbol
exception.type              # => :validation
exception.meta              # => {:field=>:email, :provided_value=>"user.example.com"}
```

### メソッド`fail_result!` <Badge type="tip" text="2.1.0以降" />

`Result`を必要とし、内部で`fail!`メソッドを呼び出します。

あるサービスから現在のサービスへエラーを渡すコードを簡潔に記述するために設計されています。
例えば、APIサービスからアプリケーションサービスへの場合です。

```ruby
fail_result!(service_result)
```

上記のコードは以下と同等です:

```ruby
fail!(
  service_result.error.type,
  message: service_result.error.message,
  meta: service_result.error.meta
)
```

### メソッド`fail_on!` <Badge type="tip" text="2.5.0以降" />

指定された例外をキャッチします。

`fail_on!`メソッドは例外クラスを受け取り、オプションでメッセージテキストをカスタマイズします。

指定された例外の代わりに`fail!`が呼び出されます。
元の例外の情報は`meta`経由で`fail!`に渡されます。

#### 使い方

```ruby
module ApplicationService
  class Base < Servactory::Base
    fail_on! ActiveRecord::RecordNotFound,
             ActiveRecord::RecordInvalid
    
    # ...
  end
end
```

メッセージテキストを以下のようにカスタマイズします:

```ruby
fail_on! ActiveRecord::RecordNotFound,
         with: ->(exception:) { exception.message }
```

別の方法:

```ruby
fail_on!(ActiveRecord::RecordNotFound) { |exception:| exception.message }
```
