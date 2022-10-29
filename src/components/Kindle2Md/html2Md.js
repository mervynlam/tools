"use strict";
function html2Md() {
  //解析书名
  const getBookTitle = () => {
    const title = document.querySelector(`.bookTitle`);
    if (title) {
      const content = "# " + title.innerHTML.replaceAll(" ", "") + " \n";
      return content;
    }
    return "未命名书籍" + " \n";
  };

  //解析作者
  const getAuthors = () => {
    const author = document.querySelector(`.authors`);
    if (author) {
      if (author.innerHTML.split("：").length >= 1) {
        const content =
          "——" + author.innerHTML.split("：")[1].replace("\n", "") + " \n\n";
        return content;
      }
      return "——" + author.innerHTML.replace("\n", "") + " \n\n";
    }
    return "——" + "佚名" + " \n\n";
  };

  const handleNodeList = (nodeList, callback, markdown) => {
    for (let i = 0; i < nodeList.length; i++) {
      callback(nodeList[i], markdown);
    }
  };

  const parseHeadNode = (element, markdown) => {
    if (element.className && element.className === "noteText") {
      const content =
        element.firstChild.textContent.replaceAll(" ", "") + " \n\n" + " \n\n";
      markdown.push(content);
      return;
    }
    if (element.tagName == "H2") {
      const content =
        "## " + element.firstChild.textContent.replaceAll(" ", "") + " \n";
      markdown.push(content);
      return;
    }
    if (element.tagName == "H3") {
      const content = "*" + element.textContent.replaceAll(" ", "") + "* \n";
      const tag = content.indexOf("备注") === -1 ? "> " : "";
      markdown.push(content, tag);
      return;
    }
  };

  //解析笔记
  const parseNotes = (element, markdown) => {
    if (element.tagName == "H2") {
      const content =
        "## " + element.firstChild.textContent.replaceAll(" ", "") + " \n";
      markdown.push(content);
      return;
      // console.log("markdown...H2", markdown);
    }
    if (element.tagName == "H3") {
      const content = "*" + element.textContent.replaceAll(" ", "") + "* \n";
      const tag = content.indexOf("备注") === -1 ? "> " : "";

      markdown.push(content, tag);
      return;
      // console.log("markdown...H3", markdown);
    }
    if (element.tagName !== "DIV") {
      return;
    }
    if (element.className && element.className === "bodyContainer") {
      handleNodeList(element.childNodes, parseHeadNode, markdown);
      return;
    }
    if (element.tagName == "DIV" && element.firstChild.textContent) {
      const content =
        element.firstChild.textContent.replaceAll(" ", "") + " \n\n" + " \n\n";
      markdown.push(content);

      // console.log("markdown...DIV", markdown);
    }
    if (element.childNodes) {
      handleNodeList(element.childNodes, parseNotes, markdown);
      return;
      // console.log("markdown...", markdown);
    }

    return;
  };

  //获取笔记
  const getNotes = () => {
    const markdown = [];
    const noteBody = document.querySelector("#html");
    if (noteBody) {
      markdown.push(getBookTitle());
      markdown.push(getAuthors());
      const noteTexts = noteBody.childNodes;
      handleNodeList(noteTexts, parseNotes, markdown);
      return markdown.join("");
    }
  };

  return { getBookTitle, getAuthors, getNotes };
}

export default html2Md;
