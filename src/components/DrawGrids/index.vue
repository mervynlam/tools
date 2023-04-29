<template>
  <Nav />
  <el-card class="box-card">
    <div class="config">
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
                :min="0.5"
                :max="8"
                :step="0.1"
                @input="handleDraw"
              ></el-slider>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">
              <div class="demonstration">
                <span>标题</span>
              </div>
            </el-col>
            <el-col :span="18">
          <el-input
            placeholder="请输入标题"
            v-model="text"
            @input="handleDraw"
          ></el-input>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">
              <div class="demonstration">
                <span>样式</span>
              </div>
            </el-col>
            <el-col :span="18">
              <el-radio-group v-model="type" @change="handleDraw">
                <el-radio v-for="item in typeOptions" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
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
      <el-row :gutter="50">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">
              <div class="demonstration">
                <span>纸张大小</span>
              </div>
            </el-col>
            <el-col :span="18">
              <el-radio-group v-model="paperType" @change="handleDraw">
                <el-radio v-for="item in paperOptions" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="button-group">
      <el-button-group>
        <el-button type="primary" @click="download">
          <el-icon class="el-icon--left"
            ><i-ep-download></i-ep-download
          ></el-icon>
          下载</el-button
        >
      </el-button-group>
    </div>

    <div id="canvas-box">
      <canvas id="gridCanvas"></canvas>
    </div>
  </el-card>

  <div id="downloadLinks"></div>
</template>
<script>
import { onMounted } from "vue";
import imageJs from "./image.js";
import {paperOptions, typeOptions} from "./constants.js";
export default {
  setup() {
    const size = ref(1.5);//方格大小
    const color = ref("rgba(69, 69, 69, 1)");
    const text = ref("");//标题
    const type = ref('1');//格子类型
    const paperType = ref("0")
    const { drawImg, downloadImg } = imageJs(
      size,
      color,
      text,
      type,
      paperType
    );

    //画
    const handleDraw = () => {
      drawImg();
    };

    //下载单图
    function download() {
      downloadImg();
    }

    // 变更颜色
    const changeColor = (curColor) => {
      color.value = curColor;
      drawImg();
    };

    onMounted(() => {
      drawImg()
    })

    return {
      size,
      color,
      text,
      type,
      paperType,
      typeOptions,
      paperOptions,
      changeColor,
      handleDraw,
      download,
    };
  },
};
</script>
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
  margin: 5px 0px;
}

/* 画图区 */
#canvas-box{
  height:1500px;
  position: relative;
  text-align: center;
}

canvas {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* 下载区 */
#downloadLinks {
  display: none;
}
</style>
