"use strict";
import drawJs from "./draw";
import utilsJs from "./utils";
import jspdf from "jspdf";
import {typearr, paperArr} from './constants'
function imageJs( size, color, text, type, paperType) {
  const {
    cm2px
  } = utilsJs()
  
  let canvasGlobal;
  //画图
  const drawImg = () => {
    let papertmp = paperType.value;
    papertmp = papertmp == undefined?0:papertmp<0?0:papertmp>paperArr.length?0:papertmp;
    let paper = paperArr[papertmp]
    const canvas = document.getElementById("gridCanvas")
    canvasGlobal = canvas;
    canvas.width = cm2px(paper.width);
    canvas.height = cm2px(paper.height);
    const {
      drawHorizontal,
      drawVertical,
      drawBorder,
      drawDottedHorizontal,
      drawDottedVertical,
      drawDiagonal,
      drawTitle
    } = drawJs(size.value,color.value,text.value,paper,canvas)

    drawBorder()
    drawTitle()
    switch(type.value) {
      case '0':
        //米
        drawHorizontal()
        drawVertical()
        drawDottedHorizontal()
        drawDottedVertical()
        drawDiagonal()
        break;
      case '1':
        //田
        drawHorizontal()
        drawVertical()
        drawDottedHorizontal()
        drawDottedVertical()
        break;
      case '2':
        //方格
        drawHorizontal()
        drawVertical()
        break;
      case '3':
        //竖
        drawVertical()
        break;
      case '4':
        //横
        drawHorizontal()
        break;
      default:
        drawHorizontal()
        drawVertical()
        drawDottedHorizontal()
        drawDottedVertical()
        drawDiagonal()
    }
  };

  //获取图片
  const getImgData = () => {
    if (!canvasGlobal) return false;
    const imageData = canvasGlobal.toDataURL("image/png");
    return imageData;
  };

  //获取图片base64
  const getImgBase64 = () => {
    const dataUrl = getImgData();
    const idx = dataUrl.indexOf("base64,");
    return dataUrl.substring(idx + "base64,".length);
  };

  //下载单图
  const downloadImg = () => {

    const linkarea = document.getElementById("downloadLinks");

    const link = document.createElement("a");
    link.download = `${size.value}_${typearr[type.value]}.png`
    link.style.display = "none";
    const imageData = getImgData();
    link.href = imageData;
    linkarea.appendChild(link);
    setTimeout((_) => {
      link.click();
      linkarea.removeChild(link);
    }, 100);
  };

  //下载单图
  const downloadPDF = () => {
    let papertmp = paperType.value;
    papertmp = papertmp == undefined?0:papertmp<0?0:papertmp>paperArr.length?0:papertmp;
    let paper = paperArr[papertmp]
    //创建pdf文件，文档：http://raw.githack.com/MrRio/jsPDF/master/docs/index.html
    const doc = new jspdf({unit:'px', format:[cm2px(paper.height), cm2px(paper.width)]});
    
    const imageData = getImgData();
    doc.addImage(imageData, 'PNG', 0, 0, cm2px(paper.width), cm2px(paper.height));
    let fileName = `${size.value}_${typearr[type.value]}`
    // 保存
    doc.save(`${fileName}.pdf`);
  };

  return { drawImg, getImgData, getImgBase64, downloadImg, downloadPDF };
}

export default imageJs;
