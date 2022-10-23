import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../components/DashboardComponent.vue')
    },
    {
      path: '/products/create',
      name: 'ProductCreate',
      component: () => import('../components/ProductCreateComponent.vue')
    },
    {
      path: '/products/index',
      name: 'ProductIndex',
      component: () => import('../components/ProductIndexComponent.vue')
    },
    {
      path: '/categories/index',
      name: 'CategoryIndex',
      component: () => import('../components/CategoryIndexComponent.vue')
    },
    {
      path: '/sales/create',
      name: 'SaleCreate',
      component: () => import('../components/SaleCreateComponent.vue')
    },
    {
      path: '/sales/index',
      name: 'SaleIndex',
      component: () => import('../components/SaleIndexComponent.vue')
    },
    {
      path: '/users/index',
      name: 'UserIndex',
      component: () => import('../components/UserIndexComponent.vue')
    },
    {
      path: '/roles/index',
      name: 'RoleIndex',
      component: () => import('../components/RoleIndexComponent.vue')
    },
    {
      path: '/customers/index',
      name: 'CustomerIndex',
      component: () => import('../components/CustomerIndexComponent.vue')
    },
  ]
})

export default router
