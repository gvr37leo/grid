/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />

class Rect{
    pos:Vector2
    size:Vector2

    constructor(pos:Vector2,size:Vector2){
        this.pos = pos
        this.size = size
    }

    collidePoint(point:Vector2){
        for (var i = 0; i < 2; i++) {
			if (!inRange(this.getEdge(i, false), this.getEdge(i, true), point.vals[i])) {
				return false;
			}
		}
		return true;
    }

    collideBox(other:Rect){
        for(var i = 0; i < 2; i++){
			if(!rangeOverlap(this.getEdge(i,false), this.getEdge(i,true), other.getEdge(i,false), other.getEdge(i,true))){
				return false;
			}
		}
		return true;
    }

    getEdge(dim:number,takeMax:boolean){
        var result = this.pos[dim];
		if(takeMax){
			result += this.size[dim];
		}
		return result;
    }

    getPoint(relativePos:Vector2){
        var halfsize = this.size.c().scale(0.5);
		var center = this.pos.add(halfsize);

		halfsize.x *= relativePos.x;
		halfsize.y *= relativePos.y;
		return center.add(halfsize);
    }

    draw(ctxt:CanvasRenderingContext2D){
        var tl = this.getPoint(new Vector2(-1,-1))
        var tr = this.getPoint(new Vector2(1,-1))
        var br = this.getPoint(new Vector2(1,1))
        var bl = this.getPoint(new Vector2(-1,1))

        ctxt.beginPath()
        ctxt.moveTo(tl.x,tl.y)
        ctxt.lineTo(tr.x,tr.y)
        ctxt.lineTo(br.x,br.y)
        ctxt.lineTo(br.x,br.y)
        ctxt.lineTo(tl.x,tl.y)
        ctxt.stroke()
    }

    loop(callback:(v:Vector2) => void):void{
        var temp = new Vector2(0,0)

        this.size.loop((sv) => {
            temp.overwrite(this.pos)
            temp.add(sv)
            callback(sv)
        })
    }
}

function rangeOverlap(range1A:number,range1B:number,range2A:number,range2B:number){
    return range1A <= range2B && range2A <= range1B
}