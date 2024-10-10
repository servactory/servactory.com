---
title: Serialization — Datory
description: Description and examples of use
prev: false
next: false
---

# Serialization

## Example

::: code-group

```ruby [Code]
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

```text [Table]
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

```text [Info]
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

## Usage

### Data preparation

The following data type can be used for serialization.

#### Method `.new`

```ruby
serial = SerialDto.new(attributes)
```

#### ActiveRecord

```ruby
serial = Serial.find(id)
```

### Validation

When serializing, if problems occur, an exception will be thrown.
If you need to handle this behavior, you can use the `form` method.

The prepared data must be passed to the `form` method:

```ruby
form = SerialDto.form(serial)
```

You can validate the data using one of the following methods:

```ruby
form.valid? # => true
form.invalid? # => false
```

You can obtain information about an object and model using these methods:

```ruby
form.target # => SerialDto
form.model # => { ... }
```

If you need to update a value in the model, then these methods are intended for this:

```ruby
form.update(title: "New title")

form.update_by(0, title: "New title") # For collection
```

And finally, serialization is possible through calling the `serialize` method:

```ruby
form.serialize # => { ... }
```

### Call

The example above demonstrates serialization from `form`.
But this is also possible directly from the DTO class.
In this case, if problems arise, the exception `Datory::Exceptions::SerializationError` will be thrown.

```ruby
SerialDto.serialize(serial) # => { ... }
```
