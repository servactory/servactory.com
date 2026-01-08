---
title: Расширения
description: Описание и примеры реализации пользовательских расширений
prev: Миграция RSpec
next: Интернационализация (I18n)
---

# Расширения <Badge type="tip" text="Начиная с 2.0.0" />

Расширяйте базовый функционал собственными расширениями.

Создавайте расширения в директории `app/services/application_service/extensions`.
Размещайте каждое расширение в собственной поддиректории.

## Пример реализации

### Подключение

Добавляйте расширения через метод `with_extensions`.

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

            fail_input!(
              status_active_model_name,
              message: "#{status_active_model_name.to_s.camelize.singularize} is not active"
            )
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
