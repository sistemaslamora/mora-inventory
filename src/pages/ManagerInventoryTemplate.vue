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
        :to="{name:'handleinventorytemplate', params: {show: '0'}}"
        icon="fa-solid fa-file-circle-plus"
        style="line-height: 1.5rem;"
      >

      </q-btn>

      <q-btn
        flat
        stack
        size="12px"
        no-caps
        class="q-mx-sm"
        label="Ver Todos"
        icon="fas fa-folder-tree"
        style="line-height: 1.5rem;"
      >

      </q-btn>
    </q-toolbar>

    <div>
      <q-table
        title="Lista de Plantillas"
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
            <q-btn
              dense
              round
              flat
              color="grey"
              @click="deleteRow(props)"
              icon="delete"
            ></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>

</template>


<script lang="ts">
import { defineComponent, ref, onMounted, watchEffect } from 'vue';
import { useQuasar, QTableProps } from 'quasar';
import Verify from '../common/service/verify';
import { useRouter } from 'vue-router';
import moment from 'moment';
import 'moment/locale/es';
export default defineComponent({
  setup() {
    const $q = useQuasar();
    const items = ref([]);

    const show = ref('');
    const router = useRouter();
    // const showScreen = ref(false);
    // showScreen.value =
    const columns: QTableProps['columns'] = [
      {
        name: 'Description',
        required: true,
        label: 'Descripcion',
        align: 'left',
        field: (row) => row.Description,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'CreateBy',
        align: 'center',
        label: 'Creado Por',
        field: (row) => row.CreateBy,
        format: (val) => `${val}`,
        sortable: true,
        //    required: showScreen.value,
      },
      {
        name: 'CreateAt',
        align: 'center',
        label: 'Fecha de Creacion',
        field: (row) => humanize(row.CreatedAt),
        format: (val) => `${val}`,
        sortable: true,
        //     required: showScreen.value,
      },
      { name: 'actions', label: 'Actions', field: '', align: 'center' },
    ];
    const visibleColumns = ref(['CreateBy', 'CreateAt', 'actions']);

    const rows = ref([]);
    const humanize = (indate) => {
      const es = moment(indate).locale('es');
      // moment.lang('es',{ago:'hace'});
      //  moment.locale('es');
      return es.fromNow();
    };
    onMounted(async () => {
      const params = {
        select: '*',
      };
      const resultItem = await Verify.getInventoryTemplate(params);
      if (resultItem.success === 1) {
        items.value = resultItem.originalResponse.body;
        items.value.forEach((x) => {
          rows.value.push(x);
        });
      }
    });

    watchEffect(() => {
      visibleColumns.value =
        $q.screen.width > 600
          ? ['CreateBy', 'CreateAt', 'actions']
          : ['actions'];
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
      visibleColumns,
      selected: ref([]),
      dato: ref(false),
      editRow,
      show,
    };
  },
});
</script>
