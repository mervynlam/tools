<script setup>
import { nextTick, onMounted, reactive, watch } from 'vue'
import SettingSlider from '@/components/settingItems/SettingSlider.vue'
import SettingInput from '@/components/settingItems/SettingInput.vue'
import SettingColor from '@/components/settingItems/SettingColor.vue'
import SettingRadio from '@/components/settingItems/SettingRadio.vue'
import { styleArr, paperArr, customPaper } from './constants'
import { cm2px, setConfig } from '@/utils/utils'
import { drawLine, drawRect, drawText } from '@/utils/canvas'
import { debounce } from 'lodash'

const canvasId = 'grid_canvas'
const storeKey = 'grid_config'

const config = reactive({
  size: 1.5,
  title: '',
  titlePosition: 0.75, //TODO
  titleSize: 50, //TODO
  style: 'tian',
  color: 'rgba(61, 61, 61, 1)',
  paper: 'A4',
  width: 21,
  height: 29.7,
  transition: 1,
  pageSpace: 1.5 //TODO
})

onMounted(() => {
  const configStr = localStorage.getItem(storeKey)
  const storeConfig = JSON.parse(configStr)
  setConfig(storeConfig, config)
  draw()
})

watch(config, (newValue) => {
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
  const canvas = getCanvas()
  //clear
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const widthPx = cm2px(config.width)
  const heightPx = cm2px(config.height)

  canvas.width = widthPx
  canvas.height = heightPx

  //background color
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, widthPx, heightPx)

  //格子数量
  const horizontalNum = Math.floor((config.width - 2 * config.pageSpace) / config.size)
  const verticalNum = Math.floor((config.height - 2 * config.pageSpace) / config.size)

  //边距(cm)
  const hSpace = ((config.width - horizontalNum * config.size) / 2).toFixed(2)
  const vSpace = ((config.height - verticalNum * config.size) / 2).toFixed(2)
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
      drawText(canvas, config.title, config.color, widthPx / 2, vSpacePx * config.titlePosition)
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

  // drawGridMethod.drawHorizontal()
  // drawGridMethod.drawVertical()
  // drawGridMethod.drawDottedHorizontal()
  // drawGridMethod.drawDottedVertical()
  // drawGridMethod.drawDiagonal()
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

const getCanvas = () => {
  return document.getElementById(canvasId)
}
</script>

<template>
  <div class="d-flex flex-column align-items-center h-100">
    <div class="d-flex flex-wrap justify-content-center settings gap-8 w-100">
      <setting-slider
        class="item"
        v-model:value="config.size"
        label="大小"
        :min="0.5"
        :max="8"
        :step="0.1"
      />
      <setting-input
        class="item"
        label="标题"
        v-model:value="config.title"
        size="large"
        placeholder="请输入标题"
      />
      <setting-radio class="item" label="样式" v-model:value="config.style" :options="styleArr" />
      <setting-color class="item" v-model:value="config.color" label="颜色" />
      <setting-radio
        class="item"
        label="纸张大小"
        v-model:value="config.paper"
        :options="[
          ...paperArr.map((item) => ({ label: item.value, value: item.value })),
          customPaper
        ]"
      />
      <setting-slider
        class="item"
        label="过渡"
        v-model:value="config.transition"
        :min="0.1"
        :max="1"
        :step="0.05"
      />
    </div>
    <div class="flex-fill">
      <canvas :id="canvasId" class="w-100"></canvas>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.settings {
  .item {
    flex: 0 0 calc(50% - 2rem);
    min-width: 600px;
  }
}
</style>