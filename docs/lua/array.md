# Array

In Lua, the term **array** is used to denote a table where the set of all positive numeric keys is equal to `{1..n}` for some integer `n`, which is called the length of the sequence.

## Example

```lua
local arr = { "apple", "banana", "cherry" }
for i = 1, #arr do
  print(arr[i])
end
```