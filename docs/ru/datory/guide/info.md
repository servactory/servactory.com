---
title: Информация — Datory
description: Описание и примеры использования
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

## Метод `describe`

::: code-group

```ruby [Пример]
SerialDto.describe
```

```text [Результат]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
|                                 SerialDto                                  |
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
| Attribute    | From   | To           | As                     | Include    |
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
| id           | String | id           | String                 |            |
| status       | String | status       | String                 |            |
| title        | String | title        | String                 |            |
| poster       | Hash   | poster       | [Datory::Result, Hash] | ImageDto   |
| countries    | Array  | countries    | Array                  | CountryDto |
| genres       | Array  | genres       | Array                  | GenreDto   |
| seasons      | Array  | seasons      | Array                  | SeasonDto  |
| premiered_on | String | premiered_on | Date                   |            |
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

:::
