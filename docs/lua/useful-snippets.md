# Useful Lua Snippets

Here I gathered a list of very useful lua code snippets to incorporate in your map:

## First Frame
Here's a simple way of making code that runs only on the first frame:

```lua
if (firstFrame == nil) then
    ... your code goes here ...
    firstFrame = false
end
```

if you want the "first frame" to be the first frame after the players are spawned in you can use this:

```lua
if (firstFrame == nil) then
    count, players = GetAllPlayers()
    if (count == 0) then return end -- this will keep ending the code until the players are spawned
    ... your code goes here ...
    firstFrame = false
end
```

## Moving Platform (linear back and forth)
If you want to move a platform `plat` linearly (up -> down or left -> right) back and forth, you can use this code:

```lua
if (firstFrame == nil) then
    plat = ... your way of getting the platform ...
    startX = -10
    endX = 10
    speed = 1
    up = true
    firstFrame = false
end

x, y = plat.GetHome()
newX = x
if (up == true) then
    newX = x + speed
    if (newX >= endX) then
        up = false
else
    newX = x - speed
    if (newX <= startX) then
        up = true
plat.SetHome(newX, y)
```

## Picking Abilities
If you want to choose the abilities of a specific player `player` use this code **on first frame**:

```lua
player = ... your way of getting the player ...

count = player.GetAbilityCount()
for j = 1, count do
    player.SetAbility(j, ... put ability #j here ...)
end
```

However if you want to choos the abilities of *every* player, use this code **on first frame**:

```lua
count, players = GetAllPlayers()

for i = 1, count do
    player = players[i]

    for j = 1, player.GetAbilityCount() do
        player.SetAbility(j, ... put ability #j here ...)
    end
end
```