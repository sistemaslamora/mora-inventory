<template>
  <div class="q-pa-md q-gutter-sm">

    <q-dialog
      v-model="prompt"
      persistent
    >
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Selecciona la Plantilla</div>
        </q-card-section>

        <q-card-section class="q-pt-none">

          <div
            class=""
            id="app"
          >
            <input
              type="file"
              accept="application/json"
              @change="onFileChange"
            >
          </div>

        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            flat
            label="Cerrar"
            v-close-popup
          />

        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  emits: ['import'],
  props: {
    //
  },
  setup(props, context: any) {
    let json = ref(null);
    const onFileChange = (e) => {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      readFile(files[0]);
    };
    const readFile = (file) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        let str: string | ArrayBuffer = e.target.result;
        json.value = JSON.parse(str.toString());
        context.emit('import', json.value);
      };

      reader.readAsText(file);
    };

    return {
      prompt: ref(true),
      onFileChange,
      readFile,
    };
  },
};
</script>