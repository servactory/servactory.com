---
title: Rails Generators
description: Generate services, specs, and extensions using Servactory generators
prev: Extensions
next: Internationalization (I18n)
---

# Rails Generators

Servactory provides Rails generators for common tasks.

## Installation generator <Badge type="tip" text="Since 2.5.0" />

Sets up the base service infrastructure.

```shell
bundle exec rails g servactory:install
```

### Generated files

| File | Description |
|------|-------------|
| `app/services/application_service/base.rb` | Base service class |
| `app/services/application_service/exceptions.rb` | Exception classes |
| `app/services/application_service/result.rb` | Result class |

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--path` | `app/services` | Output directory |
| `--namespace` | `ApplicationService` | Base namespace |

### Examples

```shell
# Default installation
bundle exec rails g servactory:install

# Custom namespace
bundle exec rails g servactory:install --namespace=MyApp::Services

# Custom path
bundle exec rails g servactory:install --path=lib/services
```

## Service generator <Badge type="tip" text="Since 2.5.0" />

Creates a new service with typed inputs.

```shell
bundle exec rails g servactory:service NAME [inputs...]
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--path` | `app/services` | Output directory |

### Type shortcuts

| Syntax | Result |
|--------|--------|
| `name` or `name:string` | `input :name, type: String` |
| `age:integer` | `input :age, type: Integer` |
| `active:boolean` | `input :active, type: [TrueClass, FalseClass]` |
| `user:User` | `input :user, type: User` |
| `items:array` | `input :items, type: Array` |
| `data:hash` | `input :data, type: Hash` |

### Examples

```shell
# Basic service
bundle exec rails g servactory:service users_service/create

# With typed inputs
bundle exec rails g servactory:service orders_service/process user:User amount:integer

# Nested namespace
bundle exec rails g servactory:service admin/reports/generate started_on:date ended_on:date
```

## RSpec generator <Badge type="tip" text="Since 2.5.0" />

Creates an RSpec test file for a service.

```shell
bundle exec rails g servactory:rspec NAME [inputs...]
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--path` | `spec/services` | Output directory |

### Examples

```shell
# Generate spec matching service inputs
bundle exec rails g servactory:rspec users_service/create first_name last_name email

# For existing service
bundle exec rails g servactory:rspec orders_service/process
```

## Extension generator <Badge type="tip" text="Since 3.0.0" />

Creates a new extension module.

```shell
bundle exec rails g servactory:extension NAME
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--path` | `app/services/application_service/extensions` | Output directory |
| `--namespace` | `ApplicationService` | Base namespace |

### Examples

```shell
# Basic extension
bundle exec rails g servactory:extension Auditable

# Nested namespace
bundle exec rails g servactory:extension Admin::AuditTrail

# Custom path
bundle exec rails g servactory:extension Cacheable --path=lib/extensions
```

See [Extensions](/guide/extensions) for usage details.
