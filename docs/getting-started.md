---
title: Getting started
description: Requirements, conventions, installation and example of basic preparation
prev: Why Servactory
next: Service call and result of work
---

# Getting started with Servactory

## Conventions

- All services are subclasses of `Servactory::Base` and are located in the `app/services` directory. It is common practice to create and inherit from `ApplicationService::Base` class, which is a subclass of `Servactory::Base`.
- Name services by what they do, not by what they accept. Use verbs in names. For example, `UsersService::Create` instead of `UsersService::Creation`.

## Version support

| Ruby/Rails  | 8.1 | 8.0 | 7.2 | 7.1 | 7.0 | 6.1 | 6.0 | 5.2 | 5.1 | 5.0 |
|-------------|---|---|---|---|---|---|---|---|---|---|
| 4.0 Preview | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.5 Preview | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3.4         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.3         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.2         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 3.1         | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

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

As a first step, it is recommended to prepare the base class for further inheritance.

### Automatically <Badge type="tip" text="Since 2.5.0" />

To quickly prepare your environment for work, you can use the rake task:

```shell
bundle exec rails g servactory:install
```

This will create all the necessary files.

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

Now you can create your first service.
To do this, you can use the rake task:

```shell
bundle exec rails g servactory:service users_service/create first_name middle_name last_name
```

You can also immediately prepare a spec file for testing the service:

```shell
bundle exec rails g servactory:rspec users_service/create first_name middle_name last_name
```
