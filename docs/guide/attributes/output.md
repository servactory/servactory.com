---
title: Service output attributes
description: Description and examples of using output attributes of service
prev: Service internal attributes
next:  Service actions
---

# Output attributes

All attributes that the service should return as a result through the `Result` class must be added using the `output` method.

## Usage

The assignment and use of service output attributes is done through the `outputs=`/`outputs` methods.

```ruby
class UsersService::Create < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String
  input :last_name, type: String

  output :full_name, type: String

  # ...

  def assign_full_name
    outputs.full_name = [
      inputs.first_name,
      inputs.middle_name,
      inputs.last_name
    ].join(" ")
  end
end
```

## Options

### Option `type`

This option is validation.
It will check that the passed value corresponds to the specified type (class).
In this case `is_a?` method is used.

```ruby{4,11}
class NotificationsService::Create < ApplicationService::Base
  input :user, type: User

  output :notification, type: Notification

  make :create_notification!
  
  private
  
  def create_notification!
    outputs.notification = Notification.create!(user: inputs.user)
  end
end
```

## Operating modes

The operating mode of an output attribute depends on its type.
Each operating mode has a set of its own options.

### Collection mode

To enable collection mode, you must specify `Array` or `Set` as the type of the output attribute.
You can also specify your own type for project purposes through the use of the `collection_mode_class_names` configuration.

#### Options

##### Option `consists_of`

This option is validation.
It will check that each value in the collection matches the specified type (class).
The `is_a?` method is used.

Explicit use of this option is optional.
The default value is `String`.

```ruby
output :ids,
       type: Array,
       consists_of: String
```

### Hash mode

To enable hash mode, you must specify `Hash` as the type of the output attribute.
You can also specify your own type for project purposes through the use of the `hash_mode_class_names` configuration.

#### Options

##### Option `schema`

This option is validation.
Requires a hash value that must describe the value structure of the output attribute.

Explicit use of this option is optional.
If the schema value is not specified, the validation will be skipped.
By default, no value is specified.

```ruby
output :payload,
       type: Hash,
       schema: {
         request_id: { type: String, required: true },
         user: {
           type: Hash,
           required: true,
           first_name: { type: String, required: true },
           middle_name: { type: String, required: false, default: "<unknown>" },
           last_name: { type: String, required: true },
           pass: {
             type: Hash,
             required: true,
             series: { type: String, required: true },
             number: { type: String, required: true }
           }
         }
       }
```

Each expected hash key must be described in the following format:

```ruby
{
  request_id: { type: String, required: true }
}
```

The following options are allowed: `type`, `required` and the optional `default`.

If the `type` value is `Hash`, then nesting can be described in the same format.

## Predicate methods

Any output attribute can be accessed as a predicate method.


```ruby{8}
# ...

output :full_name, type: String

# ...

def something
  return unless outputs.full_name? # instead of `outputs.full_name.present?`

  # ...
end
```

## Advanced mode

Advanced mode involves more detailed work with the attribute option.

### Option `consists_of`

Option from [collection mode](../attributes/output#collection-mode).

```ruby
output :ids,
       type: Array,
       consists_of: {
         type: String,
         message: "ID can only be of String type"
       }
```

```ruby
output :ids,
       type: Array,
       # The default array element type is String
       consists_of: {
         message: "ID can only be of String type"
       }
```
