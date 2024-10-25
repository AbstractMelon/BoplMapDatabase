# Spawn Functions

Global functions that deal with anything related to making something appear. from a simple explosion - to an entire platform.

## Explosions:

### Spawn Explosion
Spawns an explosion with a given position + scale.

```
SpawnExplosion(number x, number y, number scale)
```

Example:
```lua
SpawnExplosion(-10, 10, 10) -- Spawns a giant explosion at (-10, 10)
```

## Projectiles:

### Spawn Arrow
Spawns an arrow with a given position, scale, velocity, and color.

```
SpawnArrow(number x, number y, number scale, number xVel, number yVel, number R, number G, number B, number A)
```

Example:
```lua
SpawnArrow(0, 10, 1, 0, -1, 0, 0, 0, 0)
```

### Spawn Grenade
Spawns a grenade with a given position, scale, velocity, and angular velocity.

```
SpawnGrenade(number x, number y, number scale, number xVel, number yVel, number angularVel)
```

Example:
```lua
SpawnGrenade(11, 13, 0.5, 0, -3, 0)
```

### Spawn Smoke Grenade
Spawns a smoke grenade with a given position, scale, velocity, and angular velocity.

```
SpawnSmokeGrenade(number x, number y, number scale, number xVel, number yVel, number angularVel)
```

Example:
```lua
SpawnSmokeGrenade(0, 10, 1, 0, -3, 1)
```

## Bopl Bodies:

### Spawn Mine
Spawns a mine with a given position, scale, velocity, chase radius, and optional chasing.

~ default chase radius: `3`

```
SpawnMine(number x, number y, number scale, number xVel, number yVel, number radius, bool chase)
```

Example:
```lua
SpawnMine(0, 0, 1, 0, 5, 3, true) -- Spawns a mine with upwards velocity 5 at (0, 0)
```

### Spawn Boulder
Spawns a boulder with a given position, scale, velocity, angular velocity, type, and color.

~ valid types are: "grass", "snow", "ice", "robot", "space", "slime"

```
SpawnBoulder(number x, number y, number scale, number xVel, number yVel, number angularVel, string type, number R, number G, number B, number A)
```

Example:
```lua
SpawnBoulder(0, 0, 1, 0, 0, 3, "slime", 1, 1, 1, 1)
```

### Spawn Platform
Spawns a slime platform (like the platform ability) with a given position, width, height, radius, rotation, and color.

```
SpawnPlatform(number x, number y, number width, number height, number radius, number rotation, number R, number G, number B, number A)
```

Example:
```lua
SpawnPlatform(0, 0, 10, 5, 1, 0, 1, 0, 1, 1)  
```

## Spike

### Spawn Spike
Spawns a spike on a specified precentage\* around the surface a given platform, with varying scale and distance.

\* precentage is 0-1

```
SpawnSpike(platform attachedPlatform, number precentAroundSurface, number scale, number offset)
```

Example:
```lua
plat = platforms[1]
SpawnSpike(plat, 0, 1, 0) -- Spawns a normal size spike on the top of the platform
```

### Spawn Spike At Position
Spawns a spike in a specified position - linked to the given platform (dont have to be directly on it but moves with it), with varying scale and distance.

```
SpawnSpikeAtPosition(platform attachedPlatform, number x, number y, number scale, number offset)
```

Example:
```lua
plat = platforms[1]
SpawnSpike(plat, 0, 1, 0) -- Spawns a normal size spike on the top of the platform
```


## Other

### Spawn Black Hole
Spawns a black hole at a given position.

```
SpawnBlackHole(number x, number y, number scale)
```

Example:
```lua
hole = SpawnBlackHole(0, 10, -5) -- Spawns a white hole at (0, 10)
```