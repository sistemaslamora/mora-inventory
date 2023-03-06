2<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-if="show" v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nuevo Inventario</div>
        </q-card-section>
        <form
          @submit.prevent.stop="onSubmit"
          @reset.prevent.stop="onReset"
          class="q-gutter-md"
        >
          <q-card-section class="q-pt-none">
            <div class="_filters--web">
              <div class="child">
                <q-input
                  ref="descriptionRef"
                  dense
                  outlined
                  label="Descripción"
                  stack-label
                  :options-dense="true"
                  v-model="modelDescription"
                  lazy-rules
                  :rules="descriptionRules"
                ></q-input>
              </div>
              <div class="child">
                <q-select
                  ref="storeRef"
                  dense
                  outlined
                  label="Tienda"
                  stack-label
                  :options-dense="true"
                  v-model="store"
                  :options="options"
                  @update:model-value="filterType()"
                  :display-value="`${store ? store.label : ''}`"
                  lazy-rules
                  :rules="storeRules"
                >
                </q-select>
              </div>
              <div class="child">
                <fieldset>
                  <legend>Plantillas</legend>
                  <q-scroll-area style="height: 200px; max-width: 300px">
                    <q-field
                      filled
                      :model-value="template"
                      bottom-slots
                      ref="templateRef"
                      lazy-rules
                      :rules="templateRules"
                    >
                      <template v-slot:control>
                        <q-option-group
                          :options="optTemplate"
                          type="radio"
                          v-model="template"
                          @update:model-value="filterType()"
                        />
                      </template>
                      <template v-slot:error>
                        Please use a maximum value of 30.
                      </template>
                    </q-field>
                  </q-scroll-area>
                </fieldset>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" type="reset" v-close-popup />
            <q-btn flat label="Create" type="submit" />
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script  lang="ts">
import { ref, computed, onMounted } from 'vue';
import Verify from '../common/service/verify';
import { useQuasar, QTableProps } from 'quasar';
import { useRouter } from 'vue-router';
import moment from 'moment';
import 'moment/locale/es';
import rules from 'quasar-app-extension-vuelidate-rules';
import useSupabase from '../boot/supabase';

export default {
  emits: ['onAccept', 'onClose'],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context: any) {
    const $q = useQuasar();
    const createAt = ref(moment().format());
    const store = ref(null);
    const myform = ref(null);
    const template = ref(null);
    const router = useRouter();
    const { supabase } = useSupabase();
    const optTemplate = ref([]);
    const modelDescription = ref('');
    const descriptionRef = ref(null);
    const storeRef = ref(null);
    const templateRef = ref(null);
    //  const v$ = rules();
    const accept = ref(false);
    const options = ref([
      {
        label: 'Almacen San Isidro',
        value: '1',
      },
      {
        label: 'Almacen Galvez',
        value: '3',
      },
      {
        label: 'Almacen Surco',
        value: '4',
      },
      {
        label: 'Almacen Dark',
        value: '2',
      },
      {
        label: 'Almacen Planta Principal',
        value: '5',
      },
      {
        label: 'Almacen Planta Produccion',
        value: '15',
      },
    ]);

    const filterType = () => {
      //   console.log(template);
    };

    onMounted(async () => {
      try {
        let data = await supabase.from('bizInventoryTemplate').select('*');
        if (!data.error) {
          optTemplate.value = data.body.map((x) => {
            return { label: x.Description, value: x.Id };
          });
        } else {
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    });

    const onCancel = () => {
      try {
        context.emit('onClose');
      } catch (error) {
        console.log(error);
      }
    };

    const onCreate = () => {
      try {
        // console.log(moment().format('YYYY-MM-DD'));
        const data = {
          store: store.value.label,
          storeId: store.value.value,
          template: template.value,
          description: modelDescription.value,
          create: moment().format('YYYY-MM-DD'),
        };
        context.emit('onAccept', data);
      } catch (error) {
        console.log(error);
      }
    };

    return {
      prompt: ref(true),
      store,
      template,
      options,
      optTemplate,
      filterType,
      myform,
      descriptionRef,
      storeRef,
      accept,
      templateRef,
      modelDescription,
      isValid: computed(() => store.value),
      onCancel,
      onCreate,

      descriptionRules: [(val) => (val && val.length > 0) || 'Valor Requerido'],

      storeRules: [
        (val) => (val !== null && val !== '') || 'Seleccione un Almacén',
      ],

      templateRules: [
        (val) => (val !== null && val !== '') || 'Seleccione una Plantilla',
      ],

      onSubmit() {
        descriptionRef.value.validate();
        storeRef.value.validate();
        templateRef.value.validate();
        // console.log(templateRef, 'templateref');
        if (
          templateRef.value.hasError ||
          descriptionRef.value.hasError ||
          storeRef.value.hasError
        ) {
          $q.notify({
            color: 'negative',
            message: 'Agrege los campos requeridos',
          });
        } else {
          $q.notify({
            icon: 'done',
            color: 'positive',
            message: 'Submitted',
          });
          onCreate();
        }
      },

      onReset() {
        store.value = null;
        modelDescription.value = '';
        template.value = null;
        storeRef.value.resetValidation();
        templateRef.value.resetValidation();
        descriptionRef.value.resetValidation();
        onCancel();
      },
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

fieldset {
  border: 1px solid #811715;
  border-radius: 3px;
  padding: 0rem 1rem 1rem 1rem !important;
}

legend {
  color: black;
  padding: 5px 10px;
}
.child {
  width: 100%;
}
</style>
