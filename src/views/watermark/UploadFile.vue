<script setup>
import { NUpload, NUploadDragger, NIcon } from 'naive-ui'
import { MdCloudUpload } from '@vicons/ionicons4'
import { reactive } from 'vue'

import { useGlobalStore } from '@/store'

const store = useGlobalStore()
const emit = defineEmits(['change-file-list'])

const imageList = reactive({
  set: new Set(),
  list: []
})
const handleBeforeUpload = ({ file }) => {
  const { name, size } = file.file
  const uid = name + size
  if (imageList.set.has(uid)) {
    store.open_error_message(`图片${name}已存在`)
    return false
  }
  imageList.set.add(uid)
  imageList.list.push(file)

  emit('change-file-list', imageList.list)
  return false
}
</script>
<template>
  <div class="w-100 d-flex flex-center">
    <div class="w-500px">
      <n-upload
        action=""
        multiple
        directory-dnd
        :file-list="fileList"
        @before-upload="handleBeforeUpload"
        :show-file-list="false"
        accept="image/png, image/jpeg"
      >
        <n-upload-dragger>
          <div class="d-flex flex-column flex-center gap-3">
            <n-icon size="38" :component="MdCloudUpload" :depth="3" />
            <span>点击或者拖动文件到该区域来上传</span>
            <span class="text-black-50 fs-0-8">只能上传jpg/png文件</span>
          </div>
        </n-upload-dragger>
      </n-upload>
    </div>
  </div>
</template>