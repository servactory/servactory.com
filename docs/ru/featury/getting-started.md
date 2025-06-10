---
title: Начало работы с Featury
description: Руководство по установке и настройке Featury
prev: false
next: false
---

# Начало работы с Featury

## Что такое Featury?

Featury — это библиотека для управления функциональными флагами (feature flags) в Ruby/Rails приложениях. Она предоставляет удобный API для работы с фича-флагами и их группами.

## Соглашения по разработке

Featury следует определенным соглашениям для обеспечения единообразия кода:

- Все классы фичей должны наследоваться от `Featury::Base` и размещаться в директории `app/features`
- Рекомендуется создавать базовый класс `ApplicationFeature::Base`, наследующийся от `Featury::Base`
- Имена фичей должны отражать их принадлежность к процессу
- Используйте существительные в именах фичей (например, `User::OnboardingFeature` вместо `User::OnboardFeature`)

## Поддержка версий

Featury поддерживает следующие версии Ruby и Rails:

| Ruby/Rails  | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|-------------|---|---|---|---|---|---|---|---|---|
| 3.5 Preview | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1         | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Установка

### Добавление гема

Добавьте Featury в ваш `Gemfile`:

```ruby
gem "featury"
```

### Установка зависимостей

Выполните команду для установки гема:

```shell
bundle install
```

## Подготовка окружения

### Создание базового класса

Для начала рекомендуется подготовить базовый класс для дальнейшего наследования.
Этот базовый класс должен внутри себя содержать действия с интеграцией инструмента для фичей в проекте.
Например, это может быть модель ActiveRecord, Flipper или что-нибудь другое.

### Пример с ActiveRecord

В качестве примера будет использоваться модель `FeatureFlag`:

::: code-group

```ruby [app/features/application_feature/base.rb]
module ApplicationFeature
  class Base < Featury::Base
    # Проверка включения фичи
    action :enabled? do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .enabled?
      end
    end

    # Проверка выключения фичи
    action :disabled? do |features:, **options|
      features.any? do |feature|
        !FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .enabled?
      end
    end

    # Включение фичи
    action :enable do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .update!(enabled: true)
      end
    end

    # Выключение фичи
    action :disable do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .update!(enabled: false)
      end
    end

    # Хук перед выполнением любого действия
    before do |action:, features:|
      Slack::API::Notify.call!(action:, features:)
    end

    # Хук после выполнения действий enabled? и disabled?
    after :enabled?, :disabled? do |action:, features:|
      Slack::API::Notify.call!(action:, features:)
    end
  end
end
```

:::

## Создание первой фичи

### Пример фичи

```ruby
class User::OnboardingFeature < ApplicationFeature::Base
  # Префикс для фича-флагов
  prefix :onboarding

  # Ресурс пользователя
  resource :user, type: User

  # Условие для работы с фичей
  condition ->(resources:) { resources.user.onboarding_awaiting? }

  # Набор фича-флагов
  features :passage, :integration

  # Группы фича-флагов
  groups BillingFeature,
         PaymentSystemFeature
end
```

### Использование

```ruby
# Проверка включения фичи
User::OnboardingFeature.enabled?(user: current_user)

# Включение фичи
User::OnboardingFeature.enable(user: current_user)

# Проверка выключения фичи
User::OnboardingFeature.disabled?(user: current_user)

# Выключение фичи
User::OnboardingFeature.disable(user: current_user)
```
