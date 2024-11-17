<script setup>
import { NUpload } from 'naive-ui'

const emit = defineEmits(['before-upload'])
const { multiple = true, accept = 'image/png, image/jpeg' } = defineProps(['multiple', 'accept'])

const handleBeforeUpload = (file) => {
  emit('before-upload', file)
  return false
}
</script>
<template>
  <div class="">
    <n-upload
      action=""
      :multiple="multiple"
      directory-dnd
      :file-list="fileList"
      @before-upload="handleBeforeUpload"
      :show-file-list="false"
      :accept="accept"
    >
      <slot></slot>
    </n-upload>
  </div>
</template>