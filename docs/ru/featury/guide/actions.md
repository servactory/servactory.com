---
title: Действия над объектом Featury
description: Описание и примеры использования действий над объектом Featury
prev: false
next: false
---

# Действия

Для работы с фича-флагами через Featury необходимо создать действия.
Каждое действие предполагает реализацию логики над именами полученных фича-флагов и дополнительных опций.

## Пример

В качестве примера представим что у нас есть модель ActiveRecord, которая отвечает за все фича-флаги проекта.
Называется она `FeatureFlag`.

Также представим что для работы с фича-флагами в проекте нужно 4 действия:

- `enabled?`
- `disabled?`
- `enable`
- `disable`

В таком случае действия Featury будут выглядеть так:

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
  end
end
```

:::
