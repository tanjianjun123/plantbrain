import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PlantList from '../views/PlantList.vue'
import PlantDetail from '../views/PlantDetail.vue'
import AddPlant from '../views/AddPlant.vue'
import CareCalendar from '../views/CareCalendar.vue'
import CareScheme from '../views/CareScheme.vue'
import AIChat from '../views/AIChat.vue'
import AIIdentify from '../views/AIIdentify.vue'
import Community from '../views/Community.vue'
import PostDetail from '../views/PostDetail.vue'
import PublishPost from '../views/PublishPost.vue'
import GroupList from '../views/GroupList.vue'
import GroupChat from '../views/GroupChat.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/plants',
    name: 'PlantList',
    component: PlantList,
    meta: { title: '我的植物' }
  },
  {
    path: '/plants/:id',
    name: 'PlantDetail',
    component: PlantDetail,
    meta: { title: '植物详情' }
  },
  {
    path: '/plants/add',
    name: 'AddPlant',
    component: AddPlant,
    meta: { title: '添加植物' }
  },
  {
    path: '/care',
    name: 'CareCalendar',
    component: CareCalendar,
    meta: { title: '养护日历' }
  },
  {
    path: '/care/:plantId/scheme',
    name: 'CareScheme',
    component: CareScheme,
    meta: { title: '养护方案' }
  },
  {
    path: '/ai/chat',
    name: 'AIChat',
    component: AIChat,
    meta: { title: 'AI助手' }
  },
  {
    path: '/ai/identify',
    name: 'AIIdentify',
    component: AIIdentify,
    meta: { title: '智能识别' }
  },
  {
    path: '/community',
    name: 'Community',
    component: Community,
    meta: { title: '社区' }
  },
  {
    path: '/community/post/:id',
    name: 'PostDetail',
    component: PostDetail,
    meta: { title: '动态详情' }
  },
  {
    path: '/community/publish',
    name: 'PublishPost',
    component: PublishPost,
    meta: { title: '发布动态' }
  },
  {
    path: '/groups',
    name: 'GroupList',
    component: GroupList,
    meta: { title: '我的群组' }
  },
  {
    path: '/groups/:id',
    name: 'GroupChat',
    component: GroupChat,
    meta: { title: '群聊' }
  },
]

const router = createRouter({
  history: createWebHashHistory(),  // 改用 Hash 模式，兼容所有静态托管平台
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'PlantBrain'} | PlantBrain`
  next()
})

export default router
