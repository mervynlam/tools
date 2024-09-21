<script setup>
import { nextTick, onMounted, reactive, watch } from 'vue'
import { NInput, NIcon, NImage, NButton, NButtonGroup, NUploadDragger } from 'naive-ui'
import SettingInput from '@/components/settingItems/SettingInput.vue'
import SettingSlider from '@/components/settingItems/SettingSlider.vue'
import SettingColor from '@/components/settingItems/SettingColor.vue'
import UploadFile from '@/components/UploadFile.vue'
import { MdSearch, MdDownload, IosClose, MdCloudUpload } from '@vicons/ionicons4'
import { drawImg, getCanvasDataUrl, getFontContext } from '@/utils/canvas'
import moment from 'moment'
import { downloadImage } from '@/utils/download'
import { debounce } from 'lodash'
import { useGlobalStore } from '@/store'
import { setConfig } from '@/utils/utils'

const store = useGlobalStore()

const initConfig = {
  words: '',
  size: 25,
  angle: 45,
  rowSpace: 2,
  colSpace: 2,
  color: 'rgba(149,149,149, 0.5)'
}
const sizeLimit = 10
const amountLimit = 10

const imageList = reactive({
  set: new Set(),
  list: []
})
const config = reactive({ ...initConfig })
const preview = reactive({
  show: false,
  url: ''
})

const idPrefix = 'water_mark_canvas_'
const storeKey = 'water_mark_config'
const canvasList = []

const saveStore = debounce((config) => {
  localStorage.setItem(storeKey, JSON.stringify(config))
}, 300)

watch(config, (newValue) => {
  nextTick(() => {
    draw()
  })
  saveStore(newValue)
})

const draw = () => {
  drawThumbnail()
  drawMark()
}

const drawThumbnail = () => {
  imageList.list.forEach(({ file }, index) => {
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
  const row = Math.ceil(maxWidth / (textSize + textSize * config.rowSpace))

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
        (textSize + textSize * config.rowSpace) * i
      )
    }
  }
}
const getCanvas = (index) => {
  canvasList[index] ??= document.getElementById(idPrefix + index)
  return canvasList[index]
}

const generateFileName = (originName) => {
  const extIndex = originName.lastIndexOf('.')
  return (
    originName.substring(0, extIndex >= 0 ? extIndex : originName.length) +
    '_' +
    moment().format('YYYYMMDDHHmmssSSS') +
    '.png'
  )
}

const handleBeforeUpload = ({ file }) => {
  const { name, size } = file.file

  if (imageList.list.length >= amountLimit) {
    store.open_error_message(`${file.name} 添加失败，图片数量达到上限 ${amountLimit} 张。`)
    return false
  }

  if (size > sizeLimit * 1024 * 1024) {
    store.open_error_message(`${file.name} 超过 ${sizeLimit}M，添加失败。`)
    return false
  }

  const uid = name + size
  if (imageList.set.has(uid)) {
    store.open_error_message(`图片${name}已存在`)
    return false
  }
  imageList.set.add(uid)
  imageList.list.push(file)

  nextTick(() => {
    draw()
  })
}

const handlePreviewClick = (index) => {
  const url = getCanvasDataUrl(getCanvas(index))
  preview.show = true
  preview.url = url
}

const handlePreviewClose = () => {
  preview.show = false
  preview.url = ''
}

const handleDownloadClick = (index) => {
  const url = getCanvasDataUrl(getCanvas(index))
  const { name } = imageList.list[index]
  const filename = generateFileName(name)
  downloadImage(filename, url)
}

const handleClearList = () => {
  imageList.list.splice(0, imageList.list.length)
  imageList.set.clear()
  canvasList.splice(0, canvasList.length)
}

const handleResetConfig = () => {
  setConfig(initConfig, config)
}

const handleBatchDownload = () => {
  imageList.list.forEach((_, index) => {
    handleDownloadClick(index)
  })
}

onMounted(() => {
  const configStr = localStorage.getItem(storeKey)
  const storeConfig = JSON.parse(configStr)
  delete storeConfig.words
  setConfig(storeConfig, config)
})
</script>
<template>
  <div class="d-flex flex-column gap-8 align-items-center">
    <upload-file @before-upload="handleBeforeUpload">
      <n-upload-dragger class="">
        <div class="d-flex flex-column flex-center gap-3 w-500px">
          <n-icon size="38" :component="MdCloudUpload" :depth="3" />
          <span>点击或者拖动文件到该区域来上传</span>
          <span class="text-black-50 fs-0-8">只能上传jpg/png文件</span>
          <span class="text-black-50 fs-0-8">
            文件不超过{{ sizeLimit }}M，且不超过{{ amountLimit }}张
          </span>
        </div>
      </n-upload-dragger>
    </upload-file>
    <setting-input class="w-100" v-model:value="config.words" placeholder="水印文字" size="large" />
    <div class="d-flex gap-8 flex-wrap justify-content-center settings">
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
        v-model:value="config.rowSpace"
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
    <n-button-group v-if="imageList.list.length > 0">
      <n-button type="primary" size="medium" @click="handleClearList" round>清空图片</n-button>
      <n-button type="primary" size="medium" @click="handleResetConfig">恢复配置</n-button>
      <n-button type="primary" size="medium" @click="handleBatchDownload" round>批量下载</n-button>
    </n-button-group>

    <div class="d-flex flex-wrap image-list gap-4 w-100">
      <div
        v-for="(image, index) in imageList.list"
        :key="image.name"
        class="image-item h-300px position-relative d-flex flex-center"
      >
        <canvas :id="idPrefix + index" class="mw-100 mh-100"></canvas>
        <div
          class="shadow w-100 h-100 bg-black-50 position-absolute top-0 left-0 flex-center gap-6"
        >
          <div
            class="cursor-pointer rounded-lg button d-flex flex-center"
            @click="handlePreviewClick(index)"
          >
            <n-icon size="60" :component="MdSearch" />
          </div>
          <div
            class="cursor-pointer rounded-lg button d-flex flex-center"
            @click="handleDownloadClick(index)"
          >
            <n-icon size="60" :component="MdDownload" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="position-fixed w-100 vh-100 bg-black-50 top-0 left-0 d-flex flex-center flex-column gap-3"
    v-if="preview.show"
  >
    <n-image
      class="h-75 mw-100 justify-content-center"
      objectFit="contain"
      :src="preview.url"
      :preview-disabled="true"
    />

    <n-button text @click="handlePreviewClose">
      <n-icon color="var(--white)" size="30" :component="IosClose" />
    </n-button>
  </div>
</template>

<style lang="scss" scoped>
.settings {
  .item {
    flex: 0 0 calc(50% - 2rem);
    min-width: 600px;
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