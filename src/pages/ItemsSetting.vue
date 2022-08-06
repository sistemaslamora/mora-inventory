<template>
  <div class="q-pa-md">
    <q-banner
      inline-actions
      class="bg-grey"
    >

      <template v-slot:avatar>
        <q-icon
          name="cloud_upload"
          color="white"
        />
      </template>
    </q-banner>
  </div>

  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      dark
      color="amber"
    />
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
        name: 'Id',
        required: true,
        label: 'IdRest',
        align: 'left',
        field: (row) => row.IdRest,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'Codigo',
        required: true,
        label: 'Codigo',
        align: 'left',
        field: (row) => row.Codigo,
        format: (val) => `${val}`,
        sortable: false,
      },
      {
        name: 'Insumo',
        required: true,
        label: 'Insumo',
        align: 'left',
        field: (row) => row.Insumo,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'Tipo',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: (row) => row.Tipo,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'Medida',
        required: true,
        label: 'Medida',
        align: 'left',
        field: (row) => row.Medida,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'Unidad',
        required: true,
        label: 'Unidad',
        align: 'left',
        field: (row) => row.Unidad,
        format: (val) => `${val}`,
        sortable: true,
      },
    ];
    const rows = ref([]);

    onMounted(async () => {
      const params = {
        select: '*',
      };
      const resultItem = await Verify.findItem(params);
      if (resultItem.success === 1) {
        items.value = resultItem.originalResponse.body;
        items.value.forEach((x) => {
          rows.value.push(x);
        });
      }
    });
    return {
      columns,
      rows,
    };
  },
});
</script>
