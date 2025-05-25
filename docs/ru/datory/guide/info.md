---
title: Информация об объекте Datory
description: Описание и примеры использования получения информации об объекте Datory
prev: false
next: false
---

# Информация

О каждом объекте Datory можно получить информацию.
Для этого существует два варианта.

## Метод `info`

::: code-group

```ruby [Пример]
SerialDto.info
```

```text [Результат]
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

## Метод `describe`

::: code-group

```ruby [Пример]
SerialDto.describe
```

```text [Результат]
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

:::
