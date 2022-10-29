<script>
import dataJs from "./data.js";
import fileJs from "./file.js";
import imageJs from "./image.js";
import zipJs from "./zip.js";
export default {
  setup() {
    const size = ref(25);
    const angle = ref(45);
    const color = ref("rgba(249, 183, 38, 0.66)");
    const text = ref("");
    const space = ref(2);
    const fileIndex = ref(0);
    const sizeLimit = ref(5); //文件大小限制，单位M
    const previewData = ref("");
    const previewFlag = ref(false);
    const fileSet = reactive(new Set());
    let imgList = reactive([]);
    const dataMap = reactive(new Map());

    const {
      clearData,
      setFile,
      getFile,
      setImg,
      getImg,
      setCanvas,
      getCanvas,
    } = dataJs(dataMap);

    const { readFile, downloadImg, batchDownload } = fileJs(
      dataMap,
      size,
      angle,
      color,
      text,
      space
    );

    const { redraw, getImgData } = imageJs(
      dataMap,
      size,
      angle,
      color,
      text,
      space
    );

    const { downloadZip } = zipJs(dataMap);

    //重画
    const handleDrawText = () => {
      redraw();
    };

    //清空图片
    const clearImgs = () => {
      fileIndex.value = 0;
      imgList = [];
      fileSet.clear();
      clearData();
    };

    //下载单图
    function download(index) {
      downloadImg(index);
    }

    //上传前钩子
    const beforeUpload = (file) => {
      const fileType = file.type;
      //类型不支持
      if (fileType != "image/png" && fileType != "image/jpeg") {
        ElMessage({
          type: "info",
          message: file.name + " 添加失败，仅支持png/jpg文件",
          showClose: true,
        });
        return false;
      }

      //文件超过大小
      let size = file.size;
      if (size > sizeLimit.value * 1024 * 1024) {
        ElMessage({
          type: "info",
          message: file.name + "超过 " + sizeLimit.value + " M，添加失败。",
          showClose: true,
        });
        return false;
      }

      //文件已加入
      let uid = file.name + file.size;
      if (fileSet.has(uid)) {
        ElMessage({
          type: "info",
          message: file.name + " 文件已存在",
          showClose: true,
        });
        return false;
      }

      //加入set，去重
      fileSet.add(uid);
      imgList.push(file);
      fileIndex.value += 1;
      readFile(file, fileIndex.value);
      return false;
    };
    const handleExceed = (files, fileList) => {
      ElMessage({
        type: "info",
        message: "最多上传10张图片",
        showClose: true,
      });
    };
    const formatTooltip = (val) => {
      return val / 100;
    };

    //大图预览
    const preview = (index) => {
      let imgData = getImgData(index);
      if (imgData == false) {
        ElMessage({
          showClose: true,
          type: "info",
          message: "图片丢失",
        });
        return;
      }
      previewData.value = imgData;
      previewFlag.value = true;
    };

    //关闭预览
    const closePreview = (index) => {
      previewData.value = "";
      previewFlag.value = false;
    };

    //重置样式
    const resetStyle = () => {
      size.value = 25;
      angle.value = 45;
      color.value = "rgba(249, 183, 38, 0.66)";
      space.value = 2;
      redraw();
    };

    // 变更颜色
    const changeColor = (curColor) => {
      color.value = curColor;
      redraw();
    };

    return {
      size,
      angle,
      color,
      text,
      space,
      sizeLimit,
      fileIndex,
      previewData,
      previewFlag,
      dataMap,
      beforeUpload,
      handleExceed,
      changeColor,
      clearImgs,
      setFile,
      getFile,
      setImg,
      getImg,
      setCanvas,
      getCanvas,
      handleDrawText,
      formatTooltip,
      downloadZip,
      preview,
      closePreview,
      resetStyle,
      batchDownload,
      download,
    };
  },
};
</script>

<template>
  <Nav />
  <el-card class="box-card">
    <div class="config">
      <el-row>
        <el-col :offset="4" :span="16">
          <el-upload
            class="upload-demo"
            action=""
            :show-file-list="false"
            :before-upload="beforeUpload"
            multiple
            drag
            :limit="10"
            :on-exceed="handleExceed"
          >
            <i-ep-upload-filled class="el-icon-upload"></i-ep-upload-filled>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="upload-tips el-upload__text">只能上传jpg/png文件</div>
            <div class="upload-tips el-upload__text">
              文件大小不超过{{ sizeLimit }}M，且不超过10张
            </div>
          </el-upload>
        </el-col>
        <el-col :offset="4" :span="16">
          <el-input
            placeholder="请输入水印文字"
            v-model="text"
            @input="handleDrawText"
          ></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">
              <div class="demonstration">
                <span>大小</span>
              </div>
            </el-col>
            <el-col :span="18">
              <el-slider
                v-model="size"
                :min="10"
                :format-tooltip="formatTooltip"
                @input="handleDrawText"
              ></el-slider>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">
              <div class="demonstration">
                <span>角度</span>
              </div>
            </el-col>
            <el-col :span="18">
              <el-slider
                v-model="angle"
                :min="0"
                :max="360"
                @input="handleDrawText"
              ></el-slider>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">
              <div class="demonstration">
                <span>间距</span>
              </div>
            </el-col>
            <el-col :span="18">
              <el-slider
                v-model="space"
                :min="0"
                :max="5"
                :step="0.05"
                @input="handleDrawText"
              ></el-slider>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">
              <div class="demonstration">
                <span>颜色</span>
              </div>
            </el-col>
            <el-col :span="18">
              <el-color-picker
                v-model="color"
                show-alpha
                @active-change="changeColor"
              ></el-color-picker>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="button-group" v-if="fileIndex > 0">
      <el-button-group>
        <el-button type="primary" @click="clearImgs"
          ><el-icon class="el-icon--left"><i-ep-delete></i-ep-delete></el-icon
          >清空图片</el-button
        >
        <el-button type="primary" @click="resetStyle">
          <el-icon class="el-icon--left"><i-ep-refresh></i-ep-refresh></el-icon>
          重置样式</el-button
        >
        <el-button type="primary" @click="batchDownload">
          <el-icon class="el-icon--left"
            ><i-ep-download></i-ep-download
          ></el-icon>
          批量下载</el-button
        >
        <el-button type="primary" @click="downloadZip"
          ><el-icon class="el-icon--left"
            ><i-ep-download></i-ep-download></el-icon
          >打包下载</el-button
        >
      </el-button-group>
    </div>

    <div v-if="fileIndex > 0">
      <el-row
        v-for="row in fileIndex % 2 == 0 ? fileIndex / 2 : (fileIndex + 1) / 2"
        class="img-row"
        :gutter="30"
        :key="row"
      >
        <el-col :span="12" v-for="col in 2" :key="col">
          <div class="box-canvas" v-if="(row - 1) * 2 + (col - 1) < fileIndex">
            <canvas :id="'canvas_' + ((row - 1) * 2 + (col - 1))"></canvas>
            <div class="shadow">
              <div>
                <i-ep-search
                  class="shadow-icon"
                  @click="preview((row - 1) * 2 + (col - 1) + 1)"
                ></i-ep-search>
                <i-ep-download
                  class="shadow-icon"
                  @click="download((row - 1) * 2 + (col - 1) + 1)"
                ></i-ep-download>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>

  <div class="preview-img" v-if="previewFlag">
    <i-ep-close
      class="close-icon el-icon-circle-close"
      @click="closePreview()"
    ></i-ep-close>
    <el-image v-if="previewData" :src="previewData">
      <div class="placeholder-slot">
        <i-ep-loading class="el-icon-loading"></i-ep-loading>
      </div>
    </el-image>
  </div>

  <div id="downloadLinks"></div>
</template>

<style scoped>
/* 卡片 */
.box-card {
  margin: 20px;
  border: 0;
  border-radius: 16px;
  min-height: calc(100vh - 88px);
}

.box-card > .el-card__header {
  padding: 0;
  border-bottom: 0;
}
.el-menu--horizontal > .el-menu-item {
  border-radius: 4px;
  border-bottom: 0;
}
.el-menu--horizontal > .el-menu-item.is-active {
  background-color: #409eff !important;
  font-weight: 600 !important;
  color: #fff !important;
}

/* github标签 */
.tag {
  background-color: darkcyan;
  position: absolute;
  top: 12px;
  right: -25px;
  text-align: center;
  width: 90px;
  height: 20px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #fff;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

.tag:hover {
  cursor: pointer;
}

/* 上传 */
.upload-demo {
  text-align: center;
  width: 100%;
  /* border-style: solid; */
}
.upload-demo > div.el-upload {
  width: 100% !important;
  display: inline-block;
}
.el-icon-upload {
  margin-top: 20px;
  font-size: 32px;
  color: #575353;
}
.el-upload-dragger {
  width: 100%;
}
.upload-tips {
  font-size: 12px !important;
  margin: 5px 0px;
  color: #6062669e !important;
}

/* 配置区 */
.config {
  margin: 20px 20px;
}

.config > .el-row {
  margin: 10px 0px;
}
.el-col {
  margin-bottom: 10px;
}

/* 配置区文字 */
.demonstration {
  line-height: 40px;
}

/* 按钮区 */
.button-group {
  text-align: center;
  margin: 40px 0px;
}

.btn-donate {
  color: #fff;
  background-color: #ffb23f;
  border-color: #ffb23f;
}

.btn-donate:hover {
  color: #fff;
  background-color: #f7be68;
  border-color: #f7be68;
}

/* 图片栅栏 */
.img-row {
  margin: 10px 0px;
}

/* 画图区盒子 */
.box-canvas {
  position: relative;
  text-align: center;
  height: 300px;
}

/* 遮罩 */
.shadow {
  position: absolute;
  display: none;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.box-canvas:hover .shadow {
  display: block;
}
.shadow > div {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.shadow > div > .shadow-icon {
  color: white;
  font-size: 30px;
  line-height: 100px;
  cursor: pointer;
  margin: 0px 20px;
}

/* 画图区 */
canvas {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.btn_img {
  color: #fff;
}

/* 下载区 */
#downloadLinks {
  display: none;
}

/* 预览区 */
.preview-img {
  background-color: rgba(0, 0, 0, 0.6);
  text-align: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 100%;
  z-index: 5000;
}

.preview-img > .el-image {
  margin: 30px auto;
  max-width: 90%;
  height: 90%;
  /* display: flex;
  justify-content: center;
  align-items: center; */
}

.preview-img > * > .el-image__error,
.el-image__inner {
  max-width: 100%;
  max-height: 100%;
  object-fit: scale-down;
}

.preview-img > * > .placeholder-slot {
  color: white;
  font-size: 25px;
}

.preview-img > .close-icon {
  color: white;
  font-size: 30px;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
}
</style>
