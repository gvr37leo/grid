/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/eventsystemx/EventSystem.ts" />
/// <reference path="node_modules/rect2x/rect.ts" />

class RayCastResult{
    hit:boolean
    length:Vector2
    location:Vector2
    collidedWith:any

    constructor(hit:boolean, length:Vector2, location:Vector2, collidedWith:any){
        this.hit = hit
        this.length = length
        this.location = location
        this.collidedWith = collidedWith
    }

    draw(ctxt:CanvasRenderingContext2D){
        ctxt.strokeStyle = 'black'
        line(ctxt,this.location.c().sub(this.length),this.location)
        if(this.hit){
            ctxt.fillStyle = 'red'
        }else{
            ctxt.fillStyle = 'black'
        }
        this.location.draw(ctxt)
    }
}

class BoxCastResult{
    hit:boolean
    firedRays:RayCastResult[]
    hitRay:RayCastResult
    rect:Rect

    constructor(hit:boolean, firedRays:RayCastResult[], hitRay:RayCastResult, rect:Rect){
        this.hit = hit
        this.firedRays = firedRays
        this.hitRay = hitRay
        this.rect = rect
    }

    draw(ctxt:CanvasRenderingContext2D){
        if(this.hit){
            ctxt.strokeStyle = 'red'
        }
        this.rect.draw(ctxt)
        for(var ray of this.firedRays){
            ray.draw(ctxt)
        }
        // this.hitRay.draw(ctxt)
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

    worldPos2GridPosFloored(worldpos:Vector2):Vector2{
        return this.floor(this.worldPos2GridPos(worldpos))
    }

    worldPos2GridPos(worldpos:Vector2):Vector2{
        var relativePos = this.worldBox.pos.to(worldpos);
        relativePos.map((arr,i) => {
            arr[i] /= this.tileSize.vals[i]
        })
		return relativePos;
    }

    floor(v:Vector):Vector{
        return v.map((arr,i) => arr[i] = Math.floor(arr[i]))
    }

    gridPos2WorldPos(gridpos:Vector2):Vector2{
        return gridpos.mul(this.tileSize).add(this.worldBox.pos)
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

    rotVector90(v:Vector2):Vector2{
        var x = -v.y;
        var y = v.x;
        v.x = x
        v.y = y;
        return v
    }

    boxCastFromRect(rect:Rect,dir:Vector2):BoxCastResult{
        if(dir.length() == 0){
            var zero = new Vector2(0,0)
            return new BoxCastResult(false,[],new RayCastResult(false,zero,zero,null),new Rect(zero,zero))
        }

        var dirN = dir.c().normalize()
        var offset = this.rotVector90(dirN.c())
        var beginRel = dirN.c().add(offset)
        var endRel = dirN.c().add(offset.scale(-1))

        var begin = rect.getPoint(beginRel.c())
        var end = rect.getPoint(endRel.c())
        var begin2end = begin.to(end)

        return this.boxCast(begin,begin2end,dir)
    }

    boxCast(top:Vector2,top2bot:Vector2,dir:Vector2):BoxCastResult{
        var firedRays:RayCastResult[] = []
        var skinwidth = 0.01
        var box = new Rect(top, top2bot.c().add(dir))
        var bottom = top.c().add(top2bot)
        var top2botN = top2bot.c().normalize()
        var top2botlength = top2bot.length()
        var step = top2bot.c().normalize().mul(this.tileSize)
        

        var current = top.c()
        current.add(top2botN.c().scale(skinwidth))
        var smallest = this.rayCast(bottom.c().sub(top2botN.c().scale(skinwidth)),dir);
        var hit = smallest.hit;
        firedRays.push(smallest)

        while(top.to(current).length() < top2botlength - skinwidth){
            var result = this.rayCast(current,dir)
            firedRays.push(result)
            if(result.hit){
                hit = true;
                if(result.length.length() < smallest.length.length()){
                    smallest = result
                }
            }
            current.add(step)
        }
        
        return new BoxCastResult(hit,firedRays,smallest,box);
    }

    rayCast(worldpos:Vector2, dir:Vector2):RayCastResult{
        var gridpos = this.worldPos2GridPosFloored(worldpos)
        var endgrid = this.worldPos2GridPosFloored(worldpos.c().add(dir))
        var length = gridpos.to(endgrid).length()
        if(this.wouldCollideGrid(gridpos)){
            return new RayCastResult(true, new Vector2(0,0), worldpos.c(), null)
        }else{
            var current = gridpos
            var dirN = gridpos.to(endgrid).normalize()
            current.add(dirN)
            for(var i = 0; i < length; i++){
                if(this.wouldCollideGrid(current)){
                    var struckbox = grid.getBoxFromGrisPos(current)
                    var out:[number,number] = [0,0]
                    struckbox.collideLine(worldpos,worldpos.c().add(dir),out)
                    var strucklocation = worldpos.c().add(dir.c().scale(out[0]));
                    return new RayCastResult(true, worldpos.to(strucklocation), strucklocation, null)
                }
                current.add(dirN)
            }    
        }
        return new RayCastResult(false,dir,worldpos.c().add(dir),null)
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
            if(this.wouldCollideGrid(v)){
                this.getBoxFromGrisPos(v).draw(ctx)
            }
        })
    }

    wouldCollideWorld(worldPos:Vector2):boolean{
        var gridpos = this.worldPos2GridPosFloored(worldPos)
        return this.wouldCollideGrid(gridpos)
    }

    wouldCollideGrid(gridPos:Vector2):boolean{
        var box = new Rect(new Vector2(0,0),this.gridSize.c().sub(new Vector2(1,1)))
        if(box.collidePoint(gridPos)){
            if(this.triggers[gridPos.y][gridPos.x].size > 0){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }
}