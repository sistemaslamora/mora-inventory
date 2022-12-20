<template>
  <router-view />
</template>

<script setup>
import { authenticateRoutes } from '@vueauth/quasar-ui-auth'
import { useAuthenticatedRedirector, useUnauthenticatedRedirector } from '@vueauth/core'
import { Loading } from 'quasar'
import { useRouter } from 'vue-router';
import { unref } from 'vue'

const router = useRouter()

const authenticatedRedirector = useAuthenticatedRedirector()
const unauthenticatedRedirector = useUnauthenticatedRedirector()

authenticatedRedirector.onChecked.value = () => Loading.hide()
unauthenticatedRedirector.onChecked.value = () => Loading.hide()

router.isReady().then(() => {
  const route = unref(router.currentRoute)
  console.log(route, 'route')
  if (route.meta.authOnly) {
    Loading.show()
    unauthenticatedRedirector.execOnAuthStateEnsured()
    next()
  }

  if (route.meta.unauthOnly) {
    authenticatedRedirector.execOnAuthStateEnsured()

  }
})

router.beforeEach((to, from) => {

  if (to.meta.authOnly) {
    Loading.show()
    unauthenticatedRedirector.execOnAuthStateEnsured()

  }

  if (to.meta.unauthOnly) {
    authenticatedRedirector.execOnAuthStateEnsured()

  }


})

authenticateRoutes()
</script>
