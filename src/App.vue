<script setup>
import MainLayout from './components/MainLayout.vue'
import DonateMask from './components/DonateMask.vue'
import { NMessageProvider } from 'naive-ui'
import AppMessage from './components/AppMessage.vue'
import LinkArea from './components/LinkArea.vue'
</script>

<template>
  <MainLayout />
  <DonateMask />
  <n-message-provider>
    <AppMessage />
  </n-message-provider>
  <link-area />
</template>
