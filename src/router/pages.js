import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import WaterMark from '../views/watermark/WaterMark.vue'
import DrawGrid from '../views/drawGrid/DrawGrid.vue'
export const pages = [
  {
    path: '/',
    name: '首页',
    component: HomeView
  },
  {
    path: '/waterMark',
    name: '图片加水印',
    isTool: true,
    component: WaterMark,
    description: '安全、高效的给图片加水印，没有任何网络请求，保护证件安全。'
  },
  {
    path: '/drawGrid',
    name: '绘制练字格',
    isTool: true,
    component: DrawGrid,
    description: '绘制各式各样的练字格，让练字变得趣味横生。'
  },
  {
    path: '/about',
    name: '关于我们',
    component: AboutView
  }
]
