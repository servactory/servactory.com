---
title: Information about Featury object
description: Description and examples of using the method to obtain information about a Featury object
prev: false
next: false
---

# Information about Featury object

Information can be obtained about each Featury object.

## Method `info`

```ruby [Example]
info = User::OnboardingFeature.info
```

```ruby
info.features # Feature flags of the current class.
info.groups   # Feature flag groups of the current class.
info.tree     # Tree of feature flags from the current class.
```
