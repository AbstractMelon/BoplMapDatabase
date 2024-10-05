# Bopl

Basically every object present on the map:
Arrow, RocketEngine, Mine, Tesla, AbilityPickup, Missile, MatchoBoulder, Spike, Rock, Smoke, Smoke Grenade, Grenade, Platform, Unknown/Modded.

## Base Properties

### Position
```lua
x, y = BoplBody.GetPos() -- reutrns a Vec2
```

```lua
BoplBody.SetPos(number x, number y)
```

### Velocity
```lua
number BoplBody.GetVelocity()
```

```lua
BoplBody.SetVelocity(number velocity)
```

### Rotation
The rotation of the bopl body
```lua
number BoplBody.GetRot()
```

```lua
BoplBody.SetRot(number rot)
```

### Scale
```lua
number BoplBody.GetScale()
```

```lua
BoplBody.SetScale(number scale)
```

### Mass
```lua
number BoplBody.GetMass()
```

```lua
BoplBody.SetMass(number mass)
```

## Info Functions

### Has Been Initialized
Returns true if the bopl body is initialized in the scene (just make sure to check this before destroying an object).

```lua
bool HasBeenInitialized()
```

### Is Being Destroyed
Returns true on the frame the body is being destroyed, check for this when destroying because you can't destroy an object twice.

```lua
bool IsBeingDestroyed()
```

### Is Disappeared
Returns true if the body is currently blinked (disappeared).

```lua
bool IsDisappeared()
```

### Get Object Type
Returns the type of the bopl body.
**valid types:** Arrow, RocketEngine, Mine, Telsa, AbilityPickup, Missile, MatchoBoulder, Spike, Rock, Smoke, Smoke Grenade, Grenade, Platform, Unknown/Modded.

```lua
string GetObjectType()
```

Example:
```lua
if (body.GetObjectType() == "Mine") then
    body.AddForce(0, 10)
end
```

## Active Functions

### Add Force
Launches the bopl body with a given x and y strength. the final velocity depends on the objects mass.

```
BoplBody.AddForce(number x, number y)
```

Example:
```lua
arrow.AddForce(0, 10) -- launches the arrow upwards
```

### Set Color
Sets the bopl body's color to given RGBA values, works only for: Arrow, Missile, *\* MatchoBoulder*, Rock, *\* Platform*.

\* only if type = "slime"

```
BoplBody.SetColor(numer R, number G, number B, number A)
```

Example:
```lua
arrow.SetColor(0.5, 0, 0.5) -- sets the color of the arrow to be purple
```

### Destroy
Removes the bopl body from the scene.

~ has to be initalized `HasBeenInitialized() == true` and not destroyed `IsBeingDestroyed() == false`.

```
BoplBody.Destroy()
```

Example:
```lua
if (spike.HasBeenInitialized() and not spike.IsBeingDestroyed()) then
    spike.Destroy()
end
```
