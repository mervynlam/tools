<script>
import alipay from '@/assets/img/alipay.png'
import wechat from '@/assets/img/wechat.png'
export default {
  setup() {
    const router = useRouter();
    const warningTooltip = ref(
      "安全、高效的给图片加水印，没有任何网络请求，保护证件安全。"
    );
    const currentPage = ref(router.currentRoute.value.name);
    const donateFlag = ref(false);

    //切换功能页
    const handleChangePage = (key) => {
      router.push(`/${key}`);
    };

    //切换功能页
    const toGithub = () => {
      window.open("https://github.com/mervynlam/watermark");
    };

    //喝茶
    const openDonate = () => {
      donateFlag.value = true;
    };

    //关闭喝茶
    const closeDonate = () => {
      donateFlag.value = false;
    };

    return {
      warningTooltip,
      currentPage,
      donateFlag,
      toGithub,
      alipay,
      wechat,
      handleChangePage,
      openDonate,
      closeDonate,
    };
  },
};
</script>

<template>
  <div class="nav">
    <el-menu
      :default-active="currentPage"
      mode="horizontal"
      @select="handleChangePage"
    >
      <el-menu-item index="home"
        ><el-icon style="vertical-align: middle; margin-right: 5px">
          <i-ant-design-home /> </el-icon
      ></el-menu-item>
      <el-menu-item index="watermark"
        ><span>图片加水印</span>
        <!-- <el-tooltip :content="warningTooltip" placement="top">
          <i class="warining-icon el-icon-warning-outline"></i>
        </el-tooltip> -->
        <el-tooltip :content="warningTooltip" placement="bottom">
          <el-icon class="warning">
            <i-ep-warning />
          </el-icon>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index="splice"><span>图片拼接</span></el-menu-item>
    </el-menu>
    <div class="buttons">
      <el-button type="plain" link class="button" @click="openDonate()">
        <el-icon style="vertical-align: middle; margin-right: 5px">
          <i-humbleicons-coffee />
        </el-icon>
        赞助一下</el-button
      >
      <el-icon
        style="vertical-align: middle; margin-right: 20px; font-size: 24px"
        class="button github"
        @click="toGithub"
      >
        <i-akar-icons-github-fill />
      </el-icon>
    </div>
  </div>
  <div class="box-donate" v-show="donateFlag">
    <i-ep-circle-close class="close-icon el-icon-circle-close" @click="closeDonate()"></i-ep-circle-close>
    <div class="donate-text"><span>感谢您的支持</span></div>
    <div class="donate-img">
      <el-image :src="alipay"></el-image>
      <el-image :src="wechat"></el-image>
    </div>
  </div>
</template>

<style scoped>
.nav {
  width: 100%;
  height: 48px;
  background-color: aliceblue;
}
.el-menu {
  height: 46px;
  display: inline-flex;
  position: absolute;
  left: 0;
  width: 500px;
  background-color: aliceblue;
  border-bottom: none;
}
.el-menu > li {
  margin: 0 10px;
}
.el-menu > li:active {
  border-bottom: solid 1px #409eff;
}
.el-menu > li:hover {
  border-bottom: solid 1px #409eff;
}

.warning {
  font-size: 1em;
  line-height: 56px;
}

.buttons {
  position: absolute;
  right: 0;
  display: inline-flex;
  align-items: center;
  height: 48px;
}
.button {
  margin-left: 10px;
}
.el-button {
  color: black;
}
.el-button:hover {
  color: #409eff;
}
.github {
  cursor: pointer;
}

/* 喝茶box */
.box-donate {
    background-color: rgba(0, 0, 0, 0.6);
    text-align: center;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 100%;
    z-index: 5000;
}

.box-donate>.donate-img {
    margin: 30px auto;
    width: 90%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.donate-img>.el-image {
    height: 50%;
}

.box-donate>.close-icon {
    color: white;
    font-size: 30px;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 20;
}

.donate-text {
    display: flex;
    position: fixed;
    height: 25%;
    justify-content: center;
    align-items: end;
    width: 100%;
    color: white;
    font-size: 25px;
}
</style>
