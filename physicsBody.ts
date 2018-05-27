/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="grid.ts" />


class PhysicsBody{
    grid:Grid
    collisionBox:Rect = new Rect(new Vector2(0,0),new Vector2(0,0))
    vel:Vector2
    acc:Vector2

    update(dt:number){

        this.collisionBox.pos.add(this.vel.c().scale(dt))

        var getAbsX;
        var getAbsY;

        var xDir = this.vel.c().scale(dt)
        xDir.y = 0;
        this.grid.rayCast(this.collisionBox.pos,xDir)


        var yDir = this.vel.c()
        yDir.x = 0
        //raycast x
        //raycast y
    }
}