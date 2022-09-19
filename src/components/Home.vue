<script>
// import { useRouter } from "vue-router";
// import IconAccessibility from "~icons/carbon/accessibility";
// import IconAccountBox from "~icons/mdi/account-box";
export default {
  setup() {
    const router = useRouter();

    // 转跳到水印
    function go2Watermark() {
      router.push("/watermark");
    }

    // 转跳到拼接
    function go2Splice() {
      router.push("/splice");
    }

    return {
      go2Watermark,
      go2Splice,
    };
  },
};
</script>
  
<template>
  <Nav />
  <div class="welcome">Welcome to MicroTool</div>
  <div class="buttons">
    <el-button @click="go2Watermark">
      <el-icon style="vertical-align: middle" class="icon">
        <i-akar-icons-water />
      </el-icon>
      watermark
    </el-button>
    <el-button @click="go2Splice">
      <el-icon style="vertical-align: middle" class="icon">
        <i-et-pictures />
      </el-icon>
      Splice
    </el-button>
  </div>
</template>
  
<style scoped>
.welcome {
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.buttons {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.icon {
  margin-right: 5px;
}
</style>
  