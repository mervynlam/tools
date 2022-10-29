<script>
import fileJs from "./file.js";
import { marked } from "marked";

export default {
  setup() {
    const fileIndex = ref(0);
    /* previewIndex */
    /* 2 - md */
    /* 1 - md */
    /* 0 - html */
    const previewIndex = ref(0);
    let note = reactive();
    const markdown = ref("");
    const { readFile, downloadMarkdown } = fileJs();
    /* markdown 渲染 */
    const render = new marked.Renderer();
    render.em = (text) => {
      const type = text.indexOf("备注") > -1 ? "note" : "mark";
      const isBlockquote = type === "mark" ? "<blockquote>" : "";
      return `<p class='${type}'><em>` + text + `</em></p>${isBlockquote}`;
    };
    render.paragraph = (text) => {
      const type = text.indexOf("备注") > -1 ? "note" : "mark";
      const isBlockquote = type === "mark" ? "</blockquote>" : "";
      return "<div>" + text.replaceAll("&gt; ", "") + `${isBlockquote}</div>`;
    };

    marked.setOptions({
      renderer: render,
      gfm: true,
      pedantic: false,
      sanitize: false,
      break: true,
    });
    const markdownToHtml = shallowRef("");
    markdownToHtml.value = marked(markdown.value);

    //上传前钩子
    const beforeUpload = (file) => {
      const fileType = file.type;
      //类型不支持
      if (fileType != "text/html") {
        ElMessage({
          type: "error",
          message: file.name + " 添加失败，仅支持.html文件",
          showClose: true,
        });
        return false;
      }

      // 更新当前文件
      note = file;
      // 清空markdown
      markdown.value = ''
      if (note.name === file.name) {
        ElMessage({
          type: "success",
          message: file.name + " 文件上传成功",
          showClose: true,
        });
      }

      readFile(note, markdown);
    };

    /* 下载 markdown */
    const onDownload = () => {
      downloadMarkdown(markdown, note);
    };

    /* changePreview */
    const onChangePreview = (index) => {
      markdownToHtml.value = marked.parse(
        markdown.value.replaceAll("* \n", "* ")
      );
      previewIndex.value = index;
    };

    /* onBUG */
    const onBUG = () => {
      const a = document.createElement("a");
      a.href = "mailto:xiazheng1996@outlook.com";
      a.click();
    };
    return {
      fileIndex,
      previewIndex,
      markdownToHtml,
      beforeUpload,
      readFile,
      onDownload,
      onChangePreview,
      onBUG,
    };
  },
};
</script>

<template>
  <Nav />
  <el-card class="box-card">
    <div class="box-body">
      <div class="preview-area">
        <div id="html" v-show="previewIndex == 0"></div>
        <div
          id="md"
          v-show="previewIndex == 1"
          v-html="markdownToHtml"
          class="markdown-body"
        ></div>
        <div
          id="card"
          v-show="previewIndex == 2"
          v-html="markdownToHtml"
          class="markdown-body"
        ></div>
      </div>
      <div class="option-area">
        <div>
          <el-upload
            class="upload"
            action=""
            :show-file-list="false"
            :before-upload="beforeUpload"
            drag
          >
            <i-ep-upload-filled class="el-icon-upload"></i-ep-upload-filled>
            <div class="el-upload__text">
              将 <strong>Kindle Note</strong> 拖到此处，或<em>点击上传</em>
            </div>
            <div class="upload-tips el-upload__text">只能上传.html文件</div>
          </el-upload>

          <div class="buttons">
            <el-button type="primary" @click="onChangePreview(0)">
              <el-icon class="el-icon--left"
                ><i-flat-color-icons-kindle></i-flat-color-icons-kindle
              ></el-icon>
              查看 Kindle Note</el-button
            >
            <el-button type="primary" @click="onChangePreview(1)">
              <el-icon class="el-icon--left"
                ><i-ep-search></i-ep-search
              ></el-icon>
              查看 MarkDown</el-button
            >
            <el-button type="primary" @click="onChangePreview(2)">
              <el-icon class="el-icon--left"
                ><i-ep-search></i-ep-search
              ></el-icon>
              查看 卡片</el-button
            >
            <el-button type="primary" @click="onDownload">
              <el-icon class="el-icon--left"
                ><i-ep-download></i-ep-download
              ></el-icon>
              下载 MarkDown</el-button
            >
            <el-button type="danger" @click="onBUG()">
              <el-icon class="el-icon--left"
                ><i-ep-postcard></i-ep-postcard
              ></el-icon>
              Email提bug</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.box-card {
  margin: 20px;
  border: 0;
  border-radius: 16px;
  font-size: 64px;
  position: relative;
  height: calc(100vh - 88px);
}

:deep(.el-card__body) {
  height: calc(100% - 40px);
}

.box-body {
  display: flex;
  align-items: stretch;
  height: 100%;
}
.preview-area {
  width: 50%;
  height: 100%;
  padding: 20px;
  overflow: scroll;
}

.preview-area::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
  background-color: opacity;
  border-radius: 100px;
}
.preview-area::-webkit-scrollbar-button {
  display: none;
}
.preview-area::-webkit-scrollbar-thumb {
  width: 8px !important;
  height: 8px !important;
  background-color: #e5e6eb;
  border-radius: 100px;
}
#html {
  height: 100%;
}
#card {
  height: 100%;
  font-size: 14px;
}

:deep(div#card > div) {
  margin: 20px 20px 40px 0;
  margin-bottom: 40px;
  background: #ecf4eb;
  padding: 20px;
  border-radius: 4px;
}

:deep(div#card > div > blockquote) {
  margin-left: 20px;
  border-left: 3px solid #7ed3f0;
  padding-left: 5px;
}
:deep(div#card p) {
  margin-top: -5px;
}

:deep(div#card p em) {
  margin: 0px -30px;
  padding: 10px 10px;
  color: #fff;
  border-radius: 4px;
}

:deep(div#card p.note em) {
  background: #5cc294;
}

:deep(div#card p.mark em) {
  background: #4296cf;
}

#md {
  height: 100%;
  font-size: 14px;
}

:deep(div#md > div) {
  margin: 10px 20px 20px 0;
  margin-bottom: 40px;
  padding: 0 20px;
}

:deep(div#md > div > blockquote) {
  margin-left: 0px;
  border-left: 3px solid #7f7f7f;
  padding-left: 5px;
}
:deep(div#md p) {
  margin-top: -5px;
}

:deep(div#md p em) {
  margin: 0px -30px;
  padding: 10px 10px;
  border-radius: 4px;
}



.option-area {
  width: 50%;
  height: 100%;
  padding: 20px;
}
.upload {
  width: 100%;
}
.upload :deep(.el-upload-dragger) {
  width: 100%;
}
.upload :deep(.el-upload) {
  width: 100%;
}
.buttons {
  margin: 20px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
