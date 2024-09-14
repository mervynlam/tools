import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
export const pages = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  }
]
