# Black Hole

These are the properties and functions of the `BlackHole` class - very similar to the BoplBody class but since Black Holes do not have BoplBodys, they had to be seperated.

## Base Properties

### Position
```lua
x, y = BlackHole.GetPos() -- reutrns a Vec2
```

```lua
BlackHole.SetPos(number x, number y)
```

### Velocity
```lua
xVel, yVel = BlackHole.GetVelocity()
```

```lua
BoplBody.SetVelocity(number xVel, number yVel)
```

### Rotation
The rotation of the black hole
```lua
number BlackHole.GetRot()
```

```lua
BlackHole.SetRot(number rot)
```

### Mass
```lua
number BlackHole.GetMass()
```

```lua
BlackHole.SetMass(number mass)
```

## Info Functions

### Has Been Initialized
Returns true if the black hole is initialized in the scene (just make sure to check this before destroying an object).

```lua
bool HasBeenInitialized()
```

### Is Being Destroyed
Returns true on the frame the black hole is being destroyed, check for this when destroying because you can't destroy an object twice.

```lua
bool IsBeingDestroyed()
```

### Is Disappeared
Returns true if the black hole is currently blinked (disappeared).

```lua
bool IsDisappeared()
```

## Active Functions

### Grow
Grows the black hole by the given size. If the size is negative, then the black hole shrinks.

```
BlackHole.Grow(number amount)
```

Example:
```lua
if (hole.GetMass() > 0) then
    hole.Grow(-0.01)
end
```

### Add Force
Launches the black hole with a given x and y strength. The final velocity depends on the objects mass.

```
BlackHole.AddForce(number x, number y)
```

Example:
```lua
hole.AddForce(0, 10) -- launches the black hole upwards
```

### Destroy
Removes the black hole from the scene.

~ has to be initalized `HasBeenInitialized() == true` and not destroyed `IsBeingDestroyed() == false`.

```
BlackHole.Destroy()
```

Example:
```lua
if (hole.HasBeenInitialized() and not hole.IsBeingDestroyed()) then
    hole.Destroy()
end
```
