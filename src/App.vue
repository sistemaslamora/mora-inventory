<template>
  <router-view />
</template>

<script >
import { defineComponent } from 'vue';
import { authenticateRoutes } from '@vueauth/quasar-ui-auth';

export default defineComponent({
  name: 'App',
  setup () {
    authenticateRoutes()
  }
});
</script>
