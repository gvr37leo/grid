/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="grid.ts" />


var crret = createCanvas(500,500)
var canvas = crret.canvas
var ctxt = crret.ctxt

var grid = new Grid(new Rect(new Vector2(0,0), new Vector2(400,400)), new Vector2(10,10))
var mousepos= new Vector2(450,0)
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
    ctxt.clearRect(0,0,500,500)
    grid.worldBox.draw(ctxt)
    var hit = grid.rayCast(mousepos,new Vector2(-100,0))
    // grid.trigger(grid.worldPos2GridPos(mousepos))
    mousepos.draw(ctxt)
    
    hit.location.draw(ctxt)
})