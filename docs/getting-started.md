---
title: Getting started
description: Requirements, conventions, installation and example of basic preparation
prev: Why Servactory
next: Service call and result of work
---

# Getting started with Servactory

## Conventions

- Services inherit from `Servactory::Base` and reside in `app/services`. Common practice: create `ApplicationService::Base` as your project's base class.
- Name services by what they do, not what they accept. Use verbs. Example: `UsersService::Create` instead of `UsersService::Creation`.

## Version support

| Ruby/Rails | 8.1 | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|------------|---|---|---|---|---|---|---|---|---|---|
| 4.0        | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1        | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Installation

Add this to `Gemfile`:

```ruby
gem "servactory"
```

And execute:

```shell
bundle install
```

## Preparation

First, prepare the base class for inheritance.

### Automatically <Badge type="tip" text="Since 2.5.0" />

Run the generator:

```shell
bundle exec rails g servactory:install
```

This creates all necessary files.

See [Rails Generators](/guide/rails/generators) for all available options and generators.

### Manually

#### ApplicationService::Exceptions

::: code-group

```ruby [app/services/application_service/exceptions.rb]
module ApplicationService
  module Exceptions
    class Input < Servactory::Exceptions::Input; end
    class Output < Servactory::Exceptions::Output; end
    class Internal < Servactory::Exceptions::Internal; end

    class Failure < Servactory::Exceptions::Failure; end
  end
end
```

:::

#### ApplicationService::Result <Badge type="tip" text="Since 2.5.0" />

::: code-group

```ruby [app/services/application_service/result.rb]
module ApplicationService
  class Result < Servactory::Result; end
end
```

:::

#### ApplicationService::Base

::: code-group

```ruby [app/services/application_service/base.rb]
module ApplicationService
  class Base < Servactory::Base
    configuration do
      input_exception_class ApplicationService::Exceptions::Input
      internal_exception_class ApplicationService::Exceptions::Internal
      output_exception_class ApplicationService::Exceptions::Output

      failure_class ApplicationService::Exceptions::Failure

      result_class ApplicationService::Result
    end
  end
end
```

:::

## First service

Create your first service:

```shell
bundle exec rails g servactory:service users_service/create first_name middle_name last_name
```

Generate a spec file:

```shell
bundle exec rails g servactory:rspec users_service/create first_name middle_name last_name
```
