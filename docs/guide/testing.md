---
title: Testing services
description: Information about testing services
prev: Internationalization (I18n)
next: false
---

# Testing services

Testing Servactory services is the same as testing regular Ruby classes.

## TestKit

### Servactory::TestKit::FakeType

For negative testing of input attribute types, Servactory provides the `Servactory::TestKit::FakeType` class.

### Servactory::TestKit::Result

To stub the result of services, Servactory provides a special class `Servactory::TestKit::Result`.

```ruby
before do
  allow(UsersService::Create).to(
    receive(:call).and_return(Servactory::TestKit::Result.as_success)
  )
end
```

```ruby
before do
  allow(UsersService::Create).to(
    receive(:call).and_return(
      Servactory::TestKit::Result.as_failure(
        exception: Servactory::Exceptions::Failure.new(
          message: "Some error"
        )
      )
    )
  )
end
```

### Examples for Rspec

::: code-group

```ruby [spec/support/shared_examples/input_required_check.rb]
RSpec.shared_examples "input required check" do |name:, custom_message: nil|
  describe "is not passed" do
    let(name) { nil }

    it "returns expected error" do
      expect { perform }.to(
        raise_input_error_for(
          check_name: :required,
          name: name,
          service_class_name: described_class.name,
          custom_message: custom_message
        )
      )
    end
  end
end
```

:::

::: code-group

```ruby [spec/support/shared_examples/input_type_check.rb]
RSpec.shared_examples "input type check" do |name:, expected_type:, collection: false, collection_message: nil|
  describe "is of the wrong type" do
    let(name) do
      if collection == Array
        Array(Servactory::TestKit::FakeType.new)
      elsif collection == Set
        Set[Servactory::TestKit::FakeType.new]
      else
        Servactory::TestKit::FakeType.new
      end
    end

    it "returns expected error" do
      expect { perform }.to(
        raise_input_error_for(
          check_name: :type,
          name: name,
          service_class_name: described_class.name,
          collection: collection,
          collection_message: collection_message,
          expected_type: expected_type,
          given_type: Servactory::TestKit::FakeType
        )
      )
    end
  end
end
```

:::

::: code-group

```ruby [spec/support/input_attribute_helper.rb]
module InputAttributeHelper
  extend self

  # rubocop:disable Metrics/MethodLength
  def raise_input_error_for(
    check_name:,
    name:,
    service_class_name:,
    custom_message: nil,
    collection: false,
    collection_message: nil,
    expected_type: nil,
    given_type: nil
  ) # do
    raise_error(
      ApplicationService::Exceptions::Input,
      prepare_input_text_for(
        check_name: check_name,
        name: name,
        service_class_name: service_class_name,
        custom_message: custom_message,
        collection: collection,
        collection_message: collection_message,
        expected_type: expected_type,
        given_type: given_type
      )
    )
  end
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  def prepare_input_text_for(
    check_name:,
    name:,
    service_class_name:,
    custom_message: nil,
    collection: false,
    collection_message: nil,
    expected_type: nil,
    given_type: nil
  ) # do
    case check_name.to_sym
    when :required
      prepare_input_required_check_text_for(
        name: name,
        service_class_name: service_class_name,
        custom_message: custom_message
      )
    when :type
      prepare_input_type_check_text_for(
        name: name,
        service_class_name: service_class_name,
        collection: collection,
        collection_message: collection_message,
        expected_type: expected_type,
        given_type: given_type
      )
    else
      raise "Non-existent `check_name` to generate the error text"
    end
  end
  # rubocop:enable Metrics/MethodLength

  private

  def prepare_input_required_check_text_for(name:, service_class_name:, custom_message:)
    custom_message.presence || "[#{service_class_name}] Required input `#{name}` is missing"
  end

  # rubocop:disable Metrics/MethodLength
  def prepare_input_type_check_text_for(
    name:,
    service_class_name:,
    collection:,
    collection_message:,
    expected_type:,
    given_type:
  ) # do
    expected_type = expected_type.join(", ") if expected_type.is_a?(Array)

    if collection
      if collection_message.present?
        collection_message
      else
        "[#{service_class_name}] Wrong type in input collection `#{name}`, " \
          "expected `#{expected_type}`, got `#{given_type}`"
      end
    else
      "[#{service_class_name}] Wrong type of input `#{name}`, expected `#{expected_type}`, got `#{given_type}`"
    end
  end
  # rubocop:enable Metrics/MethodLength
end

RSpec.configure do |config|
  config.include InputAttributeHelper
end
```

:::
