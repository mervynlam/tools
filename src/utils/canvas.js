export const drawImg = (canvas, image) => {
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0)
}

export const getFontContext = (canvas, options) => {
  const { size, color, rotate = 0 } = options

  const fontCtx = canvas.getContext('2d')
  fontCtx.font =
    'bold ' +
    size +
    'px "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif'
  fontCtx.fillStyle = color
  fontCtx.rotate((rotate * Math.PI) / 180)

  return fontCtx
}

export const getCanvasDataUrl = (canvas) => {
  if (!canvas) return ''
  const imageData = canvas.toDataURL('image/png')
  return imageData
}

export const drawRect = (ctx, color, lineWidth, x, y, w, h) => {
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.strokeRect(x, y, w, h)
  ctx.stroke()
}

export const drawLine = (ctx, color, width, startX, startY, endX, endY, dottedDash = []) => {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  if (dottedDash.length > 0) {
    ctx.setLineDash(dottedDash)
  }
  ctx.beginPath() //加上这个大大提升性能，gpt说如果不调用 beginPath，所有的路径都会被合并在一起，导致性能降低，并且可能影响绘制效果。
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.stroke()
}

export const drawText = (canvas, text, size, color, x, y) => {
  const fontCtx = getFontContext(canvas, { size, color })
  fontCtx.textAlign = 'center'
  fontCtx.textBaseline = 'middle'
  fontCtx.fillText(text, x, y)
}
