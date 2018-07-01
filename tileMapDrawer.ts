/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />


class TileMapDrawer{

    pos:Vector2
    tileSize:Vector2
    images:HTMLImageElement[]
    map:number[][]

    constructor(pos:Vector2, tileSize:Vector2, images:HTMLImageElement[],map:number[][]){
        this.pos = pos
        this.tileSize = tileSize
        this.images = images
        this.map = map
    }

    draw(ctxt:CanvasRenderingContext2D){
        new Vector2(this.map[0].length, this.map.length).loop((v) => {
            drawImage(ctxt, this.images[this.map[v.y][v.x]], this.pos.c().add(this.tileSize.c().mul(v)), this.tileSize)  
        })
    }
}