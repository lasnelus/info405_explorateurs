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
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('../views/familly/Schedule.vue')
    },
    {
      path: '/ChildEdit',
      name: 'childEdit',
      component: () => import('../views/admin/edit/ChildEdit.vue')
    },
    {
      path: '/ChildDelete',
      name: 'childDelete',
      component: () => import('../views/admin/delete/ChildDelete.vue')
    },
    {
      path: '/childCreate',
      name: 'childCreate',
      component: () => import('../views/admin/create/ChildCreate.vue')
    }
  ],
})

export default router
