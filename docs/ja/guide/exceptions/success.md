---
title: 早期成功終了
description: サービスの早期手動成功終了の説明と使用例
prev: サービス内のアクションのグルーピング
next: サービスの失敗とエラーハンドリング
---

# 早期成功終了 <Badge type="tip" text="2.2.0以降" />

`success!`メソッドを呼び出すことで、サービスを早期に正常終了させます。

Servactoryにとってこれも例外ですが、成功の例外です。

## 使い方

例: 環境に応じて動作する通知サービス。

```ruby
class Notifications::Slack::Error::Send < ApplicationService::Base
  # ...
  
  make :check_environment!

  make :send_message!
  
  private
  
  def check_environment!
    return if Rails.env.production?
    
    success!
  end
  
  def send_message!
    # Here is the API request in Slack
  end
end
```

このサービスはプロダクション以外の環境ですぐに成功で終了します。
複数の条件を持つ複雑な実装で特に便利です。
