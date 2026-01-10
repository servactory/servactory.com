---
title: Генераторы Rails
description: Генерация сервисов, тестов и расширений с помощью генераторов Servactory
prev: Расширения
next: Интернационализация (I18n)
---

# Генераторы Rails

Servactory предоставляет генераторы Rails для типовых задач.

## Генератор установки <Badge type="tip" text="Начиная с 2.5.0" />

Создаёт базовую инфраструктуру сервисов.

```shell
bundle exec rails g servactory:install
```

### Создаваемые файлы

| Файл | Описание |
|------|----------|
| `app/services/application_service/base.rb` | Базовый класс сервиса |
| `app/services/application_service/exceptions.rb` | Классы исключений |
| `app/services/application_service/result.rb` | Класс результата |

### Опции

| Опция | По умолчанию | Описание |
|-------|--------------|----------|
| `--path` | `app/services` | Директория вывода |
| `--namespace` | `ApplicationService` | Базовый namespace |

### Примеры

```shell
# Установка по умолчанию
bundle exec rails g servactory:install

# Пользовательский namespace
bundle exec rails g servactory:install --namespace=MyApp::Services

# Пользовательский путь
bundle exec rails g servactory:install --path=lib/services
```

## Генератор сервисов <Badge type="tip" text="Начиная с 2.5.0" />

Создаёт новый сервис с типизированными входными данными.

```shell
bundle exec rails g servactory:service NAME [inputs...]
```

### Опции

| Опция | По умолчанию | Описание |
|-------|--------------|----------|
| `--path` | `app/services` | Директория вывода |

### Сокращения типов

| Синтаксис | Результат |
|-----------|-----------|
| `name` или `name:string` | `input :name, type: String` |
| `age:integer` | `input :age, type: Integer` |
| `active:boolean` | `input :active, type: [TrueClass, FalseClass]` |
| `user:User` | `input :user, type: User` |
| `items:array` | `input :items, type: Array` |
| `data:hash` | `input :data, type: Hash` |

### Примеры

```shell
# Базовый сервис
bundle exec rails g servactory:service users_service/create

# С типизированными входными данными
bundle exec rails g servactory:service orders_service/process user:User amount:integer

# Вложенный namespace
bundle exec rails g servactory:service admin/reports/generate started_on:date ended_on:date
```

## Генератор RSpec <Badge type="tip" text="Начиная с 2.5.0" />

Создаёт файл RSpec теста для сервиса.

```shell
bundle exec rails g servactory:rspec NAME [inputs...]
```

### Опции

| Опция | По умолчанию | Описание |
|-------|--------------|----------|
| `--path` | `spec/services` | Директория вывода |

### Примеры

```shell
# Генерация спеки с входными данными сервиса
bundle exec rails g servactory:rspec users_service/create first_name last_name email

# Для существующего сервиса
bundle exec rails g servactory:rspec orders_service/process
```

## Генератор расширений <Badge type="tip" text="Начиная с 3.0.0" />

Создаёт новый модуль расширения.

```shell
bundle exec rails g servactory:extension NAME
```

### Опции

| Опция | По умолчанию | Описание |
|-------|--------------|----------|
| `--path` | `app/services/application_service/extensions` | Директория вывода |
| `--namespace` | `ApplicationService` | Базовый namespace |

### Примеры

```shell
# Базовое расширение
bundle exec rails g servactory:extension Auditable

# Вложенный namespace
bundle exec rails g servactory:extension Admin::AuditTrail

# Пользовательский путь
bundle exec rails g servactory:extension Cacheable --path=lib/extensions
```

Подробнее об использовании см. в разделе [Расширения](/ru/guide/extensions).
