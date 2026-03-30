import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/MainPage.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/family-dashboard',
      name: 'family-dashboard',
      component: () => import('../views/familly/FamilyDashBoardView.vue')
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: () => import('../views/familly/ChildRegistration.vue')
    },
    {
      path: '/family',
      name: 'famille',
      component: () => import('../views/familly/familySpecific.vue')
    },
    {
      path: '/children',
      name: 'enfants',
      component: () => import('../views/familly/ChildSpecific.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/adminMain.vue')
    }
  ],
})

export default router
