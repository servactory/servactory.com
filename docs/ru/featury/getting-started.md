---
title: Начало работы с Featury
description: Требования, соглашения, установка и пример базовой подготовки
prev: false
next: false
---

# Начало работы с Featury

## Соглашения

- Все классы фичей являются подклассами `Featury::Base` и располагаются в директории `app/features`. Общепринятой практикой является создание и наследование от класса `ApplicationFeature::Base`, который является подклассом `Featury::Base`.
- Называйте фичи по тому, к процессу которому они относятся. Используйте существительные в именах, а также старайтесь по возможности приравнивать к именам моделей. Например, назовите класс фичи `User::OnboardingFeature` вместо `User::OnboardFeature`.

## Поддержка версий

| Ruby/Rails  | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|-------------|---|---|---|---|---|---|---|---|---|
| 3.5 Preview | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1         | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Установка

Добавьте это в файл `Gemfile`:

```ruby
gem "featury"
```

Затем выполните:

```shell
bundle install
```

## Подготовка

Для начала рекомендуется подготовить базовый класс для дальнейшего наследования.
Этот базовый класс должен внутри себя содержать действия с интеграцией инструмента для фичей в проекте.
Например, это может быть модель ActiveRecord, Flipper или что-нибудь другое.

### Модель ActiveRecord

В качестве примера будет использоваться модель `FeatureFlag`.

::: code-group

```ruby [app/features/application_feature/base.rb]
module ApplicationFeature
  class Base < Featury::Base
    action :enabled? do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .enabled?
      end
    end

    action :disabled? do |features:, **options|
      features.any? do |feature|
        !FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .enabled?
      end
    end

    action :enable do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .update!(enabled: true)
      end
    end

    action :disable do |features:, **options|
      features.all? do |feature|
        FeatureFlag
          .find_or_create_by!(code: feature, actor: options[:user])
          .update!(enabled: false)
      end
    end

    before do |action:, features:|
      Slack::API::Notify.call!(action:, features:)
    end

    after :enabled?, :disabled? do |action:, features:|
      Slack::API::Notify.call!(action:, features:)
    end
  end
end
```

:::
