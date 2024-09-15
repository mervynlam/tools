<script setup>
import { nextTick, reactive, watch } from 'vue'
import { NInput, NIcon } from 'naive-ui'
import SettingSlider from '@/components/settingItems/SettingSlider.vue'
import SettingColor from '@/components/settingItems/SettingColor.vue'
import UploadFile from './UploadFile.vue'
import { MdSearch, MdDownload } from '@vicons/ionicons4'
import { drawImg, getFontContext } from '@/utils/canvas'

const imageList = reactive([])
const config = reactive({
  words: '',
  size: 25,
  angle: 45,
  space: 2,
  colSpace: 2,
  color: 'rgba(149,149,149, 0.5)'
})

const idPrefix = 'water_mark_canvas_'
const canvasList = []

watch(config, () => {
  nextTick(() => {
    draw()
  })
})

const handleFileChange = (fileList) => {
  imageList.splice(0, imageList.length, ...fileList)
  nextTick(() => {
    draw()
  })
}

const draw = () => {
  drawThumbnail()
  drawMark()
}

const drawThumbnail = () => {
  imageList.forEach(({ file }, index) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        const canvas = getCanvas(index)
        drawImg(canvas, img)
        drawMark(canvas)
      }
    }
    fileReader.readAsDataURL(file)
  })
}
const drawMark = (canvas) => {
  if (!canvas) return
  const textSize = (config.size / 100) * Math.max(20, Math.min(canvas.width, canvas.height) / 5)

  const fontCtx = getFontContext(canvas, {
    size: textSize,
    color: config.color,
    rotate: config.angle
  })

  //文字宽度
  const textWidth = fontCtx.measureText(config.words).width

  //由于可旋转角度，取宽高较大值乘一定数额，避免空白
  const maxWidth = Math.max(canvas.width, canvas.height) * 1.8
  //行数
  const row = Math.ceil(maxWidth / (textSize + textSize * config.space))

  //列数
  const col = Math.ceil(maxWidth / (textWidth + textSize * config.colSpace))

  for (let i = -1 * row; i < row; ++i) {
    for (let j = -1 * col; j < col; ++j) {
      //偏移量，隔行偏移
      let offset = 0
      if (i % 2 != 0) offset = (textWidth + textSize * config.colSpace) / 2
      fontCtx.fillText(
        config.words,
        (textWidth + textSize * config.colSpace) * j - offset,
        (textSize + textSize * config.space) * i
      )
    }
  }
}
const getCanvas = (index) => {
  canvasList[index] ??= document.getElementById(idPrefix + index)
  return canvasList[index]
}
</script>
<template>
  <div class="d-flex flex-column gap-3">
    <upload-file @change-file-list="handleFileChange" />
    <n-input round v-model:value="config.words" placeholder="水印文字" />
    <div class="d-flex gap-4 flex-wrap settings">
      <setting-slider
        classname="item"
        v-model:value="config.size"
        label="大小"
        :min="10"
        :tooltip="false"
      />
      <setting-slider
        classname="item"
        v-model:value="config.angle"
        label="角度"
        :min="0"
        :max="360"
        :tooltip="false"
      />
      <setting-slider
        classname="item"
        v-model:value="config.space"
        label="行间距"
        :min="0"
        :max="5"
        :step="0.1"
        :tooltip="false"
      />
      <setting-slider
        classname="item"
        v-model:value="config.colSpace"
        label="列间距"
        :min="0"
        :max="10"
        :step="0.1"
        :tooltip="false"
      />
      <setting-color classname="item" v-model:value="config.color" label="颜色" />
    </div>
  </div>
  <div class="d-flex flex-wrap image-list gap-4">
    <div
      v-for="(image, index) in imageList"
      :key="image.name"
      class="image-item h-300px position-relative d-flex flex-center"
    >
      <canvas :id="idPrefix + index" class="mw-100 mh-100"></canvas>
      <div class="shadow w-100 h-100 bg-black-50 position-absolute top-0 left-0 flex-center gap-6">
        <div class="cursor-pointer rounded-lg button d-flex flex-center">
          <n-icon size="60" :component="MdSearch" />
        </div>
        <div class="cursor-pointer rounded-lg button d-flex flex-center">
          <n-icon size="60" :component="MdDownload" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings {
  .item {
    flex: 0 0 calc(50% - 1rem);
  }
}

.image-list {
  .image-item {
    flex: 0 0 calc(50% - 1rem);
  }
  .image-item:hover {
    .shadow {
      display: flex;
    }
  }
}

.shadow {
  display: none;
  .button:hover {
    color: var(--gray-light);
  }
  .button {
    color: white;
  }
}
</style>