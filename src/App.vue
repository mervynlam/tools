<script setup>
import MainLayout from './components/MainLayout.vue'
import DonateMask from './components/DonateMask.vue'
import { NMessageProvider } from 'naive-ui'
import AppMessage from './components/AppMessage.vue'
import LinkArea from './components/LinkArea.vue'

import { NConfigProvider } from 'naive-ui'

const themeOverrides = {
  common: {
    primaryColor: '#42B1C7FF',
    primaryColorHover: '#60C1D5FF'
  }
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <MainLayout />
    <DonateMask />
    <n-message-provider>
      <AppMessage />
    </n-message-provider>
    <link-area />
  </n-config-provider>
</template>
