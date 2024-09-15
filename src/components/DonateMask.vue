<script setup>
import alipay from '@/assets/img/alipay.png'
import wechat from '@/assets/img/wechat.png'

import { useGlobalStore } from '@/store'
import { storeToRefs } from 'pinia'
import { NImage, NIcon, NButton } from 'naive-ui'
import { IosClose } from '@vicons/ionicons4'
const store = useGlobalStore()
const { donateIsShow } = storeToRefs(store)
const handleClose = () => {
  store.close_donate()
}
</script>
<template>
  <div
    v-if="donateIsShow"
    class="h-100 w-100 bg-black-50 position-absolute top-0 left-0 d-flex flex-column flex-center gap-4"
  >
    <span class="h2 text-white">感谢您的赞助</span>
    <div class="d-flex">
      <n-image width="500px" height="500px" :src="alipay" />
      <n-image width="500px" height="500px" :src="wechat" />
    </div>

    <n-button text @click="handleClose">
      <n-icon color="var(--white)" size="30" :component="IosClose" />
    </n-button>
  </div>
</template>