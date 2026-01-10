---
title: Расширения
description: Расширяйте функциональность сервисов с помощью пользовательских расширений через систему хуков Stroma
prev: Миграция RSpec
next: Интернационализация (I18n)
---

# Расширения <Badge type="tip" text="Начиная с 3.0.0" />

Расширения позволяют расширять базовый функционал сервисов через систему хуков [Stroma](https://github.com/servactory/stroma).
Определяйте пользовательское поведение, которое выполняется до или после этапов выполнения сервиса.

Создавайте расширения в директории `app/services/application_service/extensions`.

## Быстрый старт

### Генерация расширения

```shell
rails generate servactory:extension StatusActive
```

Создаёт файл `app/services/application_service/extensions/status_active/dsl.rb`.

### Подключение расширения

::: code-group

```ruby {4-6} [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    extensions do
      before :actions, ApplicationService::Extensions::StatusActive::DSL
    end
  end
end
```

:::

### Использование в сервисе

```ruby {5}
class PostsService::Create < ApplicationService::Base
  input :user, type: User
  input :title, type: String

  status_active! :user

  make :create_post

  private

  def create_post
    # ...
  end
end
```

## Создание расширений

### Использование генератора

```shell
rails generate servactory:extension MyExtension
```

Опции:

| Опция | По умолчанию | Описание |
|-------|--------------|----------|
| `--path` | `app/services/application_service/extensions` | Директория вывода |
| `--namespace` | `ApplicationService` | Базовый namespace |

Примеры:

```shell
# Базовый
rails generate servactory:extension Auditable

# Вложенный namespace
rails generate servactory:extension Admin::AuditTrail

# Пользовательский путь
rails generate servactory:extension MyExtension --path=lib/extensions
```

### Структура расширения

::: code-group

```ruby [app/services/application_service/extensions/my_extension/dsl.rb]
module ApplicationService
  module Extensions
    module MyExtension
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def my_extension!(value)
            stroma.settings[:actions][:my_extension][:value] = value
          end
        end

        module InstanceMethods
          private

          def call!(**)
            value = self.class.stroma.settings[:actions][:my_extension][:value]

            if value.present?
              # Логика до выполнения
            end

            super

            # Логика после выполнения
          end
        end
      end
    end
  end
end
```

:::

### Описание структуры модулей

| Модуль | Назначение |
|--------|------------|
| `DSL` | Точка входа, подключается через хуки |
| `ClassMethods` | DSL-методы, вызываемые при определении класса |
| `InstanceMethods` | Runtime-методы, вызываемые при выполнении сервиса |

- `base.extend(ClassMethods)` — добавляет методы конфигурации на уровне класса
- `base.include(InstanceMethods)` — добавляет runtime-поведение на уровне экземпляра

### Организация файлов

Для сложных расширений разделяйте код на отдельные файлы:

```
extensions/my_extension/
├── dsl.rb              # Основной модуль DSL с self.included
├── class_methods.rb    # Модуль ClassMethods
└── instance_methods.rb # Модуль InstanceMethods
```

## Подключение расширений

### Хуки: before и after

```ruby
class ApplicationService::Base < Servactory::Base
  extensions do
    before :actions, ApplicationService::Extensions::Authorization::DSL
    after :actions, ApplicationService::Extensions::Publishable::DSL
  end
end
```

### Доступные ключи хуков

Хуки могут быть привязаны к следующим этапам (в порядке выполнения):

| Ключ | Описание |
|------|----------|
| `:configuration` | Конфигурация сервиса |
| `:info` | Информация о сервисе |
| `:context` | Настройка контекста |
| `:inputs` | Обработка входных данных |
| `:internals` | Внутренние атрибуты |
| `:outputs` | Обработка выходных данных |
| `:actions` | Выполнение действий |

Большинство расширений используют `:actions` — основную точку выполнения.

### Множественные расширения

```ruby {4-9}
class ApplicationService::Base < Servactory::Base
  extensions do
    # Before-хуки (выполняются по порядку)
    before :actions, ApplicationService::Extensions::Authorization::DSL
    before :actions, ApplicationService::Extensions::StatusActive::DSL

    # After-хуки (выполняются по порядку)
    after :actions, ApplicationService::Extensions::Publishable::DSL
    after :actions, ApplicationService::Extensions::PostCondition::DSL
  end
end
```

### Порядок выполнения

1. `before`-хуки выполняются в порядке объявления
2. Действия сервиса (методы `make`)
3. `after`-хуки выполняются в порядке объявления

### Понимание `super`

Расширения формируют цепочку вызовов. `super` передаёт выполнение следующему модулю:

```ruby
def call!(**)
  # Логика до (выполняется первой)
  settings = self.class.stroma.settings[:actions][:my_extension]
  fail!(message: "Not configured") if settings[:required] && settings[:value].blank?

  super  # Вызывает следующее расширение или действия сервиса

  # Логика после (выполняется после завершения сервиса)
  Rails.logger.info("Service completed: #{self.class.name}")
end
```

| Паттерн | Расположение `super` | Применение |
|---------|----------------------|------------|
| Before | Логика до `super` | Валидация, авторизация |
| After | Логика после `super` | Логирование, публикация |
| Around | Обёртка `super` | Транзакции, замер времени |
| Short-circuit | Пропуск `super` | Кэширование, ранний возврат |

### Организация сложных расширений

Для расширений со сложной логикой выносите её в отдельные классы `Tools` вместо добавления методов в модуль расширения. Этот паттерн используется внутри Servactory.

**Структура файлов:**

```
extensions/authorization/
├── dsl.rb
└── tools/
    └── permission_checker.rb
```

::: code-group

```ruby [dsl.rb]
module ApplicationService
  module Extensions
    module Authorization
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def authorize_with(method_name)
            stroma.settings[:actions][:authorization][:method_name] = method_name
          end
        end

        module InstanceMethods
          private

          def call!(incoming_arguments: {}, **)
            method_name = self.class.stroma.settings[:actions][:authorization][:method_name]

            if method_name.present?
              # PORO-класс для логики расширения, не Servactory сервис
              Tools::PermissionChecker.check!(self, incoming_arguments, method_name)
            end

            super
          end
        end
      end
    end
  end
end
```

```ruby [tools/permission_checker.rb]
module ApplicationService
  module Extensions
    module Authorization
      module Tools
        class PermissionChecker
          def self.check!(...)
            new(...).check!
          end

          def initialize(context, arguments, method_name)
            @context = context
            @arguments = arguments
            @method_name = method_name
          end

          def check!
            authorized = @context.send(@method_name, @arguments)

            return if authorized

            @context.fail!(
              :unauthorized,
              message: "Not authorized to perform this action"
            )
          end
        end
      end
    end
  end
end
```

:::

**Преимущества:**

- Логика изолирована в отдельных классах
- Нет загрязнения модулей расширений методами
- Легко тестировать каждый Tool изолированно
- Хорошо масштабируется для сложных расширений

## Настройки Stroma

Расширения хранят конфигурацию в настройках Stroma.

### Структура ключей

```
stroma.settings[:registry_key][:extension_name][:setting_key]
```

| Уровень | Описание | Пример |
|---------|----------|--------|
| `registry_key` | Цель хука | `:actions` |
| `extension_name` | Идентификатор расширения | `:authorization` |
| `setting_key` | Конкретная настройка | `:method_name` |

### Запись настроек

В `ClassMethods`:

```ruby
def authorize_with(method_name)
  stroma.settings[:actions][:authorization][:method_name] = method_name
end
```

### Чтение настроек

В `InstanceMethods`:

```ruby
def call!(**)
  method_name = self.class.stroma.settings[:actions][:authorization][:method_name]
  # ...
  super
end
```

### Автоматическое создание

Вложенные объекты создаются автоматически при первом обращении:

```ruby
# Работает без явной инициализации
stroma.settings[:actions][:my_extension][:enabled] = true
stroma.settings[:actions][:my_extension][:options] = { timeout: 30 }
```

## Паттерны расширений

### Before-паттерн

Валидация или проверка условий до выполнения сервиса.

::: code-group

```ruby [extensions/authorization/dsl.rb]
module ApplicationService
  module Extensions
    module Authorization
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def authorize_with(method_name)
            stroma.settings[:actions][:authorization][:method_name] = method_name
          end
        end

        module InstanceMethods
          private

          def call!(incoming_arguments: {}, **)
            method_name = self.class.stroma.settings[:actions][:authorization][:method_name]

            if method_name.present?
              authorized = send(method_name, incoming_arguments)

              unless authorized
                fail!(
                  :unauthorized,
                  message: "Not authorized to perform this action"
                )
              end
            end

            super
          end
        end
      end
    end
  end
end
```

```ruby [Использование]
class PostsService::Delete < ApplicationService::Base
  input :post, type: Post
  input :user, type: User

  authorize_with :user_can_delete?

  make :delete_post

  private

  def user_can_delete?(args)
    args[:user].admin? || args[:post].author_id == args[:user].id
  end

  def delete_post
    inputs.post.destroy!
  end
end
```

:::

### Around-паттерн

Обёртывание выполнения сервиса в контекст.

::: code-group

```ruby [extensions/transactional/dsl.rb]
module ApplicationService
  module Extensions
    module Transactional
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def transactional!(transaction_class: nil)
            stroma.settings[:actions][:transactional][:enabled] = true
            stroma.settings[:actions][:transactional][:class] = transaction_class
          end
        end

        module InstanceMethods
          private

          def call!(**)
            settings = self.class.stroma.settings[:actions][:transactional]
            enabled = settings[:enabled]

            unless enabled
              super
              return
            end

            transaction_class = settings[:class]

            fail!(message: "Transaction class not configured") if transaction_class.nil?

            transaction_class.transaction { super }
          end
        end
      end
    end
  end
end
```

```ruby [Использование]
class OrdersService::Create < ApplicationService::Base
  transactional! transaction_class: ActiveRecord::Base

  input :user, type: User
  input :items, type: Array

  output :order, type: Order

  make :create_order
  make :create_line_items
  make :charge_payment

  private

  def create_order
    outputs.order = Order.create!(user: inputs.user)
  end

  def create_line_items
    inputs.items.each do |item|
      outputs.order.line_items.create!(item)
    end
  end

  def charge_payment
    PaymentsService::Charge.call!(amount: outputs.order.total_amount)
  end
end
```

:::

### After-паттерн

Обработка результатов после выполнения сервиса.

::: code-group

```ruby [extensions/publishable/dsl.rb]
module ApplicationService
  module Extensions
    module Publishable
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def publishes(event_name, with: nil, event_bus: nil)
            stroma.settings[:actions][:publishable][:configurations] ||= []
            stroma.settings[:actions][:publishable][:configurations] << {
              event_name:,
              payload_method: with,
              event_bus:
            }
          end
        end

        module InstanceMethods
          private

          def call!(**)
            super

            configurations = self.class.stroma.settings[:actions][:publishable][:configurations] || []

            configurations.each do |config|
              event_name = config[:event_name]
              payload_method = config[:payload_method]
              event_bus = config[:event_bus]

              payload = payload_method.present? ? send(payload_method) : {}
              event_bus.publish(event_name, payload)
            end
          end
        end
      end
    end
  end
end
```

```ruby [Использование]
class UsersService::Create < ApplicationService::Base
  publishes :user_created, with: :user_payload, event_bus: EventPublisher

  input :email, type: String
  input :name, type: String

  output :user, type: User

  make :create_user

  private

  def create_user
    outputs.user = User.create!(email: inputs.email, name: inputs.name)
  end

  def user_payload
    { user_id: outputs.user.id, email: outputs.user.email }
  end
end
```

:::

### Rescue-паттерн

Обработка ошибок и выполнение очистки.

::: code-group

```ruby [extensions/rollbackable/dsl.rb]
module ApplicationService
  module Extensions
    module Rollbackable
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          def on_rollback(method_name)
            stroma.settings[:actions][:rollbackable][:method_name] = method_name
          end
        end

        module InstanceMethods
          private

          def call!(**)
            super
          rescue StandardError => e
            raise e if e.is_a?(Servactory::Exceptions::Success)

            method_name = self.class.stroma.settings[:actions][:rollbackable][:method_name]

            send(method_name) if method_name.present?

            raise
          end
        end
      end
    end
  end
end
```

```ruby [Использование]
class PaymentsService::Process < ApplicationService::Base
  on_rollback :cleanup_resources

  input :order, type: Order
  input :payment_method, type: PaymentMethod

  output :payment, type: Payment

  make :reserve_inventory
  make :charge_payment
  make :confirm_order

  private

  def reserve_inventory
    InventoryService::Reserve.call!(items: inputs.order.items)
  end

  def charge_payment
    result = PaymentsService::Charge.call!(
      payment_method: inputs.payment_method,
      amount: inputs.order.total_amount
    )
    outputs.payment = result.payment
  end

  def confirm_order
    inputs.order.confirm!
  end

  def cleanup_resources
    InventoryService::Release.call!(items: inputs.order.items)
    PaymentsService::Refund.call!(payment: outputs.payment) if outputs.payment.present?
  end
end
```

:::

## Миграция с 2.x

::: warning
`Servactory::DSL.with_extensions(...)` считается устаревшим и будет удалён в будущих релизах. Пожалуйста, мигрируйте на новый синтаксис с блоком `extensions do`.
:::

### Изменения синтаксиса

::: code-group

```ruby [2.x (устаревший)]
module ApplicationService
  class Base
    include Servactory::DSL.with_extensions(
      ApplicationService::Extensions::StatusActive::DSL
    )
  end
end
```

```ruby [3.0 (текущий)]
module ApplicationService
  class Base < Servactory::Base
    extensions do
      before :actions, ApplicationService::Extensions::StatusActive::DSL
    end
  end
end
```

:::

### Изменения хранения настроек

| Аспект | 2.x | 3.0 |
|--------|-----|-----|
| Хранение | `attr_accessor` (class instance variable) | `stroma.settings[:key][:ext][:setting]` |
| Доступ | `self.class.send(:var)` | `self.class.stroma.settings[:key][:ext][:setting]` |
| Наследование | Ручная обработка | Автоматическое глубокое копирование |

### Изменения кода расширений

::: code-group

```ruby [2.x (устаревший)]
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

    model_name = self.class.send(:status_active_model_name)
    # ...
  end
end
```

```ruby [3.0 (текущий)]
module ClassMethods
  private

  def status_active!(model_name)
    stroma.settings[:actions][:status_active][:model_name] = model_name
  end
end

module InstanceMethods
  private

  def call!(**)
    model_name = self.class.stroma.settings[:actions][:status_active][:model_name]
    # ...
    super
  end
end
```

:::
