---
title: Информация об объекте Featury
description: Описание и примеры использования получения информации об объекте Featury
prev: false
next: false
---

# Информация об объекте Featury

О каждом объекте Featury можно получить информацию.

## Метод `info`

```ruby [Пример]
info = User::OnboardingFeature.info
```

```ruby
info.features # Фича-флаги текущего класса.
info.groups   # Группы фича-флагов текущего класса.
info.tree     # Дерево фича-флагов из текущего класса.
```
