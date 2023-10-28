---
title: Расширения
description: Описание и примеры реализации пользовательских расширений
prev: Неудачи и обработка ошибок
next: Интернационализация (I18n)
---

# Расширения

Вы можете расширить базовый функционал, дополнив его собственными расширениями.

Рекомендуется создавать расширения в директории `app/services/application_service/extensions`.
Также в качестве рекомендации создавайте расширения в собственной директории.

## Пример реализации

### Подключение

Добавить расширения можно при помощи метода `with_extensions`.

::: code-group

```ruby [app/services/application_service/base.rb]
require_relative "extensions/status_active/dsl"

module ApplicationService
  class Base
    include Servactory::DSL.with_extensions(
      ApplicationService::Extensions::StatusActive::DSL
    )
  end
end
```

:::

### Код расширения

::: code-group

```ruby [app/services/application_service/extensions/status_active/dsl.rb]
module ApplicationService
  module Extensions
    module StatusActive
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          attr_accessor :status_active_model_name

          def status_active!(model_name)
            self.status_active_model_name = model_name
          end
        end

        module InstanceMethods
          private

          def call!(**)
            super

            status_active_model_name = self.class.send(:status_active_model_name)
            return if status_active_model_name.nil?

            is_active = inputs.send(status_active_model_name).active?
            return if is_active

            fail!(message: "User is not active")
          end
        end
      end
    end
  end
end
```

:::

### Использование

```ruby{5}
module PostsService
  class Create < ApplicationService::Base
    input :user, type: User

    status_active! :user
    
    make :something
    
    private

    def something
      # ...
    end
  end
end
```
