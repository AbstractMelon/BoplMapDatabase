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

### Base Scale

The scale the platform will shrink to after some time

```lua
number Platform.GetBaseScale()
```

```lua
Platform.SetBaseScale(number baseScale)
```
### Max Scale
the max scale. if the scale is more then this value it gets clamped to this value
```lua
number Platform.GetMaxScale()
```

```lua
Platform.SetMaxScale(number MaxScale)
```
### Min Scale
the minimum scale. if the scale is less then this value it gets clamped to this value
```lua
number Platform.GetMinScale()
```

```lua
Platform.SetMinScale(number MinScale)
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

### Is Anti Lock
Returns true if the platform has an AntiLockPlatform component (that makes it move between points)

```
bool Platform.IsAntiLock()
```

Example:
```lua
if (plat.IsAntiLock()) then
    plat.RemoveAntiLock()
end
```

### Is Vector Field
Returns true if the platform has a VectorFieldPlatform component (that makes it orbit a point)

```
bool Platform.IsVectorField()
```

Example:
```lua
if (plat.IsVectorField()) then
    plat.RemoveVectorField()
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

### Make Anti Lock - <span style="color: red;">Doesn't Work For Boulder!</span>
Adds an AntiLockPlaform component to the platform, that makes the platform move between points and ignore its home position.
~ OrbitPathXs and OrbitPathYs are tables with coordinates of the points the platform moves between. They can have any length, as long as their lengths aren't different from each other.
DelaySeconds is a delay before the platform starts moving counted from when the map is loaded (not from when players get spawned).
If the platform already has an AntiLockPlaform component or a VectorFieldPlatform component, calling this function overrides it.

```
Platform.MakeAntiLock(table OrbitPathXs, table OrbitPathYs, number DelaySeconds, number OrbitForce)
```

Example:
```lua
if (not plat.IsBoulder()) then
    plat.MakeAntiLock({0, 10, 10, 0}, {0, 0, 10, 10}, 3, 600)
end
```
### Make Vector Field - <span style="color: red;">Doesn't Work For Boulder!</span>
Adds a VectorFieldPlaform component to the platform, that makes the platform orbit a point and ignore its home position.
~ DelaySeconds is a delay before the platform starts orbiting counted from when the map is loaded (not from when players get spawned).
~ DeadZoneDist is how far from the targetRadius it can go before being atracted to be closer to the targetRadius.
~ ovalness01 has to do with how much of a oval it is. idk the exsact values.
I do not know what expandSpeed, normalSpeedFriction, and OrbitAccelerationMulitplier are.
If the platform already has a VectorFieldPlatform component or an AntiLockPlaform component, calling this function overrides it.

```
Platform.MakeVectorField(number centerX, number centerY, number delaySeconds, number orbitSpeed, number expandSpeed, number normalSpeedFriction, number DeadZoneDist, number OrbitAccelerationMulitplier, number targetRadius, number ovalness01)
```

Example:
```lua
if (not plat.IsBoulder()) then
    plat.MakeVectorField(0, 12, 3, 15, 100, 0.95, 1, 1, 20, 1)
end
```
### Remove Anti Lock
Removes the platform's AntiLockPlatform component, causing it to stop moving between points and start moving towards its home position.
~ Can only be called if the platform has an AntiLockPlatform component.
A platform with an AntiLockPlatform component keeps setting its home to its position, so the platform's home is its position when this is called.

```
Platform.RemoveAntiLock()
```

Example:
```lua
if (plat.IsAntiLock()) then
    plat.RemoveAntiLock()
end
```

### Remove Vector Field
Removes the platform's VectorFieldPlatform component, causing it to stop orbiting a point and start moving towards its home position.
~ Can only be called if the platform has a VectorFieldPlatform component.
A platform with a VectorFieldPlatform component keeps setting its home to its position, so the platform's home is its position when this is called.

```
Platform.RemoveVectorField()
```

Example:
```lua
if (plat.IsVectorField()) then
    plat.RemoveVectorField()
end
```
