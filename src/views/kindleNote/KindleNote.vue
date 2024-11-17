<script setup>
import { onMounted, reactive } from 'vue'
import { NIcon, NButton, NButtonGroup, NUploadDragger } from 'naive-ui'
import UploadFile from '@/components/UploadFile.vue'
import { MdCloudUpload } from '@vicons/ionicons4'
import { debounce } from 'lodash'
import { useGlobalStore } from '@/store'
import { download } from '@/utils/download'

const store = useGlobalStore()

const className = {
  title: 'bookTitle',
  authors: 'authors',
  section: 'sectionHeading',
  anchor: 'noteHeading',
  text: 'noteText'
}
const notes = reactive({
  title: '',
  author: '',
  notes: []
})

const handleBeforeUpload = ({ file }) => {
  handleClear()
  const reader = new FileReader()

  reader.onload = (e) => {
    const htmlString = e.target.result
    const content = getBodyDom(htmlString)
    getNotes(content)
  }
  reader.readAsText(file.file)
}

const getBodyDom = (htmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  return doc.querySelector('body>div.bodyContainer')
}

const getNotes = (contentDom) => {
  if (!contentDom) {
    store.open_error_message('请上传正确的 Kindle 笔记文件。')
    return
  }
  const items = contentDom.querySelectorAll('&>div')
  items.forEach((item) => {
    const textContent = getText(item)
    if (item.classList.contains(className.title)) {
      notes.title = textContent
    }
    if (item.classList.contains(className.authors)) {
      notes.author = textContent
    }
    if (item.classList.contains(className.section)) {
      notes.notes.push('')
      notes.notes.push(textContent)
    }
    if (item.classList.contains(className.anchor)) {
      notes.notes.push('')
      notes.notes.push(
        textContent
          .replaceAll(/\(\s*\)\s*-\s*/g, '')
          .replaceAll('标注', '🔖')
          .replaceAll(/笔记\s*-/g, '🎙')
      )
    }
    if (item.classList.contains(className.text)) {
      notes.notes.push(textContent)
    }
  })
}

const getText = (dom) => {
  return Array.from(dom.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE) // 只保留文本节点
    .map((node) => node.textContent.trim()) // 获取文本内容并去空格
    .join('') // 拼接所有直接文字内容
}

const handleDownloadClick = debounce(
  () => {
    download(generateNotesText(), `${notes.title} - ${notes.author}.txt`, 'text/txt;charset=utf-8')
  },
  1000,
  { leading: true }
)

const handleCopy = () => {
  navigator.clipboard
    .writeText(generateNotesText())
    .then(() => {
      store.open_success_message('复制成功')
    })
    .catch((reson) => {
      store.open_error_message('复制失败', reson)
    })
}

const generateNotesText = () => {
  const notesText = [`${notes.title} - ${notes.author}`, ...notes.notes]
  return notesText.join('\n')
}

const handleClear = () => {
  notes.title = ''
  notes.author = ''
  notes.notes = []
}

onMounted(() => {})
</script>
<template>
  <div class="d-flex gap-8 h-100 mw-100 justify-content-between container w-100">
    <div class="settings d-flex flex-column align-items-center gap-6">
      <upload-file @before-upload="handleBeforeUpload" :multiple="false" accept="text/html">
        <n-upload-dragger class="">
          <div class="d-flex flex-column flex-center gap-3">
            <n-icon size="38" :component="MdCloudUpload" :depth="3" />
            <span>点击或者拖动文件到该区域来上传</span>
            <span class="text-black-50 fs-0-8">只能上传html文件</span>
          </div>
        </n-upload-dragger>
      </upload-file>
      <n-button-group v-if="notes.title">
        <n-button type="primary" size="medium" @click="handleClear" round>清空</n-button>
        <n-button type="primary" size="medium" @click="handleCopy" round>复制</n-button>
        <n-button type="primary" size="medium" @click="handleDownloadClick" round>下载</n-button>
      </n-button-group>
    </div>

    <div class="note-preview overflow-auto">
      <span class="notes-line" v-if="notes.title">{{ `${notes.title} - ${notes.author}` }}</span>
      <div v-for="(item, index) in notes.notes" :key="index" class="notes-line">
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media only screen and (max-width: 600px) {
  .container {
    flex-wrap: wrap;
  }
  .settings,
  .note-preview {
    width: calc(100vw - 40px);
  }
}
@media only screen and (min-width: 601px) {
  .settings {
    flex: 0 0 33.33%;
  }
  .note-preview {
    flex: 0 0 66.67%;
  }
}
.notes-line {
  min-height: 1.5rem;
}
</style>