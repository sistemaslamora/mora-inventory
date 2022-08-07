<template>
  <div class="q-pa-md q-gutter-y-sm">
    <q-toolbar
      class="bg-primary q-py-sm text-white"
      style="padding-top: 1rem;"
    >
      <q-btn
        stack
        flat
        size="12px"
        no-caps
        class="q-mx-sm"
        label="Guardar"
        icon="fa-regular fa-floppy-disk"
        style="line-height: 1.5rem;"
      >

      </q-btn>

      <q-btn
        flat
        stack
        size="12px"
        no-caps
        label="Eliminar"
        icon="fa-regular fa-trash-can"
        style="line-height: 1.5rem;"
      >
      </q-btn>

      <q-separator
        vertical
        inset
      />

      <q-btn
        stack
        flat
        size="12px"
        no-caps
        @click="showZone()"
        label="Editar Zonas"
        icon="fa-solid fa-map-location-dot"
        style="line-height: 1.5rem;"
      >
      </q-btn>

      <q-separator
        vertical
        inset
      />

      <q-btn
        stack
        flat
        size="12px"
        no-caps
        class="q-mx-sm"
        label="Importar"
        icon="fa-solid fa-file-import"
        style="line-height: 1.5rem;"
      >
      </q-btn>
      <q-btn
        stack
        flat
        size="12px"
        no-caps
        label="Exportar"
        icon="fa-solid fa-file-export"
        style="line-height: 1.5rem;"
      >
      </q-btn>
      <q-separator
        vertical
        inset
      />

      <q-btn
        stack
        flat
        size="12px"
        no-caps
        label="Atras"
        icon="fa-regular fa-hand-point-left"
        style="line-height: 1.5rem;"
      >
      </q-btn>
    </q-toolbar>

  </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue';
import Verify from '../common/service/verify';
import { useQuasar, useDialogPluginComponent } from 'quasar';
import CreateZoneModal from '../components/CreateZoneModal.vue';

export default defineComponent({
  name: 'NewInventoryTemplate',

  emits: [...useDialogPluginComponent.emits],
  setup() {
    const $q = useQuasar();

    const showZone = () => {
      $q.dialog({
        component: CreateZoneModal,

        // props forwarded to your custom component
        // componentProps: {
        //  text: 'something',
        // ...more..props...
        //  },
      });
    };

    return { showZone };
  },
});
</script>
