---
title: Railsジェネレーター
description: Servactoryジェネレーターを使用してサービス、スペック、拡張機能を生成する
prev: 拡張機能
next: 国際化 (I18n)
---

# Railsジェネレーター

Servactoryは一般的なタスクのためのRailsジェネレーターを提供します。

## インストールジェネレーター <Badge type="tip" text="2.5.0以降" />

基本的なサービスインフラストラクチャをセットアップします。

```shell
bundle exec rails g servactory:install
```

### 生成されるファイル

| ファイル | 説明 |
|----------|------|
| `app/services/application_service/base.rb` | 基底サービスクラス |
| `app/services/application_service/exceptions.rb` | 例外クラス |
| `app/services/application_service/result.rb` | 結果クラス |

### オプション

| オプション | デフォルト | 説明 |
|------------|-----------|------|
| `--path` | `app/services` | 出力ディレクトリ |
| `--namespace` | `ApplicationService` | 基底ネームスペース |

### 例

```shell
# Default installation
bundle exec rails g servactory:install

# Custom namespace
bundle exec rails g servactory:install --namespace=MyApp::Services

# Custom path
bundle exec rails g servactory:install --path=lib/services
```

## サービスジェネレーター <Badge type="tip" text="2.5.0以降" />

型付きinputを持つ新しいサービスを作成します。

```shell
bundle exec rails g servactory:service NAME [inputs...]
```

### オプション

| オプション | デフォルト | 説明 |
|------------|-----------|------|
| `--path` | `app/services` | 出力ディレクトリ |

### 型のショートカット

| 構文 | 結果 |
|------|------|
| `name`または`name:string` | `input :name, type: String` |
| `age:integer` | `input :age, type: Integer` |
| `active:boolean` | `input :active, type: [TrueClass, FalseClass]` |
| `user:User` | `input :user, type: User` |
| `items:array` | `input :items, type: Array` |
| `data:hash` | `input :data, type: Hash` |

### 例

```shell
# Basic service
bundle exec rails g servactory:service users_service/create

# With typed inputs
bundle exec rails g servactory:service orders_service/process user:User amount:integer

# Nested namespace
bundle exec rails g servactory:service admin/reports/generate started_on:date ended_on:date
```

## RSpecジェネレーター <Badge type="tip" text="2.5.0以降" />

サービス用のRSpecテストファイルを作成します。

```shell
bundle exec rails g servactory:rspec NAME [inputs...]
```

### オプション

| オプション | デフォルト | 説明 |
|------------|-----------|------|
| `--path` | `spec/services` | 出力ディレクトリ |

### 例

```shell
# Generate spec matching service inputs
bundle exec rails g servactory:rspec users_service/create first_name last_name email

# For existing service
bundle exec rails g servactory:rspec orders_service/process
```

## 拡張機能ジェネレーター <Badge type="tip" text="3.0.0以降" />

新しい拡張機能モジュールを作成します。

```shell
bundle exec rails g servactory:extension NAME
```

### オプション

| オプション | デフォルト | 説明 |
|------------|-----------|------|
| `--path` | `app/services/application_service/extensions` | 出力ディレクトリ |
| `--namespace` | `ApplicationService` | 基底ネームスペース |

### 例

```shell
# Basic extension
bundle exec rails g servactory:extension Auditable

# Nested namespace
bundle exec rails g servactory:extension Admin::AuditTrail

# Custom path
bundle exec rails g servactory:extension Cacheable --path=lib/extensions
```

使用方法の詳細は[拡張機能](/ja/guide/extensions)を参照してください。
