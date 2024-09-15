

<script setup>
import { defineComponent } from 'vue'
import { useMessage } from 'naive-ui'

import { useGlobalStore } from '@/store'

const messageComponent = defineComponent(() => {
  const message = useMessage()
  const store = useGlobalStore()
  return () => {
    if (store.message.show) {
      switch (store.message.type) {
        case 'success':
          message.success(store.message.content, {
            keepAliveOnHover: true,
            onLeave: () => {
              store.close_message()
            }
          })
          break
        case 'error':
          message.error(store.message.content, {
            keepAliveOnHover: true,
            onLeave: () => {
              store.close_message()
            }
          })
          break

        default:
          break
      }
    }
  }
})
</script>

<template>
  <component :is="messageComponent" />
</template>