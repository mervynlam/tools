"use strict";
import utilsJs from "./utils";
function drawJs(size, color, text, paper, canvas) {
  const {
    cm2px
  } = utilsJs()
  
  const ctx = canvas.getContext('2d');
  
  // 设置背景色
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //默认页边距cm*2
  const defaultSpace = 3
  //横格数量
  const horizontalNum=Math.floor((paper.width-defaultSpace)/size)
  //竖格数量
  const verticalNum=Math.floor((paper.height-defaultSpace)/size)

  /*============这里都是厘米============*/
  //横边距
  const hSpace = ((paper.width - horizontalNum*size)/2).toFixed(2);
  //竖边距
  const vSpace = ((paper.height - verticalNum*size)/2).toFixed(2);
  /*============这里都是厘米============*/
  /*============这里都是像素============*/
  const hSpacePx = cm2px(hSpace)
  const vSpacePx = cm2px(vSpace)
  const sizePx = cm2px(size)
  /*============这里都是像素============*/

  const normalWeight = 2
  const boldWeight = 5
  const thinWeight = 0.5
  const dottedDash = [5,5]

  const drawBorder = () => {
    // 设置线条颜色和宽度
    ctx.strokeStyle = color;
    ctx.lineWidth = normalWeight;
    ctx.strokeRect(hSpacePx, vSpacePx, horizontalNum*sizePx, verticalNum*sizePx);
    ctx.lineWidth = boldWeight;
    ctx.strokeRect(hSpacePx-15, vSpacePx-15, horizontalNum*sizePx+30, verticalNum*sizePx+30);
    ctx.stroke()
  }

  //画横
  const drawHorizontal = () => {
    ctx.save()
    ctx.beginPath()
    // 设置线条颜色和宽度
    ctx.strokeStyle = color;
    ctx.lineWidth = normalWeight;
    for (let i = vSpacePx+sizePx, j = 1; j < verticalNum; i += sizePx, j++) {
      ctx.moveTo(hSpacePx, i);
      ctx.lineTo(hSpacePx+horizontalNum*sizePx, i)
    }
    ctx.stroke()
    ctx.closePath();
    ctx.restore();
  };

  //竖线
  const drawVertical = () => {
    ctx.save()
    ctx.beginPath()
    // 设置线条颜色和宽度
    ctx.strokeStyle = color;
    ctx.lineWidth = normalWeight;
    for (let i = hSpacePx+sizePx, j = 1; j < horizontalNum; i += sizePx, j++) {
      ctx.moveTo(i, vSpacePx);
      ctx.lineTo(i, vSpacePx+verticalNum*sizePx)
    }
    ctx.stroke()
    ctx.closePath();
    ctx.restore();
  };

  //画横虚线
  const drawDottedHorizontal = () => {
    ctx.save()
    ctx.beginPath()
    // 设置线条颜色和宽度
    ctx.strokeStyle = color;
    ctx.setLineDash(dottedDash)
    ctx.lineWidth = thinWeight;
    for (let i = vSpacePx+(sizePx/2), j = 0; j < verticalNum; i += sizePx, j++) {
      ctx.moveTo(hSpacePx, i);
      ctx.lineTo(hSpacePx+horizontalNum*sizePx, i)
    }
    ctx.stroke()
    ctx.closePath();
    ctx.restore();
  };

  //竖虚线
  const drawDottedVertical = () => {
    ctx.save()
    ctx.beginPath()
    // 设置线条颜色和宽度
    ctx.strokeStyle = color;
    ctx.setLineDash(dottedDash)
    ctx.lineWidth = thinWeight;
    for (let i = hSpacePx+(sizePx/2), j = 0; j < horizontalNum; i += sizePx, j++) {
      ctx.moveTo(i, vSpacePx);
      ctx.lineTo(i, vSpacePx+verticalNum*sizePx)
    }
    ctx.stroke()
    ctx.closePath();
    ctx.restore();
  };

  //斜线
  const drawDiagonal = () => {
    ctx.save()
    ctx.beginPath()
    // 设置线条颜色和宽度
    ctx.strokeStyle = color;
    ctx.setLineDash(dottedDash)
    ctx.lineWidth = thinWeight;
    for (let i = 0; i < horizontalNum; ++i) {
      for (let j = 0; j < verticalNum; ++j) {
        ctx.moveTo(hSpacePx+i*sizePx,vSpacePx+j*sizePx);
        ctx.lineTo(hSpacePx+(i+1)*sizePx,vSpacePx+(j+1)*sizePx)
        ctx.moveTo(hSpacePx+(i+1)*sizePx,vSpacePx+j*sizePx);
        ctx.lineTo(hSpacePx+i*sizePx,vSpacePx+(j+1)*sizePx)
      }
    }
    ctx.stroke()
    ctx.closePath();
    ctx.restore();
  };

  //标题
  const drawTitle = () => {
    const font =
      '25px "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif';
    ctx.font = font;
    ctx.fillStyle = color;

    const textHeight = parseInt(font);
    const y = (vSpacePx - textHeight) / 2;
    ctx.textAlign = "center"; // 设置文本水平居中
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, y + textHeight / 2);
  };

  return { drawHorizontal, drawVertical, drawDiagonal, drawBorder, drawDottedHorizontal, drawDottedVertical, drawTitle};
}

export default drawJs;
