export const drawImg = (canvas, image) => {
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0)
}

export const getFontContext = (canvas, options) => {
  const { size, color, rotate } = options

  const fontCtx = canvas.getContext('2d')
  fontCtx.font =
    'bold ' +
    size +
    'px "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif'
  fontCtx.fillStyle = color
  fontCtx.rotate((rotate * Math.PI) / 180)

  return fontCtx
}
