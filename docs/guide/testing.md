---
title: Testing services
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
        exception: Servactory::Errors::Failure.new(
          message: "Some error"
        )
      )
    )
  )
end
```

### Examples for Rspec

```ruby title="support/shared_examples/input_required_check.rb"
RSpec.shared_examples "input required check" do |name:, custom_message: nil|
  describe "is not passed" do
    let(name) { nil }

    it "returns expected error" do
      expect { perform(attributes:) }.to(
        raise_input_error_for(
          check_name: :required,
          name:,
          service_class_name: described_class.name,
          custom_message:
        )
      )
    end
  end
end
```

```ruby title="support/shared_examples/input_type_check.rb"
RSpec.shared_examples "input type check" do |name:, expected_type:, array: false, array_message: nil|
  describe "is of the wrong type" do
    let(name) { array ? Array(Servactory::TestKit::FakeType.new) : Servactory::TestKit::FakeType.new }

    it "returns expected error" do
      expect { perform(attributes:) }.to(
        raise_input_error_for(
          check_name: :type,
          name:,
          service_class_name: described_class.name,
          array:,
          array_message:,
          expected_type:,
          given_type: Servactory::TestKit::FakeType
        )
      )
    end
  end
end
```

```ruby title="support/input_attribute_helper.rb"
module InputAttributeHelper
  extend self

  # rubocop:disable Metrics/ParameterLists
  def raise_input_error_for(
    check_name:,
    name:,
    service_class_name:,
    custom_message: nil,
    array: false,
    array_message: nil,
    expected_type: nil,
    given_type: nil
  ) # do
    raise_error(
      Codexoptimus::Fido::Services::ApplicationService::Errors::InputError,
      prepare_input_text_for(
        check_name:,
        name:,
        service_class_name:,
        custom_message:,
        array:,
        array_message:,
        expected_type:,
        given_type:
      )
    )
  end
  # rubocop:enable Metrics/ParameterLists

  # rubocop:disable Metrics/ParameterLists, Metrics/MethodLength
  def prepare_input_text_for(
    check_name:,
    name:,
    service_class_name:,
    custom_message: nil,
    array: false,
    array_message: nil,
    expected_type: nil,
    given_type: nil
  ) # do
    case check_name.to_sym
    when :required
      prepare_input_required_check_text_for(
        name:,
        service_class_name:,
        custom_message:
      )
    when :type
      prepare_input_type_check_text_for(
        name:,
        service_class_name:,
        array:,
        array_message:,
        expected_type:,
        given_type:
      )
    else
      raise "Non-existent `check_name` to generate the error text"
    end
  end
  # rubocop:enable Metrics/ParameterLists, Metrics/MethodLength

  private

  def prepare_input_required_check_text_for(name:, service_class_name:, custom_message:)
    custom_message.presence || "[#{service_class_name}] Required input `#{name}` is missing"
  end

  def prepare_input_type_check_text_for(
    name:,
    service_class_name:,
    array:,
    array_message:,
    expected_type:,
    given_type:
  ) # do
    expected_type = expected_type.join(", ") if expected_type.is_a?(Array)

    if array
      (
        array_message.presence ||
          "[#{service_class_name}] Wrong type in input array `#{name}`, expected `#{expected_type}`"
      )
    else
      "[#{service_class_name}] Wrong type of input `#{name}`, expected `#{expected_type}`, got `#{given_type}`"
    end
  end
end

RSpec.configure do |config|
  config.include InputAttributeHelper
end
```
