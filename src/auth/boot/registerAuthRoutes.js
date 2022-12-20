import { boot } from 'quasar/wrappers'

export default boot(({ router }) => {
  router.addRoute('/', {
    name: 'auth.register',
    path: '/register',
    meta: { unauthOnly: true },
    component: () => import('src/auth/pages/IdentityPasswordRegisterPage.vue')
  })

  router.addRoute('/', {
    name: 'auth.login',
    path: '/login',
    meta: { unauthOnly: true },
    component: () => import('src/auth/pages/IdentityPasswordLoginPage.vue')
  })

  router.addRoute('/', {
    name: 'auth.requestPasswordReset',
    path: '/forgot-password',
    meta: { unauthOnly: true },
    component: () => import('src/auth/pages/PasswordResetRequestViaEmailPage.vue')
  })

  router.addRoute('/', {
    name: 'auth.resetPassword',
    path: '/password-reset',
    meta: { unauthOnly: true },
    component: () => import('src/auth/pages/PasswordResetViaEmailPage.vue')
  })

  router.addRoute('/', {
    path: '/dashboard',
    component: () => import('layouts/PrincipalLayout.vue'),
    meta: { authOnly: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('src/pages/UserDashboard.vue'),
        meta: { authOnly: true }
      },
       { path: '/items', component: () => import('pages/ItemsSetting.vue'),meta: { authOnly: true } },
                { path: '/managerinventorytemplate',name:'managerinventorytemplate', component: () => import('src/pages/ManagerInventoryTemplate.vue'),meta: { authOnly: true } },
                { path: '/handleinventorytemplate',name:'handleinventorytemplate', component: () => import('src/pages/HandleInventoryTemplate.vue'), props: true, meta: { authOnly: true } },
                { path: '/managerinventory',name:'managerinventory', component: () => import('src/pages/ManagerInventory.vue'),meta: { authOnly: true } },
    ]
  })
})
