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
var mousepos= new Vector2(450,0)
// var physicsbody = new PhysicsBody(grid,new Rect(new Vector2(0,0),new Vector2(0,0)),new Vector2(-100,0),new Vector2(0,0))
canvas.addEventListener('mousemove',(ev) => {
    mousepos = getMousePos(canvas,ev)
})

grid.gridSize.loop((pos) => {
    let box = grid.getBoxFromGrisPos(pos)
    grid.listen(new Rect(pos.c(), new Vector2(1,1)),() => {
        box.draw(ctxt)
    })
})

loop((dt) => {
    ctxt.clearRect(0,0,600,600)
    grid.worldBox.draw(ctxt)
    // physicsbody.update(dt)
    
    var result = grid.rayCast(mousepos,new Vector2(0,-100))
    grid.trigger(grid.worldPos2GridPosFloored(mousepos))

    ctxt.strokeStyle = 'black'
    ctxt.fillStyle = 'black'
    mousepos.draw(ctxt)
    ctxt.strokeStyle = 'red'
    ctxt.fillStyle = 'red'
    line(ctxt,mousepos,result.location)
    result.location.draw(ctxt)
    ctxt.strokeStyle = 'black'
            
})