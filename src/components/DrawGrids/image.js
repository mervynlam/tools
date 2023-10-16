"use strict";
import drawJs from "./draw";
import utilsJs from "./utils";
import jspdf from "jspdf";
import {typeArr, paperArr, transitionTypeIndex, customStr} from './constants'
function imageJs( size, color, text, type, paperType,transition,customWidth,customHeight) {
  const {
    cm2px
  } = utilsJs()
  
  let canvasGlobal;
  //画图
  const drawImg = () => {
    let paperIndex = getPaperIndex(paperType)
    let paper = paperArr[paperIndex]
    //判断是否自定义
    if (paper.value == customStr) {
      paper = {
        value : customStr,
        width : customWidth.value,
        height : customHeight.value
      }
    }
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
      drawTitle,
    } = drawJs(size.value,color.value,text.value,paper,canvas)

    drawBorder()
    drawTitle()
    switch(type.value) {
      case 0:
        //米
        drawHorizontal()
        drawVertical()
        drawDottedHorizontal()
        drawDottedVertical()
        drawDiagonal()
        break;
      case 1:
        //田
        drawHorizontal()
        drawVertical()
        drawDottedHorizontal(transition.value)
        drawDottedVertical(transition.value)
        break;
      case 2:
        //方格
        drawHorizontal()
        drawVertical()
        break;
      case 3:
        //竖
        drawVertical()
        break;
      case 4:
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
    let paperIndex = getPaperIndex(paperType)
    let paperSizeVal = paperArr[paperIndex].value
    //是否需要过渡参数
    let transitionTxt = ""
    if (type.value == transitionTypeIndex) transitionTxt = `_${transition.value*100}%`
    link.download = `${paperSizeVal}_${size.value}_${typeArr[type.value]}${transitionTxt}.png`
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
    let paperIndex = getPaperIndex(paperType)
    let paper = paperArr[paperIndex]
    //判断是否自定义
    if (paper.value == customStr) {
      paper = {
        value : `${customWidth.value}*${customHeight.value}`,
        width : customWidth.value,
        height : customHeight.value
      }
    }
    let paperSizeVal = paper.value
    //创建pdf文件，文档：http://raw.githack.com/MrRio/jsPDF/master/docs/index.html
    // const doc = new jspdf({unit:'px', format:[cm2px(paper.height), cm2px(paper.width)]});
    //参数：单位cm，大小根据paper自定义，压缩文件大小
    let orientation = paper.height<paper.width?'l':'p'
    const doc = new jspdf({unit:'cm', format:[paper.height, paper.width],orientation:orientation,compress:true});
    
    const imageData = getImgData();
    doc.addImage(imageData, 'PNG', 0, 0, paper.width, paper.height);
    //是否需要过渡参数
    let transitionTxt = ""
    if (type.value == transitionTypeIndex) transitionTxt = `_${transition.value*100}%`
    let fileName = `${paperSizeVal}_${size.value}_${typeArr[type.value]}${transitionTxt}`
    // 保存
    doc.save(`${fileName}.pdf`);
  };

  const getPaperIndex = (paperType) => {
    let paperIndex = paperType.value;
    paperIndex = paperIndex == undefined?0:paperIndex<0?0:paperIndex>paperArr.length?0:paperIndex;
    return paperIndex;
  }

  return { drawImg, getImgData, getImgBase64, downloadImg, downloadPDF };
}

export default imageJs;
