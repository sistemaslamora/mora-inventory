import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/PrincipalLayout.vue'), //'layouts/MainLayout.vue'
    children: [
                { path: '', component: () => import('src/pages/ManagerInventory.vue') },
                { path: '/items', component: () => import('pages/ItemsSetting.vue') },
                { path: '/managerinventorytemplate',name:'managerinventorytemplate', component: () => import('src/pages/ManagerInventoryTemplate.vue') },
                { path: '/handleinventorytemplate',name:'handleinventorytemplate', component: () => import('src/pages/HandleInventoryTemplate.vue'), props: true },
                { path: '/managerinventory',name:'managerinventory', component: () => import('src/pages/ManagerInventory.vue') },
              ],
  },
  
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
