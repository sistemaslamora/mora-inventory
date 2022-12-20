<script setup>
import AuthLoginCard from 'src/auth/components/LoginCard.vue'
</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar
              size="103px"
              class="absolute-center shadow-10"
            >
              <img src="../../assets/profile.svg">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Log in
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <AuthLoginCard />
            <q-btn
              class="full-width q-mt-md"
              color="grey-6"
              label="forgot password"
              flat
              :to="{ name: 'auth.requestPasswordReset' }"
            />

            <!-- <div>
                <q-btn label="Login" to="/" type="button" color="primary"/>
              </div> -->

          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>

  <!-- <div
    class="flex flex-center"
    style="min-height: 100vh"
    padding
  >
    <div class="text-center">
      <h5 class="q-mb-md">
        Sign In
      </h5>
      <AuthLoginCard />
      <q-btn
        class="full-width q-mt-md"
        color="grey-6"
        label="forgot password"
        flat
        :to="{ name: 'auth.requestPasswordReset' }"
      />
    </div>
  </div>
  <div
    class="absolute-top-right q-pa-md"
  >
    <div>Need an account?</div>
    <q-btn
      no-caps
      label="register"
      flat
      class="full-width"
      :to="{ name: 'auth.register' }"
    />
  </div> -->
</template>
<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
