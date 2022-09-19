"use strict";

function dataJs(dataMap) {
  const clearData = () => {
    dataMap.clear();
  };

  const setFile = (index, file) => {
    if (dataMap.has(index)) {
      let data = dataMap.get(index);
      if (!data.file) {
        data.file = file;
        dataMap.set(index, data);
      }
    } else {
      dataMap.set(index, { file: file });
    }
  };

  const getFile = (index) => {
    if (dataMap.has(index) && dataMap.get(index).file)
      return dataMap.get(index).file;
    else return null;
  };

  const setImg = (index, img) => {
    if (dataMap.has(index)) {
      const data = dataMap.get(index);
      if (!data.img) {
        data.img = img;
        dataMap.set(index, data);
      }
    } else {
      dataMap.set(index, { img: img });
    }
  };

  const getImg = (index) => {
    if (dataMap.has(index) && dataMap.get(index).img)
      return dataMap.get(index).img;
    else return null;
  };

  const setCanvas = (index, canvas) => {
    if (dataMap.has(index)) {
      const data = dataMap.get(index);
      if (!data.canvas) {
        data.canvas = canvas;
        dataMap.set(index, data);
      }
    } else {
      dataMap.set(index, { canvas: canvas });
    }
  };

  const getCanvas = (index) => {
    if (dataMap.has(index) && dataMap.get(index).canvas)
      return dataMap.get(index).canvas;
    else return null;
  };

  return { clearData, setFile, getFile, setImg, getImg, setCanvas, getCanvas };
}

export default dataJs;
