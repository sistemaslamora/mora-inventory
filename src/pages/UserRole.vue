<template>
  <div class="q-pa-md q-gutter-y-sm">
    <q-toolbar class="bg-primary q-py-sm text-white" style="padding-top: 1rem">
      <q-btn
        v-if="showAdd"
        stack
        flat
        size="12px"
        no-caps
        class="q-mx-sm"
        label="Nuevo"
        @click="addRole"
        icon="fa-solid fa-file-circle-plus"
        style="line-height: 1.5rem"
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
        style="line-height: 1.5rem"
      >
      </q-btn>
    </q-toolbar>

    <div>
      <q-table
        title="Roles de Usuario"
        :rows="rows"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="email"
        dense
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-italic"
              style="color: #d4aa70; font-size: 1rem"
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
              @click="editRole(props)"
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
import useSupabase from '../boot/supabase';

import { useAuthState } from '@vueauth/core';

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const items = ref([]);
    const { user } = useAuthState();
    const { supabase } = useSupabase();
    const showAdd = ref(true);
    const show = ref('');
    const router = useRouter();
    const options = [
      {
        value: '662273d0-3830-4c16-af8e-e7a2a5384e49',
        label: 'SuperAdmin',
      },
      {
        value: '171b07e2-de6c-4b2f-bd94-039676a7cf9b',
        label: 'Controller',
      },
      {
        value: '2d5ec1d4-ce3e-4be9-a8c6-7a6aaae16a79',
        label: 'Administradores',
      },
      {
        value: 'e0a49454-2818-49d8-8f01-cfd6709ea721',
        label: 'Usuarios',
      },
    ];
    // const showScreen = ref(false);
    // showScreen.value =
    const columns: QTableProps['columns'] = [
      {
        name: 'Usuario',
        required: true,
        label: 'Usuario',
        align: 'left',
        field: (row) => row.email,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'Role',
        required: true,
        align: 'center',
        label: 'Role',
        field: (row) => row.bizrole.role,
        format: (val) => `${val}`,
        sortable: true,
        //    required: showScreen.value,
      },
      {
        name: 'CreateAt',
        align: 'center',
        label: 'Fecha de Creacion',
        field: (row) => humanize(row.created_at),
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

    const callList = async () => {
      let role = await supabase
        .from('bizrolebyuser')
        .select('*')
        // Filters
        .eq('userid', user.value.id);
      if (role.status === 200) {
        showAdd.value = false;
      }
      let result = await supabase.from('bizrolebyuser').select('*,bizrole(*)');

      if (result.status === 200) {
        rows.value = result.data;
        // console.log(rows.value, 'result');
      }
    };

    onMounted(async () => {
      callList();
    });

    const editRole = (info) => {
      $q.dialog({
        title: 'Role',
        message: `Añade el Role para: ${info.row.email}`,
        options: {
          type: 'radio',
          model: 'opt1',
          // inline: true
          items: options,
        },
        cancel: true,
        persistent: true,
      })
        .onOk(async (data) => {
          // console.log('>>>> OK, received', data)
          const opt = options.find((x) => x.value === data);

          const result = await supabase
            .from('bizrolebyuser')
            .update({ roleid: opt.value })
            .eq('userid', info.row.userid);
          callList();
        })

        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    };

    const addRole = () => {
      $q.dialog({
        title: 'Role',
        message: `Añade el Role para: ${user.value.email}`,
        options: {
          type: 'radio',
          model: 'opt1',
          // inline: true
          items: [
            {
              value: '662273d0-3830-4c16-af8e-e7a2a5384e49',
              label: 'SuperAdmin',
            },
            {
              value: '171b07e2-de6c-4b2f-bd94-039676a7cf9b',
              label: 'Controller',
            },
            {
              value: '2d5ec1d4-ce3e-4be9-a8c6-7a6aaae16a79',
              label: 'Administradores',
            },
            {
              value: 'e0a49454-2818-49d8-8f01-cfd6709ea721',
              label: 'Usuarios',
            },
          ],
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          // console.log('>>>> OK, received', data)
          console.log(data);
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    };

    watchEffect(() => {
      visibleColumns.value =
        $q.screen.width > 600
          ? ['CreateBy', 'CreateAt', 'actions']
          : ['actions'];
    });

    const editRow = (data) => {};

    return {
      columns,
      rows,
      showAdd,
      visibleColumns,
      selected: ref([]),
      dato: ref(false),
      editRow,
      addRole,
      editRole,
      show,
    };
  },
});
</script>
