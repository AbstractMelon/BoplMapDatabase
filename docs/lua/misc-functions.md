# Miscellaneous Functions

Global functions that aren't specific to any particular category.

## Global Functions:

### Play Sound
Plays a sound from a given name after a certain delay.

```lua
PlaySound(string name, number delay)
```

Example:
```lua
if (playerX > 20) then
    PlaySound("explosion", 0)
end
```

### Possible Sounds:

::: info

slimeJump1, slimeJump2, slimeJump3, slimeJump4, slimeLand1, slimeLand2, slimeLand3, slimeLand4, slimeWalk1, slimeWalk2, slimeWalk3, slimeWalk4, shoot, prepareToShoot, dash, explosion, waterExplosion, go, slimeSplash1, slimeSplash2, slimeDeath, startGame, return, waterSplash, rollCharge, rollReady, throwSmallItem, rollRelease, navigateMenu, easeInBlock1, CreepyAmbientElectrical, timeStop, laserShoot, teleport, teleport2, airWave, mineExplosion, smokeExplosion1, smokeExplosion2, smokeExplosion3, mineAnticipation, abilityPickup, spikeRock, reviveCast, reviveOnDeath, reviveDing, arrowHit, arrowLoad, arrowShoot, mineArmed, mineArmedDouble, selectAbilities, prepareToQuantum, slimeWalkNeg, return2, rockBounce, easeInBlock2, easeInBlock4, easeInBlock5, easeInBlock6, slimeSplash3, return3, smallError, menuWhoosh1, menuWhoosh2, lightning, loadLightning, plantObjectOnPlatform, startEngine, loopEngine, endEngine, startAura, loopAura, detonateAura, invisibility, transform1, transform2, transform3, meteor_jump, meteor_vibrate, meteor_dash, smokeBombExplosion, spawnBlackHole, blackHoleSuck, navigateMenu2, accept, decline, accept2, decline2, grow, reload2, fireRaygun, shrink, throwBoulder, pickupBoulder, hitstop, swapIndicator, swap, drill_start, drill_loop, drill_end, drill_underground_loop, drill_underground_enter, drill_underground_exit, debris, hookshotFire, hookshotOnHit, reelInLoop, hookshotLetGo, reelInFire, hookshotHitPlayer, bite, swallow, beamSparks1, beamSparks2, beamSparks3, beamSparks4, beamCharge1, beamCharge2, beamCharge3, beamCharge4, beamFire, beamLoop, beamLoopBig, beamLoopHP, beamEnd, beamsCrossed, blackholeNoClap, spawnOutDuplicate, duplicatePlatform, fireDuplicatorOnPlatform

:::

## Time Related Functions:

### Get Delta Time
Returns the time in seconds since the last frame.

```
number GetDeltaTime()
```

Example:
```lua
dt = GetDeltaTime()
x, y = platBody.GetPos()
platBody.SetPos(x + dt * speed, y)
```

### Get Time Since Level Load
Returns the time since the level loaded including the time before the players spawn in.

```
number GetTimeSinceLevelLoad()
```

Example:
```lua
if (GetTimeSinceLevelLoad() > 60) then
    p = players[math.random(1, 4)]
    KillPlayer(p)
end
```

### Is Time Stopped
Returns true if the time stop ability is currently active.

```
bool IsTimeStopped()
```

Example:
```lua
if (not IsTimeStopped()) then
    print("hi")
end
```

## ~~Logic Related Functions~~ (not implemented yet)

### Get Input Value
Gets the value of a logic gate's input with a given id

~ uses 1-based indexing

```lua
bool GetInputValueWithId(number id)
```

### Set Output Value
Sets the value of a logic gate's output to a given value

```lua
SetOutputWithId(number id, bool value)
```

## File Related Functions

### Get File From Map
Gets a file from the map file with a given name (including the extension)

~ returns a byte array

```lua
Byte[] GetFileFromMapFile(string fileName)
```