"use strict";
function drawJs(size, color, text, paper, canvas) {
  
  const ctx = canvas.getContext('2d');
  
  // 设置背景色
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //默认页边距*2
  const defaultSpace = 3
  //厘米像素换算
  const perUnit = 96/2.54;
  //横格数量
  const horizontalNum=Math.floor((paper.width-defaultSpace)/size)
  //竖格数量
  const verticalNum=Math.floor((paper.height-defaultSpace)/size)
  //横边距
  const hSpace = ((paper.width - horizontalNum*size)/2).toFixed(1);
  //竖边距
  const vSpace = ((paper.height - verticalNum*size)/2).toFixed(1);

  const drawBorder = () => {
    // 设置线条颜色和宽度
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(hSpace * perUnit, vSpace * perUnit, horizontalNum*size*perUnit, verticalNum*size*perUnit);
    ctx.lineWidth = 1;
    ctx.strokeRect(hSpace * perUnit-5, vSpace * perUnit-5, horizontalNum*size*perUnit+10, verticalNum*size*perUnit+10);
    ctx.stroke()
  }

  //画横
  const drawHorizontal = () => {
    ctx.save()
    ctx.beginPath()
    // 设置线条颜色和宽度
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    for (let i = vSpace * perUnit+size*perUnit, j = 1; j < verticalNum; i += size * perUnit, j++) {
      ctx.moveTo(hSpace*perUnit, i);
      ctx.lineTo(hSpace*perUnit+horizontalNum*size*perUnit, i)
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
    ctx.lineWidth = 0.5;
    for (let i = hSpace * perUnit+size*perUnit, j = 1; j < horizontalNum; i += size * perUnit, j++) {
      ctx.moveTo(i, vSpace * perUnit);
      ctx.lineTo(i, vSpace*perUnit+verticalNum*size*perUnit)
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
    ctx.setLineDash([5,2,2,2])
    ctx.lineWidth = 0.3;
    for (let i = vSpace * perUnit+(size/2).toFixed(2)*perUnit, j = 0; j < verticalNum; i += size * perUnit, j++) {
      ctx.moveTo(hSpace*perUnit, i);
      ctx.lineTo(hSpace*perUnit+horizontalNum*size*perUnit, i)
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
    ctx.setLineDash([5,2,2,2])
    ctx.lineWidth = 0.3;
    for (let i = hSpace * perUnit+(size/2).toFixed(2)*perUnit, j = 0; j < horizontalNum; i += size * perUnit, j++) {
      ctx.moveTo(i, vSpace * perUnit);
      ctx.lineTo(i, vSpace*perUnit+verticalNum*size*perUnit)
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
    ctx.setLineDash([5,2,2,2])
    ctx.lineWidth = 0.3;
    for (let i = 0; i < horizontalNum; ++i) {
      for (let j = 0; j < verticalNum; ++j) {
        ctx.moveTo(hSpace*perUnit+i*size*perUnit,vSpace*perUnit+j*size*perUnit);
        ctx.lineTo(hSpace*perUnit+(i+1)*size*perUnit,vSpace*perUnit+(j+1)*size*perUnit)
        ctx.moveTo(hSpace*perUnit+(i+1)*size*perUnit,vSpace*perUnit+j*size*perUnit);
        ctx.lineTo(hSpace*perUnit+i*size*perUnit,vSpace*perUnit+(j+1)*size*perUnit)
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
    const y = (vSpace*perUnit - textHeight) / 2;
    ctx.textAlign = "center"; // 设置文本水平居中
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, y + textHeight / 2);
  };

  return { drawHorizontal, drawVertical, drawDiagonal, drawBorder, drawDottedHorizontal, drawDottedVertical, drawTitle};
}

export default drawJs;
