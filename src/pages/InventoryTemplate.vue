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
        row-key="Descripcion"
        selection="multiple"
        v-model:selected="selected"
      />
    </div>
  </div>

</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { QTableProps } from 'quasar';
import Verify from '../common/service/verify';

export default defineComponent({
  setup() {
    const items = ref([]);
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
      },
      {
        name: 'CreateAt',
        align: 'center',
        label: 'Fecha de Creacion',
        field: (row) => row.CreatedAt,
        format: (val) => `${val}`,
        sortable: true,
      },
    ];

    const rows = ref([]);

    onMounted(async () => {
      const params = {
        select: '*',
      };
      const resultItem = await Verify.getInventoryTemplate(params);
      if (resultItem.success === 1) {
        items.value = resultItem.originalResponse.body;
        console.log(items.value);
        items.value.forEach((x) => {
          rows.value.push(x);
        });
      }
    });

    return {
      columns,
      rows,
      selected: ref([]),
      dato: ref(false),
    };
  },
});
</script>
