"use strict";
import dataJs from "./data.js";
import imageJs from "./image.js"
function fileJs(dataMap, size, angle, color, text, space) {
  const {
    setFile,
    getFile,
    setImg,
    setCanvas,
  } = dataJs(dataMap);
  const {
    drawImg,
    drawText,
    getImgData,
    redraw,
  } = imageJs(dataMap, size, angle, color, text, space);
  //读取单文件
  const readFile = (file, index) => {

    setFile(index, file);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setImg(index, img);
        setCanvas(index, document.getElementById(`canvas_${index - 1}`));
        drawImg(index);
        drawText(index);
      };
      return (img.src = fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  //批量读文件
  const readFiles = (files) => {
    files.forEach((item, index) => {
      readFile(item, index);
    });
  };

  //下载单图
  const downloadImg = (index) => {
    const file = getFile(index);
    if (!file) {
      return false;
    }

    const linkarea = document.getElementById("downloadLinks");

    if (!file) return false;
    const link = document.createElement("a");
    link.download = generateFileName(file.name);
    link.style.display = "none";
    const imageData = getImgData(index);
    link.href = imageData;
    linkarea.appendChild(link);
    setTimeout((_) => {
      link.click();
      linkarea.removeChild(link);
    }, 100);
  };

  //批量下载
  const batchDownload = () => {
    dataMap.forEach((value, key) => {
      downloadImg(key);
    });
  };

  //文件名
  const generateFileName = (fileName) => {
    if (fileName.lastIndexOf(".") > 0) {
      fileName = fileName.substring(0, fileName.lastIndexOf("."));
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + now.getMonth()).slice(-2);
    const day = ("0" + now.getDay()).slice(-2);
    const hour = ("0" + now.getHours()).slice(-2);
    const minute = ("0" + now.getMinutes()).slice(-2);
    const second = ("0" + now.getSeconds()).slice(-2);
    const milliseconds = ("00" + now.getMilliseconds()).slice(-3);
    return (
      fileName +
      "_watermark_" +
      year +
      month +
      day +
      hour +
      minute +
      second +
      milliseconds +
      ".png"
    );
  };

  return { readFiles, readFile, downloadImg, batchDownload, generateFileName };
}

export default fileJs;
