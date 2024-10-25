# Miscellaneous Functions

Global functions that aren't specific to any particular category.

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