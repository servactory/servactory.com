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
  uuid :id

  string :status
  string :title

  one :poster, include: ImageDto
  one :ratings, include: RatingsDto

  many :countries, include: CountryDto
  many :genres, include: GenreDto
  many :seasons, include: SeasonDto

  date :premiered_on
end
```

```text [Таблица]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
|                                        SerialDto                                        |
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
| Attribute   | From   | To           | As                     | Include                  |
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
| id          | String | id           | String                 |                          |
| status      | String | status       | String                 |                          |
| title       | String | title        | String                 |                          |
| poster      | Hash   | poster       | [Datory::Result, Hash] | Usual::Example1::Image   |
| ratings     | Hash   | ratings      | [Datory::Result, Hash] | Usual::Example1::Ratings |
| countries   | Array  | countries    | Array                  | Usual::Example1::Country |
| genres      | Array  | genres       | Array                  | Usual::Example1::Genre   |
| seasons     | Array  | seasons      | Array                  | Usual::Example1::Season  |
| premieredOn | String | premiered_on | Date                   |                          |
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

```text [Информация]
#<Datory::Info::Result:0x000000012b8426b0
 @attributes=
  {:id=>
    {:from=>{:name=>:id, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>:uuid},
     :to=>{:name=>:id, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>:uuid, :required=>true, :include=>nil}},
   :status=>
    {:from=>{:name=>:status, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil},
     :to=>{:name=>:status, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil, :required=>true, :include=>nil}},
   :title=>
    {:from=>{:name=>:title, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil},
     :to=>{:name=>:title, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil, :required=>true, :include=>nil}},
   :poster=>
    {:from=>{:name=>:poster, :type=>Hash, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil},
     :to=>{:name=>:poster, :type=>[Datory::Result, Hash], :min=>nil, :max=>nil, :consists_of=>false, :format=>nil, :required=>true, :include=>ImageDto}},
   :ratings=>
    {:from=>{:name=>:ratings, :type=>Hash, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil}, 
     :to=>{:name=>:ratings, :type=>[Datory::Result, Hash], :min=>nil, :max=>nil, :consists_of=>false, :format=>nil, :required=>true, :include=>Usual::Example1::Ratings}}, 
   :countries=>
    {:from=>{:name=>:countries, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[Datory::Result, Hash], :format=>nil},
     :to=>{:name=>:countries, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[Datory::Result, Hash], :format=>nil, :required=>true, :include=>CountryDto}},
   :genres=>
    {:from=>{:name=>:genres, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[Datory::Result, Hash], :format=>nil},
     :to=>{:name=>:genres, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[Datory::Result, Hash], :format=>nil, :required=>true, :include=>GenreDto}},
   :seasons=>
    {:from=>{:name=>:seasons, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[Datory::Result, Hash], :format=>nil},
     :to=>{:name=>:seasons, :type=>Array, :min=>nil, :max=>nil, :consists_of=>[Datory::Result, Hash], :format=>nil, :required=>true, :include=>SeasonDto}},
   :premiered_on=>
    {:from=>{:name=>:premiered_on, :type=>String, :min=>nil, :max=>nil, :consists_of=>false, :format=>:date},
     :to=>{:name=>:premiered_on, :type=>Date, :min=>nil, :max=>nil, :consists_of=>false, :format=>nil, :required=>true, :include=>nil}}}>
```

:::

```ruby
class SeasonDto < Datory::Base
  uuid :id
  uuid :serial_id

  integer :number

  many :episodes, include: EpisodeDto

  date :premiered_on
end
```

## Использование

### Подготовка данных

Для сериализации можно использовать следующий тип данных.

#### Метод `.to_model`

```ruby
serial = SerialDto.to_model(attributes)
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
