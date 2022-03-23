"use strict";

let canvasMap = new Map()
let imgMap = new Map()

let drawImg = (index) => {
    let canvas
    if (canvasMap.has(index)) {
        canvas = canvasMap.get(index)
    } else {
        canvas = document.getElementById("canvas_"+index)
        canvasMap.set(index, canvas)
    }
    let img
    if (imgMap.has(index)) {
        img = imgMap.get(index)
    } else {
        return
    }
    canvas.width = img.width
    canvas.height = img.height
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0)
}

let drawText = (index) => {
    let canvas
    if (canvasMap.has(index)) {
        canvas = canvasMap.get(index)
    } else {
        canvas = document.getElementById("canvas_"+index)
        canvasMap.set(index, canvas)
    }

    let color = app.color
    let angle = app.angle
    let text = app.text
    let size = app.size
    let space = app.space
    let textSize = size/100 * (Math.max(20,Math.min(canvas.width, canvas.height) / 5))

    let fontCtx = canvas.getContext("2d")
    fontCtx.font = 'bold '+textSize+"px serif";
    fontCtx.fillStyle = color
    fontCtx.rotate(angle*Math.PI/180)

    //文字宽度
    let textWidth = (fontCtx.measureText(text)).width
    //横向间隔
    let margin = (fontCtx.measureText('一')).width

    //由于可旋转角度，取宽高较大值乘一定数额，避免空白
    let maxWidth = Math.max(canvas.width, canvas.height)*1.3
    //行数
    let row = Math.ceil(maxWidth / (textSize+textSize*space))
    //列数
    let col = Math.ceil(maxWidth / (textWidth+margin))

    for (let i = -1*row; i < row; ++i) {
        for (let j = -1*col; j < col; ++j) {
            //偏移量，隔行偏移
            let offset = 0
            if (i % 2 != 0) offset = (textWidth+margin)/2
            fontCtx.fillText(text, (textWidth+margin)*j - offset, (textSize+textSize*space) * i);
        }
    }
}

let redraw = () => {
    canvasMap.forEach((value, key) => {
        let canvas = value
        let ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawImg(key)
        drawText(key)
    })
}

let getImgData = (index) => {
    if (!canvasMap.has(index)) {
        return false
    }
    let canvas = canvasMap.get(index)
    let imageData = canvas.toDataURL('image/png');
    return imageData
}