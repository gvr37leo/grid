/// <reference path="physicsBody.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/eventsystemx/EventSystem.ts" />

class Collision{
    a:PhysicsBody;
    b:PhysicsBody;

    constructor(a:PhysicsBody,b:PhysicsBody){
        this.a = a;
	    this.b = b;
    }
}

class PhysicsWorld{

    collisionMask:boolean[][]
    tilesize:Vector2
    onCollission:EventSystem<Collision>
    grid:boolean[][]
    map:Map<PhysicsBody,PhysicsBody>
    

    constructor(){

    }

    update(dt:number){
        var bodys = Array.from(this.map.values())
        for(var body of bodys){
            body.update(dt)
        }

        for(var i = 0; i < bodys.length; i++){
            for(var j = i + 1; j < bodys.length; j++){
                var a = bodys[i]
                var b = bodys[j]

                if(a.collisionBox.collideBox(b.collisionBox)){
                    this.onCollission.trigger(new Collision(a,b))
                }
            }
        }

    }

    draw(ctxt:CanvasRenderingContext2D){

    }

    insertPhysicsBody(body:PhysicsBody,layer:number){

    }

    removePhysicsBody(body:PhysicsBody){

    }

    worldpos2gridpos(){

    }

    gridpos2worldpos(){

    }
}