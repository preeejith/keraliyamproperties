import { createRouter, createWebHistory } from 'vue-router'
import KeraliyamProperties from './KeraliyamProperties.vue'
import AdminLogin from './AdminLogin.vue'
import AdminDashboard from './AdminDashboard.vue'
import { supabase } from './supabase'

const routes = [
  { path: '/', component: KeraliyamProperties },
  { path: '/login', component: AdminLogin },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard for /admin
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

// Dynamic Favicon and Title Switcher
router.afterEach((to) => {
  const favicon = document.querySelector("link[rel~='icon']");
  if (to.path.startsWith('/admin') || to.path.startsWith('/login')) {
    if (favicon) favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>";
    document.title = "Keraliyam Admin Portal";
  } else {
    if (favicon) favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>";
    document.title = "Keraliyam Properties – Discover Your Dream Home in Kerala";
  }
})

export default router
