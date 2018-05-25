/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
var crret = createCanvas(500,500)
var canvas = crret.canvas
var ctxt = crret.ctxt

loop((dt) => {
    ctxt.clearRect(0,0,500,500)

    ctxt.fillRect(10,10,10,10)
})