"use strict";
import dataJs from "./data.js";
function imageJs(dataMap, size, angle, color, text, space) {
  const { getCanvas, getImg } = dataJs(dataMap);
  //画图
  const drawImg = (index) => {
    const canvas = getCanvas(index);

    const img = getImg(index);
    if (!canvas || !img) return;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
  };

  //加水印
  const drawText = (index) => {

    const canvas = getCanvas(index);
    if (!canvas) return;
    const textSize_T =
      (size.value / 100) *
      Math.max(20, Math.min(canvas.width, canvas.height) / 5);

    const fontCtx = canvas.getContext("2d");
    fontCtx.font =
      "bold " +
      textSize_T +
      'px "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif';
    fontCtx.fillStyle = color.value;
    fontCtx.rotate((angle.value * Math.PI) / 180);

    //文字宽度
    const textWidth = fontCtx.measureText(text.value).width;
    //横向间隔
    const margin = fontCtx.measureText("一").width;

    //由于可旋转角度，取宽高较大值乘一定数额，避免空白
    const maxWidth = Math.max(canvas.width, canvas.height) * 1.3;
    //行数
    const row = Math.ceil(maxWidth / (textSize_T + textSize_T * space.value));
    //列数
    const col = Math.ceil(maxWidth / (textWidth + margin));
    for (let i = -1 * row; i < row; ++i) {
      for (let j = -1 * col; j < col; ++j) {
        //偏移量，隔行偏移
        let offset = 0;
        if (i % 2 != 0) offset = (textWidth + margin) / 2;
        fontCtx.fillText(
          text.value,
          (textWidth + margin) * j - offset,
          (textSize_T + textSize_T * space.value) * i
        );
      }
    }
  };

  //重画
  const redraw = () => {
    dataMap.forEach((value, key) => {
      const canvas = value.canvas;
      if (!canvas) return true;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImg(key);
      drawText(key);
    });
  };

  //获取图片
  const getImgData = (index) => {
    const canvas = getCanvas(index);
    if (!canvas) return false;
    const imageData = canvas.toDataURL("image/png");
    return imageData;
  };

  //获取图片base64
  const getImgBase64 = (index) => {
    const dataUrl = getImgData(index);
    const idx = dataUrl.indexOf("base64,");
    return dataUrl.substring(idx + "base64,".length);
  };

  return { drawImg, drawText, redraw, getImgData, getImgBase64 };
}

export default imageJs;
