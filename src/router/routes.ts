import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
                { path: '', component: () => import('pages/ToExcel.vue') },
                { path: '/items', component: () => import('pages/ItemsSetting.vue') },
                { path: '/inventorytemplate', component: () => import('pages/InventoryTemplate.vue') },
                { path: '/newinventorytemplate', component: () => import('pages/NewInventoryTemplate.vue') }
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
