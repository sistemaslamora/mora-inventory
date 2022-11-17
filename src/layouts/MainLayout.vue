<template>
  <div class="q-pa-md">
    <q-layout
      style="max-height: calc( 100vh - 35px ); height: calc( 100vh - 35px )"
      view="lHh Lpr lff"
    >
      <q-header
        elevated
        class="bg-cyan-8"
      >
        <q-toolbar>
          <q-toolbar-title>{{modelHeader}}</q-toolbar-title>
          <q-btn
            flat
            @click="drawer = !drawer"
            round
            dense
            icon="menu"
          />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="400"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item
              clickable
              v-ripple
              @click="modelHeader = 'La Mora Pasteleria'"
              to="/"
            >
              <q-item-section avatar>
                <q-icon name="Home" />
              </q-item-section>

              <q-item-section>
                Inicio
              </q-item-section>
            </q-item>

            <q-item
              active
              clickable
              v-ripple
              @click="modelHeader = 'jean newman'"
              to="/Items"
            >
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>

              <q-item-section>
                Inicio
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              @click="modelHeader = 'test'"
              :to="{name:'handleinventorytemplate', params: {show: '0'}}"
            >
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section>
                Inventario
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              @click="modelHeader = 'Plantilla de Inventario Fisico'"
              to="/managerinventorytemplate"
            >
              <q-item-section avatar>
                <q-icon name="drafts" />
              </q-item-section>

              <q-item-section>
                Plantilla de Inventario
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://cdn.quasar.dev/img/material.png"
          style="height: 150px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar
              size="56px"
              class="q-mb-sm"
            >
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <div class="text-weight-bold">Razvan Stoenescu</div>
            <div>@rstoenescu</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <router-view></router-view>
      </q-page-container>

    </q-layout>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const modelHeader = ref('La Mora Pasteleria')

    const onChangeHeader = () => {
      modelHeader.value = 'Inventario Fisico'
    }
    return {
      drawer: ref(false),
      modelHeader,
      //
      onChangeHeader
    }
  }
}
</script>