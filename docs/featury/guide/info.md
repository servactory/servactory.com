---
title: Featury Object Information
description: Description and examples of getting information about features in Featury
prev: false
next: false
---

# Featury Object Information

Featury provides methods for getting information about features and their structure. This can be useful for debugging, documentation, and validation.

## `info` method

The `info` method returns detailed information about a feature, including all feature flags and groups.

```ruby [Example]
info = User::OnboardingFeature.info
```

```ruby
info.features # Feature flags of the current class.
info.groups   # Feature flag groups of the current class.
info.tree     # Feature flag tree from the current class.
```
