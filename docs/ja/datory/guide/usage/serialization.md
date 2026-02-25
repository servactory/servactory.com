---
title: シリアライゼーション — Datory
description: 説明と使用例
prev: false
next: false
---

# シリアライゼーション

## 例

::: code-group

```ruby [コード]
class SerialDto < Datory::Base
  uuid! :id

  string! :status
  string! :title

  one! :poster, include: ImageDto

  one! :ratings, include: RatingsDto

  many! :countries, include: CountryDto
  many! :genres, include: GenreDto
  many! :seasons, include: SeasonDto

  date! :premieredOn, to: :premiered_on
end
```

```text [テーブル]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
|                                         SerialDto                                         |
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
| Attribute   | From                         | To                 | As         | Include    |
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
| id          | String                       | id                 | String     |            |
| status      | String                       | status             | String     |            |
| title       | String                       | title              | String     |            |
| poster      | [ImageDto, Hash]   | poster  | [ImageDto, Hash]   | ImageDto   |            |
| ratings     | [RatingsDto, Hash] | ratings | [RatingsDto, Hash] | RatingsDto |            |
| countries   | Array                        | countries          | Array      | CountryDto |
| genres      | Array                        | genres             | Array      | GenreDto   |
| seasons     | Array                        | seasons            | Array      | SeasonDto  |
| premieredOn | String                       | premiered_on       | Date       |            |
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

```text [情報]
#<Datory::Info::Result:0x000000011f154418 
  @attributes=
    {:id=>
      {:from=>{:name=>:id, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>:uuid}, 
      :to=>{:name=>:id, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>:uuid, :required=>true, :default=>nil, :include=>nil}}, 
    :status=>
      {:from=>{:name=>:status, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil}, 
      :to=>{:name=>:status, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil, :required=>true, :default=>nil, :include=>nil}}, 
    :title=>
      {:from=>{:name=>:title, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil}, 
      :to=>{:name=>:title, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil, :required=>true, :default=>nil, :include=>nil}}, 
    :poster=>
      {:from=>{:name=>:poster, :type=>[ImageDto, Hash], :min=>nil, :max=>nil, :consists_of=>false, :format=>nil}, 
      :to=>{:name=>:poster, :type=>[ImageDto, Hash], :min=>nil, :max=>nil, :consists_of=>false, :format=>nil, :required=>true, :default=>nil, :include=>ImageDto}}, 
    :ratings=>
      {:from=>{:name=>:ratings, :type=>[RatingsDto, Hash], :min=>nil, :max=>nil, :consists_of=>false, :format=>nil}, 
      :to=>{:name=>:ratings, :type=>[RatingsDto, Hash], :min=>nil, :max=>nil, :consists_of=>false, :format=>nil, :required=>true, :default=>nil, :include=>RatingsDto}}, 
    :countries=>
      {:from=>{:name=>:countries, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[CountryDto, Hash], :format=>nil}, 
      :to=>{:name=>:countries, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[CountryDto, Hash], :format=>nil, :required=>true, :default=>nil, :include=>CountryDto}}, 
    :genres=>
      {:from=>{:name=>:genres, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[GenreDto, Hash], :format=>nil}, 
      :to=>{:name=>:genres, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[GenreDto, Hash], :format=>nil, :required=>true, :default=>nil, :include=>GenreDto}}, 
    :seasons=>
      {:from=>{:name=>:seasons, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[SeasonDto, Hash], :format=>nil}, 
      :to=>{:name=>:seasons, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[SeasonDto, Hash], :format=>nil, :required=>true, :default=>nil, :include=>SeasonDto}}, 
    :premieredOn=>
      {:from=>{:name=>:premieredOn, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>:date}, 
      :to=>{:name=>:premiered_on, :type=>Date, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil, :required=>true, :default=>nil, :include=>nil}}}>
```

:::

```ruby
class SeasonDto < Datory::Base
  uuid! :id
  uuid! :serialId, to: :serial_id

  integer! :number

  many! :episodes, include: EpisodeDto

  date! :premieredOn, to: :premiered_on
  date? :endedOn, to: :ended_on
end
```

## 使い方

### データの準備

シリアライゼーションには以下のデータ型を使用できます。

#### メソッド`.new`

```ruby
serial = SerialDto.new(attributes)
```

#### ActiveRecord

```ruby
serial = Serial.find(id)
```

### バリデーション

シリアライゼーション時に問題が発生した場合、例外がスローされます。
この動作をハンドリングする必要がある場合は、`form`メソッドを使用できます。

準備したデータを`form`メソッドに渡す必要があります:

```ruby
form = SerialDto.form(serial)
```

以下のメソッドのいずれかでデータをバリデーションできます:

```ruby
form.valid? # => true
form.invalid? # => false
```

オブジェクトとモデルの情報は以下のメソッドで取得できます:

```ruby
form.target # => SerialDto
form.model # => { ... }
```

モデルの値を更新する必要がある場合は、以下のメソッドを使用します:

```ruby
form.update(title: "New title")

form.update_by(0, title: "New title") # For collection
```

最後に、`serialize`メソッドを呼び出すことでシリアライゼーションが可能です:

```ruby
form.serialize # => { ... }
```

### 呼び出し

上記の例では`form`からのシリアライゼーションを示しています。
しかし、DTOクラスから直接行うことも可能です。
この場合、問題が発生すると`Datory::Exceptions::SerializationError`例外がスローされます。

```ruby
SerialDto.serialize(serial) # => { ... }
```
