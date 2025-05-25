---
title: Getting started — Datory
description: Description and examples of use
prev: false
next: false
---

# Getting started

## Version support

| Ruby/Rails  | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|-------------|---|---|---|---|---|---|---|---|---|
| 3.5 Preview | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1         | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Installation

Add this to `Gemfile`:

```ruby
gem "datory"
```

And execute:

```shell
bundle install
```

## Preparation

As a first step, it is recommended to prepare the base class for further inheritance.

### For DTOs

::: code-group

```ruby [app/dtos/application_dto/base.rb]
module ApplicationDTO
  class Base < Datory::Base
  end
end
```

:::

### For forms

::: code-group

```ruby [app/forms/application_form/base.rb]
module ApplicationForm
  class Base < Datory::Base
  end
end
```

:::
