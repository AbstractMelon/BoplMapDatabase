# Sequence

In Lua, the term **sequence** is used to denote a table where the set of all positive numeric keys is equal to `{1..n}` for some integer `n`, which is called the length of the sequence.

## Example

```lua
local seq = { "apple", "banana", "cherry" }
for i = 1, #seq do
  print(seq[i])
end
```
