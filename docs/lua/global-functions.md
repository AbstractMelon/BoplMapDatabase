# Global Functions

This section covers the global functions available in the Lua environment.

## Spawn Functions

### Spawn Arrow

Spawns an arrow at the specified position.

```
SpawnArrow(number posX, number posY, number scale, number StartVelX, number StartVelY, number Red, number Green, number Blue, number Alpha)
```

Example:

```lua
SpawnArrow(10, 20, 1, 0, 5, 1, 0, 0, 1) -- Red arrow
```

### Spawn Grenade

Spawns a grenade.

```
SpawnGrenade(number posX, number posY, number scale, number StartVelX, number StartVelY, number StartAngularVelocity)
```

Example:

```lua
SpawnGrenade(0, 10, 1.5, 5, 5, 10)
```

### Spawn Explosion

Allows you to spawn explosions.

```
SpawnExplosion(number posX, number posY, number scale)
```

Example:

```lua
SpawnExplosion(12, 14, 5)
```

## Platform Functions

### Spawn Platform

Spawns a platform at a given location.

```
SpawnPlatform(number posX, number posY, number Width, number Height, number Radius, number Rot, number R, number G, number B, number A)
```

Example:

```lua
SpawnPlatform(0, 0, 10, 5, 2, 45, 0.5, 0.5, 0.5, 1) -- Gray platform with rotation
```

### RaycastRoundedRect

Sends a raycast that can only hit `RoundedRects` and returns the distance and the `Platform` it hit.

```
RaycastRoundedRect(number posX, number posY, number angle, number maxDist)
```

Example:

```lua
local distance, platform = RaycastRoundedRect(0, 0, 90, 100)
```
