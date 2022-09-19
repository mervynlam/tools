<script>
export default {
  setup() {
    const fileIndex = ref(0);

    return {
      fileIndex,
    };
  },
};
</script>

<template>
  <Nav />
  <el-card class="box-card"><span class="Coming">Coming Soon...</span></el-card>
</template>

<style scoped>
.box-card {
  margin: 20px;
  border: 0;
  border-radius: 16px;
  font-size: 64px;
  position: relative;
  min-height: calc(100vh - 88px);
}
.Coming {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
