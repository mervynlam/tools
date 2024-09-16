<script setup>
import AppNavigator from './sideBar/AppNavigator.vue'
import AppHeader from './AppHeader.vue'
import { RouterView } from 'vue-router'
</script>
<template>
  <div class="vh-100 w-100 d-flex">
    <AppNavigator />
    <main class="flex-fill d-flex flex-column">
      <AppHeader />
      <main class="w-100 h-100 bg-blue-lightest p-3 overflow-auto d-flex justify-content-center">
        <div class="mw-1800px flex-fill">
          <RouterView />
        </div>
      </main>
    </main>
  </div>
</template>