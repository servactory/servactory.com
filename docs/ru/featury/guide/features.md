---
title: Фича объект Featury
description: Описание и примеры использования объекта фичи Featury
prev: false
next: false
---

# Фича объект Featury

Фича объект может содержать работу как с одним конкретным фича-флагом,
так и с несколькими фича-флагами.
Несколько фича-флагов также могут быть представлены в виде группы — вложенном объекте фичи.

## Префикс

Объект фичи всегда имеет префикс.
По умолчанию он собирается на основе имени класса объекта фичи.
Например, для `User::OnboardingFeature` по умолчанию префикс будет иметь значение `user_onboarding`.

Изменить префикс можно при помощи метода `prefix`:

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding # [!code focus]
  
  # ...
end
```

## Ресурсы

Объект фичи может ожидать на вход передачу ресурса.
Эти ресурсы могут быть использованы в действиях в качестве дополнения для работы с фича-флагами.

### Опции

#### Опция `option`

Делает ресурс необязательным для вызова объекта фичи.
По умолчанию `false`.

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User, option: true # [!code focus]

  # ...
end
```

#### Опция `nested`

Передает ресурс во вложенные объекты фичей через `groups`.
По умолчанию `false`.

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User, nested: true # [!code focus]

  # ...
end
```

## Условие

Объект фичи может содержать в себе базовое условие для работы.
Например, это может быть полезно если нужно позволить работу с ресурсом только в определенном состоянии.

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? } # [!code focus]

  # ...
end
```

## Набор фичей

В рамках одного объекта фичи можно указать один фича-флаг или несколько фича-флагов.

::: code-group

```ruby [Один]
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? }

  features :passage # [!code focus]
end

```

```ruby [Несколько]
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? }

  features :passage, :integration # [!code focus]
end
```

:::

Вместе с префиксом `onboarding`, пример которого представлен выше, будут собираться эти фича-флаги:

::: code-group

```ruby [Один]
# => onboarding_passage
```

```ruby [Несколько]
# => onboarding_passage
# => onboarding_integration
```

:::

## Группы наборов фичей

```ruby
class User::OnboardingFeature < ApplicationFeature
  prefix :onboarding

  resource :user, type: User

  condition ->(resources:) { resources.user.onboarding_awaiting? }

  features :passage

  groups BillingFeature, # [!code focus]
         PaymentSystemFeature # [!code focus]
end
