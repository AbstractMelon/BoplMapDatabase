# BoplBody Functions

These are the functions related to the `BoplBody` type.

## Get Methods

### Get Position

Gets the position of the `BoplBody`.

```
BoplBody.GetPos()
```

Example:

```lua
local x, y = boplBody.GetPos()
```

### Get Rotation

Gets the rotation of the `BoplBody`.

```
BoplBody.GetRot()
```

Example:

```lua
local rot = boplBody.GetRot()
```

## Set Methods

### Set Position

Sets the position of the `BoplBody`.

```
BoplBody.SetPos(number PosX, number PosY)
```

Example:

```lua
boplBody.SetPos(0, 5)
```

### Set Velocity

Sets the velocity of the `BoplBody`.

```
BoplBody.SetVelocity(number VelX, number VelY)
```

Example:

```lua
boplBody.SetVelocity(10, 15)
```

### Set Scale

Sets the scale of the `BoplBody`.

```
BoplBody.SetScale(number Scale)
```

Example:

```lua
boplBody.SetScale(2)
```
