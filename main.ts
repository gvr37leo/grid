/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="grid.ts" />
/// <reference path="physicsBody.ts" />


var crret = createCanvas(600,600)
var canvas = crret.canvas
var ctxt = crret.ctxt
var world = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0],
]

var grid = new Grid(new Rect(new Vector2(100,100), new Vector2(400,400)), new Vector2(10,10))
var mousepos= new Vector2(200,200)
var physicsbody = new PhysicsBody(grid,new Rect(new Vector2(100,50),new Vector2(40,80)),new Vector2(0,50),new Vector2(0,0))
canvas.addEventListener('mousemove',(ev) => {
    mousepos = getMousePos(canvas,ev)
})

var worldsize = new Vector2(world[0].length,world.length)
worldsize.loop((pos) => {
    if(world[pos.y][pos.x] == 1){
        grid.listen(new Rect(pos.c(), new Vector2(1,1)),() => {

        })
    }
})

document.addEventListener('keydown', (e) => {
    if(e.keyCode == 32 && physicsbody.grounded[1] == true){
        physicsbody.vel.y -= 400
    }
})


loop((dt) => {
    dt /= 1000
    // dt = 0.008
    ctxt.clearRect(0,0,600,600)
    var input = getMoveInputYFlipped()
    input.y = 0;
    // var input = new Vector2(0,-10000)

    
    physicsbody.movement = input.c().scale(200)

    var result = grid.boxCast(mousepos,new Vector2(0,50),new Vector2(200,0))
    result.location.draw(ctxt)

    grid.worldBox.draw(ctxt)
    physicsbody.update(dt)
    
    grid.draw(ctxt)
    physicsbody.collisionBox.draw(ctxt)
    grid.trigger(grid.worldPos2GridPosFloored(mousepos))
    
})