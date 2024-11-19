# Bopl Body

Basically every object present on the map:
Arrow, RocketEngine, Mine, Tesla, AbilityPickup, Missile, MachoBoulder, Spike, Rock, Smoke, Smoke Grenade, Grenade, Platform, Unknown/Modded.

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
xVel, yVel = BoplBody.GetVelocity()
```

```lua
BoplBody.SetVelocity(number xVel, number yVel)
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
### Bouncyness
a value of 1 is perfectly elastic. a value of 0 is no bouncyness, a value of > 1 is a infinite energy generator. (danger may break the game)
```lua
number BoplBody.GetBouncyness()
```

```lua
BoplBody.SetBouncyness(number Bouncyness)
```
### GravityScale

```lua
number BoplBody.GetGravityScale()
```

```lua
BoplBody.SetGravityScale(number GravityScale)
```
### AngularVelocity

```lua
number BoplBody.GetAngularVelocity()
```

```lua
BoplBody.SetAngularVelocity(number AngularVelocity)
```
### StaticFriction
idk something to do with Friction.
```lua
number BoplBody.GetStaticFriction()
```

```lua
BoplBody.SetStaticFriction(number StaticFriction)
```
### DynamicFriction
idk something to do with Friction.
```lua
number BoplBody.GetDynamicFriction()
```

```lua
BoplBody.SetDynamicFriction(number DynamicFriction)
```
### AirFriction
the velocity is multiplyed by this value every frame. a value of 0 is infinite air resistance. a value of 1 is no air resistance. a value of > 1 causes acceleration (danger may break the game)
```lua
number BoplBody.GetAirFriction()
```

```lua
BoplBody.SetAirFriction(number AirFriction)
```
### RotationalDrag
the AngularVelocity is multiplyed by this value every frame. a value of 0 is infinite rotational drag. a value of 1 is no rotational drag. a value of > 1 causes rotational acceleration (danger may break the game)
```lua
number BoplBody.GetRotationalDrag()
```

```lua
BoplBody.SetRotationalDrag(number RotationalDrag)
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
**valid types:** Arrow, RocketEngine, Mine, Tesla, AbilityPickup, Missile, MachoBoulder, Spike, Rock, Smoke, Smoke Grenade, Grenade, Platform, Unknown/Modded.

```lua
string GetObjectType()
```

Example:
```lua
if (body.GetObjectType() == "Mine") then
    body.AddForce(0, 10)
end
```

### Can Trigger
Returns true if the BoplBody can be triggered, 
* Only works on: Mine, Missile, Grenade, Smoke Grenade, Smoke, AbilityPickup, RocketEngine

```lua
bool CanTrigger()
```

Example:
```lua
if (body.CanTrigger()) then
    body.Trigger()
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

### Trigger
Triggers an event, which depends on the type of object it is. Only works on: Mine, Missile, Grenade, Smoke Grenade, Smoke, AbilityPickup, RocketEngine

```
BoplBody.Trigger()
```

Example:
```lua
if (playerX > 10) then
    smokeRing.Trigger() -- burns the smoke
end
```

### Set Color
Sets the bopl body's color to given RGBA values, works only for: Arrow, Missile, MachoBoulder\*, Rock, Platform\*, Mine\*\*.

\* only if type = "slime"

\*\* only affects the light

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
