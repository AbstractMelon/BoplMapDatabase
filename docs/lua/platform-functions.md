# Platform Functions

These functions deal with the `Platform` type, which includes platforms and boulders.

## Resizing Platforms

### Resize Platform

Resizes a platform.

```
ResizePlatform(number Width, number Height, number Radius)
```

Example:

```lua
ResizePlatform(10, 5, 2) -- Resize platform to 10x5 with a radius of 2
```

## Platform Properties

### Get Platform Size

Gets the width, height, and radius of the platform.

```
GetPlatformSize()
```

Example:

```lua
local width, height, radius = platform.GetPlatformSize()
```

### Set Home

Sets the home position of a platform (where it would like to be).

```
Platform.SetHome(number posX, number posY)
```

Example:

```lua
platform.SetHome(10, 10)
```
