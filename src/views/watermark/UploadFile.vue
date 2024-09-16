<script setup>
import { NUpload, NUploadDragger, NIcon } from 'naive-ui'
import { MdCloudUpload } from '@vicons/ionicons4'

const emit = defineEmits(['before-upload'])

const handleBeforeUpload = (file) => {
  emit('before-upload', file)
  return false
}
</script>
<template>
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
</template>