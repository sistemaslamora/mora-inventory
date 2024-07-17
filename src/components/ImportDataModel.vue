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
          <div id="app">
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
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ImportDataModel',
  props: {
    onImport: {
      type: Function as PropType<(data: any) => void>,
      required: true,
    },
  },
  setup(props) {
    const json = ref(null);

    const onFileChange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || !files.length) return;
      readFile(files[0]);
    };

    const readFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const str = e.target?.result as string;
        json.value = JSON.parse(str);
        props.onImport(json.value);
      };
      reader.readAsText(file);
    };

    return {
      prompt: ref(true),
      onFileChange,
    };
  },
});
</script>
