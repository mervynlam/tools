<script setup>
import { nextTick, onMounted, reactive, watch } from 'vue'
import SettingSlider from '@/components/settingItems/SettingSlider.vue'
import SettingInput from '@/components/settingItems/SettingInput.vue'
import SettingColor from '@/components/settingItems/SettingColor.vue'
import SettingRadio from '@/components/settingItems/SettingRadio.vue'
import UploadFile from '@/components/UploadFile.vue'
import { NSwitch, NButton, NUploadDragger } from 'naive-ui'
import { NInputNumber } from 'naive-ui'
import { styleArr, paperArr, customPaper } from './constants'
import { cm2px, rgbStr2Rgba, setConfig } from '@/utils/utils'
import {
  drawImg,
  drawImgInside,
  drawLine,
  drawRect,
  drawText,
  getCanvasDataUrl,
  replaceColor
} from '@/utils/canvas'
import { debounce } from 'lodash'
import { downloadPDF } from '@/utils/download'
import { useGlobalStore } from '@/store'

const store = useGlobalStore()

const canvasId = 'grid_canvas'
const noteCanvasId = 'grid_canvas_note'
const storeKey = 'grid_config'

const config = reactive({
  size: 1.5,
  title: '',
  titlePosition: 0.75,
  titleSize: 50,
  style: 'tian',
  color: 'rgba(61, 61, 61, 1)',
  paper: 'A4',
  width: 21,
  height: 29.7,
  transition: 1,
  pageSpace: 1.5,
  transpose: false
})

const note = reactive({
  file: null,
  size: 1,
  x: 0,
  y: 0.5
})

onMounted(() => {
  const configStr = localStorage.getItem(storeKey)
  const storeConfig = JSON.parse(configStr)
  setConfig(storeConfig, config)
  draw()
})

watch([config, note], (newValue) => {
  nextTick(() => {
    draw()
  })
  saveStore(newValue)
})

watch(
  () => config.paper,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (paperArr.map((item) => item.value).includes(newValue)) {
        const paper = paperArr.filter((item) => item.value === newValue).at(0)
        config.width = paper.width
        config.height = paper.height
      }
    }
  }
)

const saveStore = debounce((config) => {
  localStorage.setItem(storeKey, JSON.stringify(config))
}, 300)

const draw = () => {
  const canvas = getCanvas(canvasId)
  //clear
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  //转置
  const realWidth = config.transpose ? config.height : config.width
  const realHeight = config.transpose ? config.width : config.height

  const widthPx = cm2px(realWidth)
  const heightPx = cm2px(realHeight)

  canvas.width = widthPx
  canvas.height = heightPx

  //background color
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, widthPx, heightPx)

  //格子数量
  const horizontalNum = Math.floor((realWidth - 2 * config.pageSpace) / config.size)
  const verticalNum = Math.floor((realHeight - 2 * config.pageSpace) / config.size)

  //边距(cm)
  const hSpace = ((realWidth - horizontalNum * config.size) / 2).toFixed(2)
  const vSpace = ((realHeight - verticalNum * config.size) / 2).toFixed(2)
  const hSpacePx = cm2px(hSpace)
  const vSpacePx = cm2px(vSpace)
  const sizePx = cm2px(config.size)

  const normalWeight = 4
  const boldWeight = 10
  const thinWeight = 2
  const dottedDash = [10, 10]

  const drawGridMethod = {
    drawpBorder: () => {
      //边框
      drawRect(
        ctx,
        config.color,
        normalWeight,
        hSpacePx,
        vSpacePx,
        horizontalNum * sizePx,
        verticalNum * sizePx
      )
      drawRect(
        ctx,
        config.color,
        boldWeight,
        hSpacePx - 30,
        vSpacePx - 30,
        horizontalNum * sizePx + 60,
        verticalNum * sizePx + 60
      )
    },
    drawTitle: () => {
      //标题
      drawText(
        canvas,
        config.title,
        config.titleSize,
        config.color,
        widthPx / 2,
        vSpacePx * config.titlePosition
      )
    },
    drawHorizontal: () => {
      for (let i = vSpacePx + sizePx, j = 0; j < verticalNum; i += sizePx, j++) {
        drawLine(ctx, config.color, normalWeight, hSpacePx, i, widthPx - hSpacePx, i)
      }
    },
    drawVertical: () => {
      for (let i = hSpacePx + sizePx, j = 0; j < horizontalNum; i += sizePx, j++) {
        drawLine(ctx, config.color, normalWeight, i, vSpacePx, i, heightPx - vSpacePx)
      }
    },
    drawDottedHorizontal: (transition = 1) => {
      for (let i = vSpacePx + sizePx / 2, j = 0; j < verticalNum; i += sizePx, j++) {
        drawLine(
          ctx,
          config.color,
          thinWeight,
          hSpacePx,
          i,
          Math.floor(horizontalNum * transition) * sizePx + hSpacePx,
          i,
          dottedDash
        )
      }
    },
    drawDottedVertical: (transition = 1) => {
      for (
        let i = hSpacePx + sizePx / 2, j = 0;
        j < Math.floor(horizontalNum * transition);
        i += sizePx, j++
      ) {
        drawLine(ctx, config.color, thinWeight, i, vSpacePx, i, heightPx - vSpacePx, dottedDash)
      }
    },
    drawDiagonal: () => {
      for (let i = hSpacePx, k1 = 0; k1 < horizontalNum; i += sizePx, k1++) {
        for (let j = vSpacePx, k2 = 0; k2 < verticalNum; j += sizePx, k2++) {
          drawLine(ctx, config.color, thinWeight, i, j, i + sizePx, j + sizePx, dottedDash)
          drawLine(ctx, config.color, thinWeight, i + sizePx, j, i, j + sizePx, dottedDash)
        }
      }
    }
  }
  drawGridMethod.drawpBorder()
  drawGridMethod.drawTitle()
  if (note.file) {
    drawNote(widthPx, heightPx)
  }

  switch (config.style) {
    case 'mi':
      drawGridMethod.drawHorizontal()
      drawGridMethod.drawVertical()
      drawGridMethod.drawDottedHorizontal()
      drawGridMethod.drawDottedVertical()
      drawGridMethod.drawDiagonal()
      break
    case 'tian':
      drawGridMethod.drawHorizontal()
      drawGridMethod.drawVertical()
      drawGridMethod.drawDottedHorizontal(config.transition)
      drawGridMethod.drawDottedVertical(config.transition)
      break
    case 'square':
      drawGridMethod.drawHorizontal()
      drawGridMethod.drawVertical()
      break
    case 'vertical':
      drawGridMethod.drawVertical()
      break
    case 'horizontal':
      drawGridMethod.drawHorizontal()
      break
    case 'vertical_dotted':
      drawGridMethod.drawVertical()
      drawGridMethod.drawDottedVertical()
      break
    case 'horizontal_dotted':
      drawGridMethod.drawHorizontal()
      drawGridMethod.drawDottedHorizontal()
      break
    default:
      drawGridMethod.drawHorizontal()
      drawGridMethod.drawVertical()
      drawGridMethod.drawDottedHorizontal()
      drawGridMethod.drawDottedVertical()
      drawGridMethod.drawDiagonal()
  }
}

const getFileName = (realWidth, realHeight) => {
  const fileName = []
  if (config.title) {
    fileName.push(config.title)
  }
  fileName.push(config.paper)
  if (config.paper === 'costom') {
    fileName.push(`${realWidth}_${realHeight}`)
  }
  fileName.push(styleArr.filter((item) => item.value === config.style).at(0).label)
  fileName.push(config.size)
  if (config.style === 'tian' && config.transition !== 1) {
    fileName.push(config.transition)
  }
  return fileName.join('_')
}

const getCanvas = (id) => {
  return document.getElementById(id)
}

const drawNote = (widthPx, heightPx) => {
  const noteCanvas = getCanvas(noteCanvasId)
  const canvas = getCanvas(canvasId)
  replaceColor(noteCanvas, rgbStr2Rgba(config.color))
  drawImgInside(canvas, noteCanvas, note.size, widthPx * note.x, heightPx * note.y)
}

const handleDownloadPdf = () => {
  const realWidth = config.transpose ? config.height : config.width
  const realHeight = config.transpose ? config.width : config.height
  const url = getCanvasDataUrl(getCanvas(canvasId))
  const fileName = getFileName(realWidth, realHeight)
  downloadPDF(realWidth, realHeight, url, fileName)
}

const handleBeforeUpload = ({ file: fileArg }) => {
  const { file } = fileArg
  const { size } = file

  if (size > 1024 * 1024) {
    store.open_error_message(`${file.name} 超过 1M，添加失败。`)
    return false
  }
  note.file = file
  const fileReader = new FileReader()
  fileReader.onload = (e) => {
    const img = new Image()
    img.src = e.target.result
    img.onload = () => {
      const canvas = getCanvas(noteCanvasId)
      drawImg(canvas, img)
      draw()
    }
  }
  fileReader.readAsDataURL(file)
}
</script>

<template>
  <div class="d-flex h-100 gap-8 mw-100 justify-content-between">
    <div class="settings d-flex flex-column align-items-center gap-6">
      <setting-slider
        class="w-100"
        v-model:value="config.pageSpace"
        label="边距"
        :min="0"
        :max="Math.floor(Math.min(config.height, config.width) / 2)"
        :step="0.1"
      />
      <setting-slider
        class="w-100"
        v-model:value="config.size"
        label="大小"
        :min="0.5"
        :max="8"
        :step="0.1"
      />
      <setting-input
        class="w-100"
        label="标题"
        v-model:value="config.title"
        size="large"
        placeholder="请输入标题"
      />
      <setting-slider
        class="w-100"
        v-model:value="config.titlePosition"
        label="标题位置"
        :min="0"
        :max="1"
        :step="0.05"
        :tooltip="false"
      />
      <setting-slider
        class="w-100"
        v-model:value="config.titleSize"
        label="标题大小"
        :min="15"
        :max="100"
        :step="1"
        :tooltip="false"
      />
      <setting-radio class="w-100" label="样式" v-model:value="config.style" :options="styleArr" />
      <setting-radio
        class="w-100"
        label="纸张大小"
        v-model:value="config.paper"
        :options="[
          ...paperArr.map((item) => ({ label: item.value, value: item.value })),
          customPaper
        ]"
      >
        <div class="d-flex gap-3">
          <n-switch v-model:value="config.transpose">
            <template #checked>{{ checkedLabel ?? '转置' }}</template>
            <template #unchecked>{{ uncheckedLabel ?? '不转置' }}</template>
          </n-switch>
          <div class="d-flex flex-center" v-if="config.paper === 'custom'">
            <n-input-number
              round
              placeholder="宽"
              :min="0"
              :max="50"
              :show-button="false"
              v-model:value="config.width"
              class="w-80px"
              size="small"
            />
            <n-input-number
              round
              placeholder="高"
              :min="0"
              :max="50"
              :show-button="false"
              v-model:value="config.height"
              class="w-80px"
              size="small"
            />
          </div>
        </div>
      </setting-radio>
      <setting-color class="w-100" v-model:value="config.color" label="颜色" />
      <setting-slider
        class="w-100"
        label="过渡"
        v-model:value="config.transition"
        :min="0.1"
        :max="1"
        :step="0.05"
      />
      <upload-file @before-upload="handleBeforeUpload" :multiple="false">
        <n-upload-dragger class="">
          <div class="d-flex flex-column w-100px">
            <span>上传小笺</span>
          </div>
        </n-upload-dragger>
      </upload-file>
      <div v-if="note.file" class="d-flex flex-column align-items-center gap-6 w-100">
        <setting-slider
          class="w-100"
          label="小笺大小"
          v-model:value="note.size"
          :min="0"
          :max="1"
          :step="0.005"
          :tooltip="false"
        />
        <setting-slider
          class="w-100"
          label="小笺横坐标"
          v-model:value="note.x"
          :min="0"
          :max="1"
          :step="0.005"
          :tooltip="false"
        />
        <setting-slider
          class="w-100"
          label="小笺纵坐标"
          v-model:value="note.y"
          :min="0"
          :max="1"
          :step="0.005"
          :tooltip="false"
        />
      </div>
      <div>
        <n-button type="primary" size="medium" @click="handleDownloadPdf" round>下载PDF</n-button>
      </div>
    </div>
    <div class="image-preview d-flex flex-column align-items-center overflow-auto">
      <canvas :id="noteCanvasId" class="mh-400px mw-400px d-none"></canvas>
      <canvas :id="canvasId" class="mh-125 mw-100"></canvas>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.settings {
  flex: 0 0 33.33%;
}
.image-preview {
  flex: 0 0 66.67%;
}
</style>