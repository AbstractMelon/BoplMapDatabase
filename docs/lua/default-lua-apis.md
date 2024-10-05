# Default Lua APIs

You have access to the following built-in Lua APIs:

- Global constants: `_G`, `_VERSION`, `_MOONSHARP`
- Table iterators: `next`, `ipairs`, `pairs`
- Metatable methods: `setmetatable`, `getmetatable`, `rawset`, `rawget`, `rawequal`, `rawlen`
- The `string` package
- The `table` package
- The `math` package (had to redo this package to use bopls math so it doesnt cause desinks so pls tell DavidLovesJellycarWorlds on discord if they dont work correctly/give incorect ansers)
- The `bit32` package
- Error handling methods: `pcall`, `xpcall`
- The `coroutine` package
