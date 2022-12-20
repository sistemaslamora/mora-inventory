import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
 
  
  // {
  //  path: '/dashboard',
  //   component: () => import('layouts/PrincipalLayout.vue'),
  //   children: [
  //     {
  //       path: '/',
  //       name: 'dashboard',
  //       component: () => import('src/pages/UserDashboard.vue'),
  //       meta: { authOnly: true }
  //     },
  //      { path: '/items', component: () => import('pages/ItemsSetting.vue'),meta: { authOnly: true } },
  //               { path: '/managerinventorytemplate',name:'managerinventorytemplate', component: () => import('src/pages/ManagerInventoryTemplate.vue'),meta: { authOnly: true } },
  //               { path: '/handleinventorytemplate',name:'handleinventorytemplate', component: () => import('src/pages/HandleInventoryTemplate.vue'), props: true, meta: { authOnly: true } },
  //               { path: '/managerinventory',name:'managerinventory', component: () => import('src/pages/ManagerInventory.vue'),meta: { authOnly: true } },
  //   ]
  // },
  
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
