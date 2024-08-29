---
title: Сериализация — Datory
description: Описание и примеры использования
prev: false
next: false
---

# Сериализация

## Пример

::: code-group

```ruby [Код]
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

```text [Таблица]
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

```text [Информация]
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

## Использование

### Подготовка данных

Для сериализации можно использовать следующий тип данных.

#### Метод `.new`

```ruby
serial = SerialDto.new(attributes)
```

#### ActiveRecord

```ruby
serial = Serial.find(id)
```

### Валидация

При сериализации в случае возникновения проблем будет выкинуто исключение.
Если необходимо обработать это поведение, то можно воспользоваться методом `form`.

Подготовленные данные необходимо передать в метод `form`:

```ruby
form = SerialDto.form(serial)
```

Провалидировать данные можно одним из следующий методов:

```ruby
form.valid? # => true
form.invalid? # => false
```

Получить информацию об объекте и модели можно с использованием этих методов:

```ruby
form.target # => SerialDto
form.model # => { ... }
```

Если необходимо обновить значение в модели, то для этого предназначены эти методы:

```ruby
form.update(title: "New title")

form.update_by(0, title: "New title") # Для коллекции
```

И, наконец, сериализации возможна через вызов метода `serialize`:

```ruby
form.serialize # => { ... }
```

### Вызов

В примере выше продемонстрирована сериализация из `form`.
Но это также возможно напрямую из класса DTO.
В таком случае при возникновении проблем будет выкинуто исключение `Datory::Exceptions::SerializationError`.

```ruby
SerialDto.serialize(serial) # => { ... }
```
