# Platform

These are the properties and functions of the `Platform` type.

~ note that Platform is for both Platforms and Boulders

## Base Properties

### Home - <span style="color: red;">Doesn't Work For Boulder!</span>
The position the platform wants to be in
```lua
x, y = Platform.GetHome() -- reutrns a Vec2
```

```lua
Platform.SetHome(number x, number y)
```

### Home Rotation - <span style="color: red;">Doesn't Work For Boulder!</span>
The rotation the platform wants to be in
```lua
number Platform.GetHomeRot()
```

```lua
Platform.SetHomeRot(number homeRot)
```

### Scale
The scale of the platform
```lua
number Platform.GetScale()
```

```lua
Platform.SetScale(number scale)
```

## Info Functions

### Get Bopl Body
Returns the physics body `BoplBody` of the platform or nil if not found

```
BoplBody Platform.GetBoplBody()
```

Example:
```lua
movingBody = movingPlatform.GetBoplBody()
x, y = movingBody.GetPos()
movingBody.SetPos(x + speed, y)
```

### Is Resizable
Returns true if the platform is resizable in both axes (slime platform, spawned platform, custon platform)

```
bool Platform.IsResizable()
```

Example:
```lua
if (platform.IsResizable()) then
    platform.Resize(10, 10, 10)
end
```

### Is Boulder
Returns true if the platform is a boulder

```
bool Platform.IsBoulder()
```

Example:
```lua
if (!p1.IsBoulder()) then
    p1.SetHome(0, 0)
end
```

### Get Platform Size
Returns the platform's width, height, and radius
~ width and height are distances from edge to center - radius. to calculate them in bopl units you do `2(width + radius)` for width and `2(height + radius)` for height.

```
width, height, radius = Platform.GetPlatformSize()
```

Example:
```lua
width, height, radius = plat.GetPlatformSize()
```

### Get True Width And Height
Returns the true width and height of the platform taking into account rotations.

```
width, height = Platform.GetTrueWidthAndHeight()
```

Example:
```lua
width, height = plat.GetTrueWidthAndHeight()
```

## Active Functions

### Resize Platform
Resizes the platform to a given width, height, and radius.
~ only works if Platform.IsResizable()

```
Platform.ResizePlatform(number width, number height, number radius)
```

Example:
```lua
plat.ResizePlatform(10, 5, 1)
```

### Drop All Players
Momentarily disconnects every attached player from the platform.

```
Platform.DropAllPlayers(number dropForce)
```

Example:
```lua
icePlatform.DropAllPlayers(1)
```

### Shake Platform
Shakes the platform for a given period of time.

```
Platform.ShakePlatform(number duration, number shakeAmount)
```

Example:
```lua
if (player.GetPlatform() == plat) then
    plat.ShakePlatform(1, 2)
end
```