/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="grid.ts" />


class PhysicsBody{
    grid:Grid
    collisionBox:Rect = new Rect(new Vector2(0,0),new Vector2(0,0))
    vel:Vector2
    acc:Vector2

    update(dt:number){
        var dst2travelThisFrame = this.vel.c().scale(dt)


        var xDir = dst2travelThisFrame.c()
        xDir.y = 0;
        var top = this.collisionBox.getPoint(new Vector2(-1,-1))
        var bottom = this.collisionBox.getPoint(new Vector2(-1,1))
        var hit = this.grid.boxCast(top,bottom,xDir)
        this.collisionBox.pos.x += hit.length

    }
}