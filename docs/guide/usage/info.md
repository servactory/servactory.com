---
title: Service information
description: Description and examples of use of obtaining information about the service
prev: Service result
next: Service input attributes
---

# Service information

From outside the service, you can get information about its input, internal and output attributes.

This can be useful, for example, when implementing complex service processing.
Or for testing.

For example, the service describes the following attributes:

```ruby
class BuildFullName < ApplicationService::Base
  input :first_name, type: String
  input :middle_name, type: String, required: false
  input :last_name, type: String

  internal :prepared_full_name, type: String

  output :full_name, type: String

  # ...
end
```

You can obtain information about them in the following ways:

```ruby
BuildFullName.info

# => #<Servactory::Info::Result:0x00000001118c7078 @inputs=[:first_name, :middle_name, :last_name], @internals=[:prepared_full_name], @outputs=[:full_name]>
```

```ruby
BuildFullName.info.inputs

# => [:first_name, :middle_name, :last_name]
```

```ruby
BuildFullName.info.internals

# => [:prepared_full_name]
```

```ruby
BuildFullName.info.outputs

# => [:full_name]
```
