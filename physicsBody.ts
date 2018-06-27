/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="grid.ts" />


class PhysicsBody{

    grid:Grid
    collisionBox:Rect
    vel:Vector2
    acc:Vector2
    movement:Vector2
    grounded:boolean[] = [false,false]


    constructor(grid:Grid,collisionBox:Rect,vel:Vector2,acc:Vector2){
        this.vel = vel
        this.grid = grid
        this.collisionBox = collisionBox
        this.acc = acc
    }

    

    update(dt:number){
        var gravity = new Vector2(0,600)

        this.acc = gravity
        this.vel.add(this.acc.c().scale(dt))
        var dst2travelThisFrame = this.vel.c().add(this.movement).scale(dt)

        for (var i = 0; i < 2; i++) {
            var speed = dst2travelThisFrame.vals[i]
            var boxedge = new Vector2(0,0)
            var ray = new Vector2(0,0)
            boxedge.vals[i] = Math.sign(speed)
            ray.vals[i] = speed
            // var raycastResult = this.grid.rayCast(this.collisionBox.getPoint(boxedge),ray)
            // raycastResult.draw(ctxt)
            var boxcastResult = this.grid.boxCastFromRect(this.collisionBox,ray)
            var raycastResult = boxcastResult.hitRay
            raycastResult.draw(ctxt)
            if(Math.abs(raycastResult.length.vals[i]) < Math.abs(speed)){
                this.pos.vals[i] += raycastResult.length.vals[i]
                this.vel.vals[i] = 0
                this.grounded[i] = true
            }else{
                this.pos.vals[i] += speed
                this.grounded[i] = false
            }
        }
    
    }

    get pos():Vector2{
        return this.collisionBox.pos
    }

    set pos(pos:Vector2){
        this.collisionBox.pos = pos
    }
}