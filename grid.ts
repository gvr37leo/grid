/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/eventsystemx/EventSystem.ts" />
/// <reference path="node_modules/rect2x/rect.ts" />

class RayCastResult{
    hit:boolean
    length:number
    location:Vector2
    collidedWith:any

    constructor(hit,length,location,collidedWith){
        this.hit = hit
        this.length = length
        this.location = location
        this.collidedWith = collidedWith
    }

    static noHit(){
        return new RayCastResult(false,0,new Vector2(0,0),null)
    }
}

class Grid{
    worldBox: Rect;
    gridSize: Vector2;
    tileSize:Vector2
    triggers:Map<number,() => void>[][]
    handles:Map<number,Rect>
    handleCounter:number = 0

    constructor(worldSize:Rect, gridSize:Vector2){
        this.worldBox = worldSize
        this.gridSize = gridSize

        this.triggers = createNDimArray(gridSize.vals,(pos) => new Map())
        this.handles = new Map()

        this.tileSize = new Vector2(0,0).map((arr, i) => {
            arr[i] = worldSize.size.vals[i] / gridSize.vals[i]
        })
    }

    worldPos2GridPos(worldpos:Vector2):Vector2{
        var relativePos = this.worldBox.pos.to(worldpos);
        relativePos.map((arr,i) => {
            arr[i] /= this.tileSize.vals[i]
        })
        relativePos.map((arr,i) => arr[i] = Math.floor(arr[i]) )
		return relativePos;
    }

    gridPos2WorldPos(gridpos:Vector2):Vector2{

        return null
    }
    
    getBoxFromGrisPos(gridpos:Vector2):Rect{
        var pos = this.worldBox.pos.c()
        var temp = this.tileSize.c()
        temp.vals.map((val,i,array) => {
            array[i] *= gridpos.vals[i]
        })
        pos.add(temp)
        return new Rect(pos,this.tileSize.c())
    }

    rayCast(worldpos:Vector2, dir:Vector2){
        var gridpos = this.worldPos2GridPos(worldpos)
        var endgrid = this.worldPos2GridPos(worldpos.c().add(dir))

        var current = gridpos
        var dir = gridpos.to(endgrid).normalize()
        
        var length = gridpos.to(endgrid).length()
        for(var i = 0; i < length; i++){
            if(this.wouldCollideGrid(current)){
                var struckbox = grid.getBoxFromGrisPos(current)
                var strucklocation = struckbox.getPoint(dir.c().scale(-1))

                return new RayCastResult(true, i, dir.scale(length), null)
            }
            current.add(dir)
        }
        
        return RayCastResult.noHit()
    }

    //world coords
    boxCast(top:Vector2,bottom:Vector2,dir:Vector2){
        var length = dir.length()
        var top2bot = top.to(bottom)


        for (let x = 0; x < length; x += this.tileSize.x) {
            var result = this.rayCast(new Vector2(x,top.y),top2bot)
            if(result.hit){
                return result
            }
        }
    }

    listen(gridBox:Rect, callback:() => void):number{
        this.handleCounter++;
        this.handles.set(this.handleCounter,gridBox)

        gridBox.loop((v) => {
            this.triggers[v.y][v.x].set(this.handleCounter,callback)
        })
		return this.handleCounter;
	}

    
	trigger(v:Vector2):void{
        var gridBox = new Rect(new Vector2(0,0),this.gridSize.c().sub(new Vector2(1,1)))
        if(gridBox.collidePoint(v)){
            for(var val of this.triggers[v.y][v.x].values()){
                val()
            }
        }
	}

	deafen(handle:number):void{
		var deafenBox:Rect = this.handles.get(handle)

        deafenBox.loop((v) => {
            this.triggers[v.y][v.x].delete(handle)
        })
    }
    
    draw(ctx:CanvasRenderingContext2D){
        this.gridSize.loop(v => {
            if(true)
            this.getBoxFromGrisPos(v).draw(ctx)
        })
    }

    wouldCollideWorld(worldPos:Vector2):boolean{
        var gridpos = this.worldPos2GridPos(worldPos)
        return this.wouldCollideGrid(gridpos)
    }

    wouldCollideGrid(gridPos:Vector2):boolean{
        if(this.triggers[gridPos.y][gridPos.x]){
            return true
        }else{
            return false
        }
    }
}