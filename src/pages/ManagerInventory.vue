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
        label="Nuevo"
        @click="showStock = !showStock"
        icon="fa-solid fa-file-circle-plus"
        style="line-height: 1.5rem;"
      >
      </q-btn>

      <!-- <q-btn
        flat
        stack
        size="12px"
        no-caps
        class="q-mx-sm"
        label="Ver Todos"
        icon="fas fa-folder-tree"
        style="line-height: 1.5rem;"
      >
      </q-btn> -->

      <q-separator
        vertical
        inset
        color="warning"
      />
      <div :class="$q.screen.width > 600 ? '_filters--web':'_filters--mobile'">
        <div class="child">
          <q-select
            dark
            dense
            standout
            v-model="tipo"
            :options="options"
            @update:model-value="filterType()"
            :display-value="`${tipo ? tipo.label : 'Insumo'}`"
          >

          </q-select>
        </div>
        <div class="child">
          <q-input
            v-model="date"
            dark
            dense
            standout
            type="date"
          />
        </div>

      </div>
    </q-toolbar>

    <div>
      <q-table
        title="Inventarios - Formatos"
        :rows="rows"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="Descripcion"
        dense
      > <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-italic"
              style="color: #d4aa70; font-size: 1rem;"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              dense
              round
              flat
              color="grey"
              @click="editRow(props)"
              icon="edit"
            ></q-btn>

          </q-td>
        </template>
      </q-table>
    </div>
  </div>
  <CreateStockInventory :show="showStock" />
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, watchEffect } from 'vue';
import { useQuasar, QTableProps } from 'quasar';
import Verify from '../common/service/verify';
import { useRouter } from 'vue-router';
import moment from 'moment';
import 'moment/locale/es';
import CreateStockInventory from '../components/CreateStockInventory.vue';

export default defineComponent({
  components: {
    CreateStockInventory,
  },
  setup() {
    const $q = useQuasar();
    const items = ref([]);
    const tipo = ref(null);
    const show = ref('');
    const router = useRouter();
    const showStock = ref(false);
    // const showScreen = ref(false);
    // showScreen.value =
    const columns: QTableProps['columns'] = [
      {
        name: 'Almacen',
        required: true,
        label: 'Almacén',
        align: 'left',
        field: (row) => row.Description,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'CreateBy',
        align: 'center',
        label: 'Usuario',
        field: (row) => row.CreateBy,
        format: (val) => `${val}`,
        sortable: true,
        //    required: showScreen.value,
      },
      {
        name: 'CreateAt',
        align: 'center',
        label: 'Fecha',
        field: (row) => humanize(row.CreatedAt),
        format: (val) => `${val}`,
        sortable: true,
        //     required: showScreen.value,
      },
      { name: 'actions', label: 'Actions', field: '', align: 'center' },
    ];
    const visibleColumns = ref(['CreateBy', 'CreateAt', 'actions']);
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

    const rows = ref([]);
    const humanize = (indate) => {
      const es = moment(indate).locale('es');
      // moment.lang('es',{ago:'hace'});
      //  moment.locale('es');
      return es.format('YYYY-MM-DD HH:mm::ssZ');
    };
    onMounted(async () => {
      // const params = {
      //   select: '*',
      // };
      // const resultItem = await Verify.getInventoryTemplate(params);
      // if (resultItem.success === 1) {
      //   items.value = resultItem.originalResponse.body;
      //   items.value.forEach((x) => {
      //     rows.value.push(x);
      //   });
      // }
    });

    watchEffect(() => {
      visibleColumns.value =
        $q.screen.width > 600
          ? ['CreateBy', 'CreateAt', 'actions']
          : ['CreateAt', 'actions'];
    });

    const editRow = (data) => {
      router.push({
        name: 'handleinventorytemplate',
        params: {
          show: '1',
          templateId: data.row.Id,
          templateName: data.row.Description,
        },
      });
    };

    return {
      columns,
      rows,
      tipo,
      options,
      showStock,
      date: ref('2019/02/01'),
      visibleColumns,
      selected: ref([]),
      dato: ref(false),
      editRow,
      show,
    };
  },
});
</script>
<style lang="scss" scoped>
._filters--mobile {
  display: flex;
  flex-direction: column;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  gap: 0.5rem;
  width: 100%;
}

._filters--web {
  display: flex;
  flex-direction: row;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  gap: 0.5rem;
  width: 100%;
}

.child {
  width: 100%;
}

::v-deep(.q-field__native .q-placeholder) {
  color: white;
}
</style>
