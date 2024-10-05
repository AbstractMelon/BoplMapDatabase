# Player

These are the properties and functions of the `Player` type

## Base Properties

### Position
The current position of the player
```lua
x, y = Player.GetPosition() -- reutrns a Vec2
```

```lua
Player.SetPosition(number x, number y)
```

### Mass
The mass of the player
```lua
number Player.GetMass()
```

```lua
Player.SetMass(number mass)
```

## Speed Related Properties

### Speed
The current speed of the player
```lua
number Player.GetSpeed()
```

```lua
Player.SetSpeed(number speed)
```

### Grounded Speed
The speed of the player when standing on a platform
```lua
number Player.GetGroundedSpeed()
```

```lua
Player.SetGroundedSpeed(number speed)
```

### Max Speed
The maximum speed of the player
```lua
number Player.GetMaxSpeed()
```

```lua
Player.SetMaxSpeed(number maxSpeed)
```

## Acceleration Related Properties

### Acceleration
The acceleration speed of the player
```lua
number layer.GetAccel()
```

```lua
Player.SetAccel(number accel)
```

### Air Accel
The aerial acceleration speed of the player
```lua
number Player.GetAirAccel()
```

```lua
Player.SetAirAccel(number airAccel)
```

### Gravity Accel
The gravity affecting the player
```lua
number Player.GetGravityAccel()
```

```lua
Player.SetGravityAccel(number gravity)
```

### Terminal Velocity
The max speed the player can fall
```lua
number Player.GetGravityMaxFallSpeed()
```

```lua
Player.SetGravityMaxFallSpeed(number maxFallSpeed)
```

## Jump Related Properties

### Jump Strength
The jump strength of the player
```lua
number Player.GetJumpStrength()
```

```lua
Player.SetJumpStrength(number jumpStrength)
```

### Jump Extra X Strength
???????? i dont fucking know
```lua
number Player.GetJumpExtraXStrength()
```

```lua
Player.SetJumpExtraXStrength(number jumpExtraStrength)
```

### Jump kept Momentum
???????? i dont fucking know #2
```lua
number Player.GetJumpKeptMomentum()
```

```lua
Player.SetJumpKeptMomentum(number jumpKeptMumentum)
```

## Functions

### Get Platform
Gets the platform the player is on, if airborne returns nil.

```
Platform Player.GetPlatform()
```

Example:
```lua
currentPlatform = player.GetPlatform()
```

### Add Force
Launches the player with a given x and y strength

```
Player.AddForce(number x, number y)
```

Example:
```lua
player1.AddForce(0, 10) -- launches the player upwards
```

### Is Disappeared
returns true if the player is currently blinked.

```
bool Player.IsDisappeared()
```

Example:
```lua
if (player2.IsDissapeared()) then
    print("Bye Player 2")
end
```

## Ability Related Functions

### Get Ability
Returns the ability at `index` of the player as string
index: 1 - left, 2 - up, 3 - right

```
string Player.GetAbility(number index)
```

Example:
```lua
ability = player1.GetAbility(2) -- gets the center ability
```

### Set Ability
Sets the ability at `index` of the player to given ability
index: 1 - left, 2 - up, 3 - right
~ if theres less than 3 abilities it just adds one

valid ability names:
[Roll, Dash, Grenade, Bow, Engine, Blink, Gust, Grow, Rock, Missile, Spike, TimeStop, SmokeGrenade, Platform, Revive, Shrink, BlackHole, Invisibility, Meteor, Macho, Push, Tesla, Mine, Teleport, Drill, Grapple, Beam, Duplicator]

```
Player.SetAbility(number index, string ability, bool playPickupSound)
```

Example:
```lua
player3.SetAbility(1, "Grenade", false)
player3.SetAbility(2, "Grenade", false)
player3.SetAbility(3, "Grenade", false)
```

### Get Ability Count
Gets the # of abilities a player has currently

```
number Player.GetAbilityCount()
```

Example:
```lua
count = player.GetAbilityCount()
```

### Get Ability Cooldown Remaining
Gets the remaining cooldown of the ability in seconds

```
number Player.GetAbilityCooldownRemaining(numbert index)
```

Example:
```lua
wait = player4.GetAbilityCooldownRemaining(1)
```

### Set Ability Cooldown Remaining
Sets the remaining cooldown of the ability in seconds

```
Player.SetAbilityCooldownRemaining(numbert index, number newRemainingCooldown)
```

Example:
```lua
player4.SetAbilityCooldownRemaining(1, 0)
```

### Get Ability Max Cooldown
Gets the cooldown time of an ability
~ returns 1,000,000 if no ability in the slot

```
number Player.GetAbilityMaxCooldown(number index)
```

Example:
```lua
maxCool = player1.GetAbilityMaxCooldown(2)
```