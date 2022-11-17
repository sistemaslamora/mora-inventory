2<template>
  <div class="q-pa-md q-gutter-sm">

    <q-dialog
      v-if="show"
      v-model="prompt"
      persistent
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nuevo Inventario</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="_filters--web">
            <div class="child">
              <q-select
                dense
                outlined
                v-model="tipo"
                :options="options"
                @update:model-value="filterType()"
                :display-value="`${tipo ? tipo.label : 'Almacen'}`"
                :rules="[ $rules.required('Your name is required')]"
              >

              </q-select>
            </div>
            <div class="child">
              <q-scroll-area style="height: 200px; max-width: 300px;">
                <q-option-group
                  :options="options"
                  type="radio"
                  v-model="tipo"
                />
              </q-scroll-area>
            </div>
          </div>
        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            flat
            label="Cancel"
            v-close-popup
          />
          <q-btn
            flat
            label="Add address"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script  lang="ts">
import { ref, computed } from 'vue';
import Verify from '../common/service/verify';
import { useQuasar, QTableProps } from 'quasar';
import { useRouter } from 'vue-router';
import moment from 'moment';
import 'moment/locale/es';
import rules from 'quasar-app-extension-vuelidate-rules';
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const $q = useQuasar();
    const createAt = ref(moment().format());
    const tipo = ref(null);
    const router = useRouter();

    const options = ref([
      {
        label: 'Almacen San Isidro',
        value: 1,
      },
      {
        label: 'Almacen Galvez',
        value: 3,
      },
      {
        label: 'Almacen Surco',
        value: 4,
      },
      {
        label: 'Almacen Dark',
        value: 2,
      },
      {
        label: 'Almacen Planta Principal',
        value: 5,
      },
      {
        label: 'Almacen Planta Produccion',
        value: 15,
      },
    ]);
    console.log(tipo.value);
    const filterType = () => {
      //
    };
    return {
      prompt: ref(true),
      tipo,
      options,
      filterType,
      isValid: computed(() => tipo.value),
    };
  },
};
</script>
<style lang="scss" scoped>
._filters--web {
  display: flex;
  flex-direction: column;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  gap: 0.5rem;
  width: 100%;
}

.child {
  width: 100%;
}
</style>
