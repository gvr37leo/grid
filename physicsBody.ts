/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="grid.ts" />


class PhysicsBody{
    grid:Grid
    collisionBox:Rect
    vel:Vector2
    acc:Vector2

    constructor(grid:Grid,collisionBox:Rect,vel:Vector2,acc:Vector2){
        this.vel = vel
        this.grid = grid
        this.collisionBox = collisionBox
        this.acc = acc
    }

    

    update(dt:number){
        var dst2travelThisFrame = this.vel.c().scale(dt)


        var xDir = dst2travelThisFrame.c()
        xDir.y = 0;
        var top = this.collisionBox.getPoint(new Vector2(-1,-1))
        var bottom = this.collisionBox.getPoint(new Vector2(-1,1))
        var result = this.grid.boxCast(top,bottom,xDir)
        if(result.hit){
            this.pos.x += result.length.x
        }else{
            this.pos.x += xDir.x
        }
    }

    get pos():Vector2{
        return this.collisionBox.pos
    }

    set pos(pos:Vector2){
        this.collisionBox.pos = pos
    }
}