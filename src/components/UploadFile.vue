<script setup>
import { NUpload } from 'naive-ui'

const emit = defineEmits(['before-upload'])
const { multiple = true } = defineProps(['multiple'])

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
      accept="image/png, image/jpeg"
    >
      <slot></slot>
    </n-upload>
  </div>
</template>