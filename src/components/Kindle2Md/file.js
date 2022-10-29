"use strict";
import html2Md from "./html2Md.js";

function fileJs() {
  const { getBookTitle, getAuthors, getNotes } = html2Md();
  //读取单文件
  const readFile = (note, markdown) => {
    if (note) {
      const fileReader = new FileReader();
      fileReader.readAsText(note);
      fileReader.onload = () => {
        document.getElementById(`html`).innerHTML += fileReader.result; // reader.result为获取结果
        getBookTitle();
        getAuthors();
        const curMd = getNotes();
        if (curMd) {
          markdown.value = curMd;
        }
      };
    }
  };

  //文件名
  const generateFileName = (fileName) => {
    if (fileName.lastIndexOf(".") > 0) {
      fileName = fileName.substring(0, fileName.lastIndexOf("."));
    }
    return fileName + ".md";
  };

  //下载单图
  const downloadMarkdown = (markdown, note) => {
    if (!markdown || !markdown.value) {
      ElMessage({
        type: "error",
        message: "请先上传.html文件！",
        showClose: true,
      });
    }
    const file = new File([markdown.value], generateFileName(note.name), {
      type: "text/plain",
    });

    const tmpLink = document.createElement("a");
    const objectUrl = URL.createObjectURL(file);

    tmpLink.href = objectUrl;
    tmpLink.download = file.name;
    document.body.appendChild(tmpLink);
    tmpLink.click();

    document.body.removeChild(tmpLink);
    URL.revokeObjectURL(objectUrl);
  };

  return { readFile, downloadMarkdown };
}

export default fileJs;
