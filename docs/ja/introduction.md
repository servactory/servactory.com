---
title: Servactoryを選ぶ理由
description: Servactoryの紹介 — 堅牢なRuby/Railsサービスを構築するための統一的なアプローチ
prev: false
next: 始め方
---

# Servactoryを選ぶ理由

## Servactoryについて

Servactoryはあらゆる複雑さに対応する堅牢なサービスの構築を標準化します。

シンプルなサービスを作成できます:

```ruby
class MinimalService < ApplicationService::Base
  def call
    # ...
  end
end
```

そして呼び出します:

```ruby
MinimalService.call! # or MinimalService.call
```

または複雑なサービスを構築できます:

```ruby
class NotificationsService::Send < ApplicationService::Base
  input :comment, type: Comment
  input :provider, type: NotificationProvider

  internal :user, type: User
  internal :status, type: String
  internal :response, type: NotificatorApi::Models::Notification

  output :notification, type: Notification

  make :assign_user
  make :assign_status

  make :create_notification!
  make :send_notification
  make :update_notification!
  make :update_comment!
  make :assign_status

  private

  def assign_user
    internals.user = inputs.comment.user
  end

  def assign_status
    internals.status = StatusEnum::NOTIFIED
  end

  def create_notification!
    outputs.notification = Notification.create!(user:, comment: inputs.comment, provider: inputs.provider)
  end

  def send_notification
    service_result = NotificatorService::API::Send.call(notification: outputs.notification)

    return fail!(message: service_result.error.message) if service_result.failure?

    internals.response = service_result.response
  end

  def update_notification!
    outputs.notification.update!(original_data: internals.response)
  end

  def update_comment!
    inputs.comment.update!(status: internals.status)
  end
end
```

次のように呼び出します:

```ruby
# comment = Comment.first
# provider = NotificationProvider.first

NotificationsService::Send.call!(comment:, provider:)
# Or
# NotificationsService::Send.call(comment:, provider:)
```

## Servactoryを使う理由

### 統一的なアプローチ

Rubyの柔軟性は、アプリケーション全体でサービスの実装に一貫性がなくなる原因となります。時間の経過とともに、この不一致は開発を複雑にし、サービスの理解を困難にします。

Servactoryはサービス実装のための一貫したAPIを提供し、すべてのクラスでロジック構造の統一を保証します。

### テスト

Servactoryのサービスは標準的なRubyクラスと同様にテストできます。統一的なアプローチにより、一貫したテストパターンが実現されます。
