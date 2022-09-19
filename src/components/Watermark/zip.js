"use strict";
import fileJs from "./file.js";
import imageJs from "./image.js";
function zipJs(dataMap) {
  const { generateFileName } = fileJs(dataMap);
  const { getImgBase64 } = imageJs(dataMap);
  const downloadZip = () => {
    var zip = new JSZip();
    dataMap.forEach((value, key) => {
      let file = value.file;
      if (!file) return true;
      zip.file(generateFileName(file.name), getImgBase64(key), {
        base64: true,
      });
    });
    zip
      .generateAsync({
        type: "blob",
      })
      .then((content) => {
        var filename = generateFileName("downloadZip") + ".zip";
        var link = document.createElement("a");
        link.download = filename;
        link.style.display = "none";
        link.href = URL.createObjectURL(content);
        document.body.appendChild(link);
        setTimeout((_) => {
          link.click();
          document.body.removeChild(link);
        }, 100);
      });
  };

  return { downloadZip };
}

export default zipJs;
