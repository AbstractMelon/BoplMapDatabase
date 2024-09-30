# Player Functions

These are the functions related to the `Player` type.

## Get Methods

### Get Speed

Gets the current speed of the player.

```
Player.GetSpeed()
```

Example:

```lua
local speed = player.GetSpeed()
```

### Get Position

Gets the player's current position.

```
Player.GetPosition()
```

Example:

```lua
local x, y = player.GetPosition()
```

## Set Methods

### Set Speed

Sets the player's speed to a new value.

```
Player.SetSpeed(number NewValue)
```

Example:

```lua
player.SetSpeed(10)
```

## Ability Functions

### Get Ability

Returns the ability assigned to the given slot.

```
Player.GetAbility(number index)
```

Example:

```lua
local ability = player.GetAbility(1)
```

### Set Ability

Sets the ability in a specific slot.

```
Player.SetAbility(number index, string ability, bool PlayAbilityPickupSound)
```

Example:

```lua
player.SetAbility(1, "Dash", true)
```
