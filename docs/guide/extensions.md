---
title: Extensions
description: Description and examples of implementation of custom extensions
prev: RSpec Migration
next: Internationalization (I18n)
---

# Extensions <Badge type="tip" text="Since 2.0.0" />

Expand basic functionality by adding custom extensions.

Create extensions in the `app/services/application_service/extensions` directory.
Place each extension in its own subdirectory.

## Example of implementation

### Connecting

Add extensions via the `with_extensions` method.

::: code-group

```ruby [app/services/application_service/base.rb]
require_relative "extensions/status_active/dsl"

module ApplicationService
  class Base
    include Servactory::DSL.with_extensions(
      ApplicationService::Extensions::StatusActive::DSL
    )
  end
end
```

:::

### Extension code

::: code-group

```ruby [app/services/application_service/extensions/status_active/dsl.rb]
module ApplicationService
  module Extensions
    module StatusActive
      module DSL
        def self.included(base)
          base.extend(ClassMethods)
          base.include(InstanceMethods)
        end

        module ClassMethods
          private

          attr_accessor :status_active_model_name

          def status_active!(model_name)
            self.status_active_model_name = model_name
          end
        end

        module InstanceMethods
          private

          def call!(**)
            super

            status_active_model_name = self.class.send(:status_active_model_name)
            return if status_active_model_name.nil?

            is_active = inputs.send(status_active_model_name).active?
            return if is_active

            fail_input!(
              status_active_model_name,
              message: "#{status_active_model_name.to_s.camelize.singularize} is not active"
            )
          end
        end
      end
    end
  end
end
```

:::

### Usage

```ruby{5}
module PostsService
  class Create < ApplicationService::Base
    input :user, type: User

    status_active! :user
    
    make :something
    
    private

    def something
      # ...
    end
  end
end
```
