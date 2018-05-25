/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/eventsystemx/EventSystem.ts" />
/// <reference path="box.ts" />


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

        this.tileSize = new Vector2(0,0)
        this.tileSize.vals = worldSize.pos.vals.map((val,i) => {
            return val / gridSize.x
        })
    }

    worldPos2GridPos(worldpos):Vector2{
        var relativePos = this.worldBox.pos.to(worldpos);
        relativePos.map((arr,i) => {
            arr[i] /= this.gridSize.vals[i]
        })
        relativePos.map((arr,i) => arr[i] = Math.round(arr[i]) )
		return relativePos;
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

    rayCast(worldpos:Vector2,dir:Vector2){
        var gridpos = this.worldPos2GridPos(worldpos)
        var endgrid = this.worldPos2GridPos(worldpos.c().add(dir))

        var current = gridpos
        var dir = gridpos.to(endgrid).normalize()
        
        var length = gridpos.to(endgrid).length()
        for(var i = 0; i < length; i++){
            if(this.wouldCollideGrid(current)){
                return {
                    hit:true,
                    length:1,
                    location:new Vector2(0,0),
                    collidedWith:null,
                }
            }
            current.add(dir)
        }
        
        return {
            hit:true,
            length:0,
            location:new Vector2(0,0),
            collidedWith:null,
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
        for(var val of this.triggers[v.y][v.x].values()){
            val()
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