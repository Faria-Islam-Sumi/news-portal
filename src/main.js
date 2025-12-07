
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import NewsFeed from './components/NewsFeed.vue'
import NewsDetail from './components/NewsDetail.vue'
import NewsCreate from './components/NewsCreate.vue'
import NewsEdit from './components/NewsEdit.vue'
import Login from './components/Login.vue'

const routes = [
  { path: '/', component: NewsFeed, meta: { requiresAuth: true } },
  { path: '/news/:id', component: NewsDetail, meta: { requiresAuth: true } },
  { path: '/create', component: NewsCreate, meta: { requiresAuth: true } },
  { path: '/edit/:id', component: NewsEdit, meta: { requiresAuth: true } },
  { path: '/login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem('user')) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
