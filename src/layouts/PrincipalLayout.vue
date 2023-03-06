<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="__toolbar">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />

        <q-toolbar-title
          v-if="$q.screen.width > 400"
          shrink
          class="row items-center no-wrap"
        >
          <img src="../assets/logo.png" />

          <span class="q-ml-sm">{{ userEmail }}</span>
        </q-toolbar-title>

        <q-space />

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- <q-btn
            v-if="$q.screen.gt.sm"
            round
            dense
            flat
            color="text-grey-7"
            icon="apps"
          >
            <q-tooltip>Google Apps</q-tooltip>
          </q-btn> -->
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating> 2 </q-badge>
            <q-tooltip>Notificaciones</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-tooltip>Usuario</q-tooltip>
            <AuthAccountMenu />
          </q-btn>
          <!-- <q-btn
            icon="person"
            round
            flat
          >
            <AuthAccountMenu />
          </q-btn> -->
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="240"
    >
      <q-scroll-area class="fit">
        <q-list padding class="text-grey-8">
          <q-item
            class="__drawer-item"
            v-ripple
            v-for="link in links1"
            :key="link.text"
            clickable
            :to="link.route"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- <q-separator
            inset
            class="q-my-sm"
          />

          <q-item
            class="__drawer-item"
            v-ripple
            v-for="link in links2"
            :key="link.text"
            clickable
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator
            inset
            class="q-my-sm"
          />

          <q-item
            class="__drawer-item"
            v-ripple
            v-for="link in links3"
            :key="link.text"
            clickable
          >
            <q-item-section>
              <q-item-label>{{ link.text }}
                <q-icon
                  v-if="link.icon"
                  :name="link.icon"
                />
              </q-item-label>
            </q-item-section>
          </q-item> -->

          <!-- <div class="q-mt-md">
            <div class="flex flex-center q-gutter-xs">
              <a
                class="__drawer-footer-link"
                href="javascript:void(0)"
                aria-label="Privacy"
              >Privacy</a>
              <span> · </span>
              <a
                class="__drawer-footer-link"
                href="javascript:void(0)"
                aria-label="Terms"
              >Terms</a>
              <span> · </span>
              <a
                class="__drawer-footer-link"
                href="javascript:void(0)"
                aria-label="About"
              >About Google</a>
            </div>
          </div> -->
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { fasEarthAmericas, fasFlask } from '@quasar/extras/fontawesome-v6';
import AuthAccountMenu from '../auth/components/AccountMenu/AccountMenu.vue';
import {
  getDefaultProvider,
  useIdentityPasswordLogin,
  useAuthState,
} from '@vueauth/core';

const { user } = useAuthState();
const { identity } = useIdentityPasswordLogin();

//console.log('user', user)
//console.log('identity', identity)
const leftDrawerOpen = ref(false);
const search = ref('');
const showAdvanced = ref(false);
const showDateOptions = ref(false);
const exactPhrase = ref('');
const hasWords = ref('');
const excludeWords = ref('');
const byWebsite = ref('');
const byDate = ref('Any time');

function onClear() {
  exactPhrase.value = '';
  hasWords.value = '';
  excludeWords.value = '';
  byWebsite.value = '';
  byDate.value = 'Any time';
}
function changeDate(option) {
  byDate.value = option;
  showDateOptions.value = false;
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const authProvider = getDefaultProvider();

const authProviderUpperFirst =
  authProvider.charAt(0).toUpperCase() + authProvider.slice(1);
const userEmail = ref(user.value.email);

const links1 = ref([
  { icon: 'web', text: 'Escritorio', route: '/dashboard' },
  {
    icon: 'memory',
    text: 'Plantilla de Inventario',
    route: '/managerinventorytemplate',
  },
  {
    icon: 'star_border',
    text: 'Inventario Físico',
    route: '/managerinventory',
  },
  // { icon: 'settings', text: 'Generar Inventario', route: '/managerinventory' }
]);
</script>

<style >
.__toolbar {
  height: 64px;
}

.__toolbar-input {
  width: 55%;
}

.__drawer-item {
  line-height: 24px;
  border-radius: 0 24px 24px 0;
  margin-right: 12px;
}
.__drawer-item .q-icon {
  color: #5f6368;
}
.__drawer-item .q-item__label {
  color: #433c42;
  letter-spacing: 0.01785714em;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
}

.__drawer-footer-link {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem;
}
.__drawer-footer-link:hover {
  color: #000;
}
</style>