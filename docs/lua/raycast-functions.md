# Raycast Functions

Global functions that are used to get/shoot an object/ray from the map based on id/position etc..

## Position Based Functions

### Get Closest Player
Returns the closest player to a given point on the map

```
Player GetClosestPlayer(number x, number y)
```

```lua
p1 = GetClosestPlayer(0, 0)
p2 = GetClosestPlayer(10, 0)
```


### Raycast Rounded Rect
Shoots a ray from a given point, returns the Rounded Rect (a platform) it hit and the distance it traveled,
if doesn't hit, returns a big negative number.

~ angle: 0 = right, 90 = up, 180 = left, 270 = right

```
number, Platform RaycastRoundedRect(number x, number y, number angle, number maxDistance)
```

```lua
_, plat = RaycastRoundedRect(0, 0, 90, 1)
plat.GetBoplBody().Destroy()
```

## General Sequence Functions

### Get All Players
Returns a number: count, and an array of players.

```
number, Player[] GetAllPlayers()
```

Example:
```lua
count, players = GetAllPlayers()
i = 1
while (i <= count) do
    player = players[i]
    player.SetAbility(1, "Dash")
    player.SetAbility(2, "Dash")
    player.SetAbility(3, "Dash")
    i = i + 1
end
```

### Get All Platforms
Returns count and an array of platforms.

```
number, Platforms[] GetAllPlatforms()
```

Example:
```lua
_, platforms = GetAllPlatforms()
s1, s2 = platforms[0], platforms[1]
```

### Get All Bopl Bodys
Returns count and an array of bopl bodies. (most objects on the scene)

```
number, BoplBody[] GetAllBoplBodys()
```

Example:
```lua
c, bodies = GetAllBoplBodys()
i = 1
while (i <= c) do
    body = bodies[i]
    if (body.GetObjectType() == "AbilityPickup") then
        body.Destroy()
    i = i + 1
end
```

## Shooting Functions

### Shoot Blink
Shoots a blink gun from a given point to a given angle, player/wall disappearance duration + delay are configurable.

~ normal: `x`, `y`, `angle`, 0.5, 4, 1, 0.3

```
ShootBlink(number x, number y, number angle, number playerDuration, number wallDuration, number wallDelay, number wallShake)
```

Example:
```lua
x, y = p1.GetPosition()
ShootBlink(x, y, 0, 1, 4, 1, 0.3)
```

### Shoot Grow
Shoots a grow gun from a given point to a given angle, player/wall growth factor are configurable, also black hole growth.

~ normal: `x`, `y`, `angle`, 0.8, 0.8, 50

```
ShootGrow(number x, number y, number wallFactor, number playerFactor, number blackHoleGrowth)
```

Example:
```lua
ShootGrow(0, 0, 0.8, 0.8, 50)
```

### Shoot Shrink
Shoots a shrink gun from a given point to a given angle, player/wall growth factor are configurable, also black hole growth.

~ normal: `x`, `y`, `angle`, 0.8, 0.8, 50

```
ShootShrink(number x, number y, number wallFactor, number playerFactor, number blackHoleGrowth)
```

Example:
```lua
ShootShrink(0, 0, 0.8, 0.8, 50)
```