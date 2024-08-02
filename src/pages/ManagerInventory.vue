<template>
  <div class="q-pa-md q-gutter-y-sm">
    <q-toolbar class="bg-primary q-py-sm text-white" style="padding-top: 1rem">
      <q-btn
        v-if="havePermise(permiseAdmin)"
        stack
        flat
        size="12px"
        no-caps
        class="q-mx-sm"
        label="Nuevo"
        @click="showStock = true"
        icon="fa-solid fa-file-circle-plus"
        style="line-height: 1.5rem"
      >
        <q-tooltip class="bg-dark">Crear Inventario</q-tooltip>
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

      <q-separator vertical inset color="warning" />
      <div
        :class="$q.screen.width > 600 ? '_filters--web' : '_filters--mobile'"
      >
        <div class="child">
          <q-input
            dark
            dense
            standout
            v-model="dateInventory"
            mask="date"
            :rules="['date']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    color="orange"
                    text-color="black"
                    v-model="dateInventory"
                    minimal
                    :locale="myLocale"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="child">
          <q-select
            dark
            dense
            standout
            v-model="tipo"
            :options="options"
            :display-value="`${tipo ? tipo.label : ''}`"
          >
          </q-select>
        </div>
      </div>
      <q-btn
        stack
        flat
        size="12px"
        no-caps
        label="Buscar"
        @click="onSearch"
        align="center"
        icon="fas fa-search"
        style="line-height: 1.5rem"
      >
        <q-tooltip class="bg-dark">Buscar</q-tooltip>
      </q-btn>
    </q-toolbar>

    <div>
      <q-table
        title="Inventarios - Formatos"
        :rows="rows"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="Descripcion"
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
              @click="editRow(props)"
              icon="far fa-edit"
            >
              <q-tooltip class="bg-dark">Editar Inventario</q-tooltip>
            </q-btn>
            <q-btn
              v-if="havePermise(permiseAdmin)"
              dense
              round
              flat
              color="grey"
              @click="setTemplate(props)"
              icon="far fa-file-excel"
            >
              <q-tooltip class="bg-dark">Excel Para Restaurant</q-tooltip>
            </q-btn>
            <q-btn
              v-if="havePermise(permiseAdmin)"
              dense
              round
              flat
              color="grey"
              @click="createTemplate(props)"
              icon="fas fa-tools"
            >
              <q-tooltip class="bg-dark">Plantillas en excel</q-tooltip>
            </q-btn>
            <q-btn
              v-if="havePermise(permiseManager)"
              dense
              round
              flat
              color="grey"
              @click="createTemplateManager(props)"
              icon="fas fa-user-ninja"
            >
              <q-tooltip class="bg-dark"
                >Plantillas en excel Controller</q-tooltip
              >
            </q-btn>
            <q-btn
              v-if="havePermise(permiseManager)"
              dense
              round
              flat
              color="grey"
              @click="deleteRow(props)"
              icon="fas fa-trash-alt"
            >
              <q-tooltip class="bg-dark">Eliminar Plantilla</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
  <CreateStockInventory
    :show="showStock"
    @onClose="onCloseCreate"
    @onAccept="onCreateInventory"
  />
  <PysicalInventory
    :show="showInventory"
    v-if="showInventory"
    :templateId="idTemplate"
    :handleInventory="handleInventory"
    :store="storeName"
    :storeId="storeId.toString()"
    :description="description"
    @onClose="onClosePhysycalInventory"
  />
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, watchEffect } from 'vue';
import { useQuasar, QTableProps, date } from 'quasar';
import Verify from '../common/service/verify';
import { useRouter } from 'vue-router';
import moment from 'moment';
import 'moment/locale/es';
import CreateStockInventory from '../components/CreateStockInventory.vue';
import PysicalInventory from '../components/PhysicalInventory.vue';
import useSupabase from '../boot/supabase';
import XLSX from 'xlsx-js-style';
import readXlsFile from 'read-excel-file';
import { useUserStore } from '../stores/roles';
import { store } from 'quasar/wrappers';

export default defineComponent({
  components: {
    CreateStockInventory,
    PysicalInventory,
  },
  setup() {
    const userStore = useUserStore();
    const $q = useQuasar();
    // const items = ref([]);
    const tipo = ref(null);
    const show = ref('');
    const router = useRouter();
    const showStock = ref(false);
    const showInventory = ref(false);
    const handleInventory = ref('');
    const idTemplate = ref('');
    const storeName = ref('');
    const storeId = ref(0);
    const dateInventory = ref('');
    const description = ref('');
    const { supabase } = useSupabase();
    let compareRestList = [];
    const mainRestList = ref([]);
    let generalList = [];
    let generalTemplate = [];
    const optionsList = ref([
      {
        label: 'Insumo',
        value: '(I)',
        dbVal: 1,
      },
      {
        label: 'Producto',
        value: '(P)',
        dbVal: 2,
      },
      {
        label: 'Descartable',
        value: '(D)',
        dbVal: 6,
      },
      {
        label: 'Consumible',
        value: '(C)',
        dbVal: 8,
      },
      {
        label: 'Receta',
        value: '(R)',
        dbVal: 3,
      },
      {
        label: 'Derivado',
        value: '(De)',
        dbVal: 7,
      },
    ]);
    const permiseAll = ref('SuperAdmin,Administradores,Controller,Usuarios');
    const permiseAdmin = ref('SuperAdmin,Administradores,Controller');
    const permiseManager = ref('SuperAdmin,Controller');

    const schema = {
      IdRest: {
        // JSON object property name.
        prop: 'IdRest',
        type: String,
      },
      Codigo: {
        // JSON object property name.
        prop: 'Codigo',
        type: String,
      },
      Insumo: {
        // JSON object property name.
        prop: 'Insumo',
        type: String,
      },
      Tipo: {
        // JSON object property name.
        prop: 'Tipo',
        type: String,
      },
      Medida: {
        // JSON object property name.
        prop: 'Medida',
        type: String,
      },
      Unidad: {
        // JSON object property name.
        prop: 'Unidad',
        type: String,
      },
    };

    const columns: QTableProps['columns'] = [
      {
        name: 'Almacen',
        required: true,
        label: 'Almacén',
        align: 'left',
        field: (row) => row.store,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'Description',
        required: true,
        label: 'Descripcion',
        align: 'left',
        field: (row) => row.description,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'CreateBy',
        align: 'center',
        label: 'Usuario',
        field: (row) => row.created_by,
        format: (val) => `${val}`,
        sortable: true,
        //    required: showScreen.value,
      },
      {
        name: 'CreateAt',
        align: 'center',
        label: 'Fecha',
        field: (row) => row.create,
        format: (val) => `${val}`,
        sortable: true,
        //     required: showScreen.value,
      },
      { name: 'actions', label: 'Actions', field: '', align: 'center' },
    ];

    const visibleColumns = ref(['CreateBy', 'CreateAt', 'actions']);

    const optionsTipo = ref([
      {
        label: 'Insumo',
        value: '(I)',
        dbVal: 1,
      },
      {
        label: 'Producto',
        value: '(P)',
        dbVal: 2,
      },
      {
        label: 'Descartable',
        value: '(D)',
        dbVal: 6,
      },
      {
        label: 'Consumible',
        value: '(C)',
        dbVal: 8,
      },
      {
        label: 'Receta',
        value: '(R)',
        dbVal: 3,
      },
      {
        label: 'Derivado',
        value: '(De)',
        dbVal: 7,
      },
    ]);

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

    const rows = ref([]);

    const havePermise = (link) => {
      if (link.indexOf(userStore.user.Role) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    const humanize = (indate) => {
      const es = moment(indate).locale('es');
      // moment.lang('es',{ago:'hace'});
      //  moment.locale('es');
      return es.format('YYYY-MM-DD HH:mm::ssZ');
    };

    const onCloseCreate = () => {
      showStock.value = false;
    };

    const onClosePhysycalInventory = () => {
      showInventory.value = false;
    };

    const generarLista = async (show) => {
      try {
        let listValue = false;
        const params = {
          store: '6',
          dateInv: moment().format('YYYY-MM-DDTHH:mm:00'),
          select: '*',
        };
        if (show !== '0' && show !== '') {
          if (mainRestList.value.length === 0) {
            for (let i = 0; i < options.value.length; i++) {
              const restResultItem = await Verify.getRestaurantItems(
                params,
                optionsList.value[i].dbVal
              );
              if (restResultItem.success === 1) {
                listValue = true;
                const restModel = restResultItem.originalResponse.body.data;
                //   console.log('rstmodel' + i, restModel);
                if (restModel.length > 0 && restModel) {
                  restModel.forEach((x) => {
                    mainRestList.value.push(x);
                  });
                }
              }
            }

            $q.localStorage.set('mainList', mainRestList.value);

            return listValue;
          }
        } else {
          return listValue;
        }
      } catch (error) {
        console.log('mark:EDDA40AD3C64', error);
      }
    };

    const obtenerTipo = (tipo) => {
      try {
        const dato = optionsList.value.find((x) => x.value === tipo);
        return dato.label;
      } catch (error) {
        console.log(error);
      }
    };

    const generarTemplateList = async (tId, show) => {
      try {
        let tempItems = [];
        generalTemplate = [];
        if (show === 2) {
          let result = await supabase.rpc('gettemplatetoexel', {
            idtemplate: tId,
          });
          if (result.status === 200) {
            tempItems = result.data;
            // console.log('temps', mainRestList.value);
            mainRestList.value.map((x: any) => {
              let index = -1;
              for (let i = 0, len = tempItems.length; i < len; i++) {
                if (tempItems[i].item === parseInt(x.item_id)) {
                  generalTemplate.push({
                    zona: tempItems[i].zone,
                    subzona: tempItems[i].subzone,
                    id: x.item_id,
                    producto: x.item_descripcion,
                    tipo: obtenerTipo(x.item_prefijo),
                    unidadMedida: x.unidadmedidainsumo_descripcion,
                    stockActual: x.cantidad,
                    stockContado: tempItems[i].qty ? tempItems[i].qty : 0,
                  });
                }
              }
            });

            // context.emit('onUpdate', generalList.value);
          } else {
            console.log(
              result.error ? result.error : 'response' + result.statusText
            );
          }
        }
      } catch (error) {
        console.log('mark:EDDA40AD3C64', error);
      }
    };

    const generarTempListaEdit = async (tId, show) => {
      try {
        let tempItems = [];
        if (show === 2) {
          let result = await supabase
            .from('bizphysicalinventoryitems')
            .select()
            .eq('pis_piz_pi_id', tId);
          if (result.status === 200) {
            tempItems = result.data;
            // console.log('temps', mainRestList.value);
            mainRestList.value.map((x: any) => {
              let index = -1;
              for (let i = 0, len = tempItems.length; i < len; i++) {
                if (tempItems[i].item === parseInt(x.item_id)) {
                  generalList.push({
                    id: x.item_id,
                    codigo: x.item_id,
                    producto: x.item_descripcion,
                    tipo: obtenerTipo(x.item_prefijo),
                    unidadMedida: x.unidadmedidainsumo_descripcion,
                    stockActual: 0,
                    stockContado: tempItems[i].qty ? tempItems[i].qty : '',
                    costo: 0,
                    unidad: `     <= COSTO POR ${x.unidadmedidainsumo_descripcion}`,
                  });
                }
              }
            });

            // context.emit('onUpdate', generalList.value);
          } else {
            console.log(
              result.error ? result.error : 'response' + result.statusText
            );
          }
        }
      } catch (error) {
        console.log('mark:EDDA40AD3C64', error);
      }
    };

    onMounted(async () => {
      dateInventory.value = moment().format('YYYY-MM-DD');
      onSearch();
    });

    watchEffect(() => {
      try {
        visibleColumns.value =
          $q.screen.width > 600
            ? ['CreateBy', 'CreateAt', 'actions']
            : ['CreateAt', 'actions'];
      } catch (error) {
        console.log(error);
      }
    });

    const onSearch = async () => {
      try {
        rows.value = [];
        let dateValue = dateInventory.value;

        // Valida y convierte el formato de la fecha si es necesario
        if (moment(dateValue, 'YYYY/MM/DD', true).isValid()) {
          dateValue = moment(dateValue, 'YYYY/MM/DD').format('YYYY-MM-DD');
        } else if (!moment(dateValue, moment.ISO_8601, true).isValid()) {
          console.error('La fecha proporcionada no es válida:', dateValue);
          // Manejar el caso de fecha no válida
          return;
        }

        let _date = moment(dateValue).format('YYYY-MM-DD');
        let { data: response, error } = await supabase
          .from('bizphysicalinventory')
          .select('*')
          .eq('create', _date);

        if (error) {
          console.error('Error al realizar la consulta:', error);
        } else {
          console.log('Respuesta de la consulta:', response);
        }
        // console.log(response, 'responseCreate');
        if (response) {
          response.forEach((x) => {
            rows.value.push(x);
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    const editRow = (data) => {
      try {
        //console.log('data', data);
        idTemplate.value = data.row.id;
        storeName.value = data.row.store;
        storeId.value = data.row.store_id;
        description.value = data.row.description;
        showStock.value = false;
        showInventory.value = true;
        handleInventory.value = 'edit';
      } catch (error) {
        console.log(error);
      }
    };

    const onCreateInventory = (data) => {
      try {
        // console.log('data', data);
        idTemplate.value = data.template;
        storeName.value = data.store;
        storeId.value = data.storeId;
        description.value = data.description;
        showStock.value = false;
        showInventory.value = true;
        handleInventory.value = 'new';
      } catch (error) {
        console.log(error);
      }
    };

    const setTemplate = async (data) => {
      generalList = [];
      let rowStyle = [];
      const headerTime = moment().format('DD/MM/YYYY hh:mm A');
      $q.loading.show();
      await generarLista(2);
      await generarTempListaEdit(data.row.id, 2);

      const duplicado = generalList.reduce((acumulador, valorActual) => {
        const elementoYaExiste = acumulador.find(
          (elemento) => elemento.id === valorActual.id
        );
        if (elementoYaExiste) {
          return acumulador.map((elemento) => {
            if (elemento.id === valorActual.id) {
              return {
                ...elemento,
                stockContado:
                  elemento.stockContado !== ''
                    ? parseFloat(elemento.stockContado) +
                      parseFloat(valorActual.stockContado)
                    : 0,
              };
            }

            return elemento;
          });
        }

        return [...acumulador, valorActual];
      }, []);

      const wb = XLSX.utils.book_new();
      //   const ws = XLSX.utils.json_to_sheet([]);
      const border = {
        border: {
          right: {
            style: 'thin',
            color: { rgb: '000000' },
          },
          left: {
            style: 'thin',
            color: { rgb: '000000' },
          },
          top: {
            style: 'thin',
            color: { rgb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { rgb: '000000' },
          },
        },
      };
      const borderNoTop = {
        border: {
          right: {
            style: 'thin',
            color: { rgb: '000000' },
          },
          left: {
            style: 'thin',
            color: { rgb: '000000' },
          },

          bottom: {
            style: 'thin',
            color: { rgb: '000000' },
          },
        },
      };
      // STEP 2: Create data rows
      let row1 = [
        {
          v: ' Listado de PRODUCTOS del almacen: PRODUCCION - ALAMCEN',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '273948' },
            },
            font: {
              name: 'Calibri',
              sz: 13.5,
              color: { rgb: 'f1f1f1' },
              bold: true,
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
          },
        },
        '',
        '',
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '273948' },
            },
            alignment: { wrapText: true },
          },
        },
        '',
        '',
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '273948' },
            },
            alignment: { wrapText: true },
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '273948' },
            },
            alignment: { wrapText: true },
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '273948' },
            },
            alignment: { wrapText: true },
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '273948' },
            },
            alignment: { wrapText: true },
          },
        },
      ];
      let row2 = [
        '',
        '',
        '',
        '',
        '',
        '',
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '273948' },
            },
            alignment: { wrapText: true },
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '273948' },
            },
            alignment: { wrapText: true },
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '273948' },
            },
            alignment: { wrapText: true },
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '273948' },
            },
            alignment: { wrapText: true },
          },
        },
      ];
      let row3 = [
        {
          v: '',
          t: 's',
          s: {
            alignment: { wrapText: true },
          },
        },
        '',
        '',
        {
          v: '',
          t: 's',
          s: {
            alignment: { wrapText: true },
          },
        },
        '',
        '',
        '',
        '',
        '',
        '',
      ];
      let row4 = [
        {
          v: 'USO DEL ARCHIVO EXCEL PARA CUADRE DE STOCK',
          t: 's',
          s: {
            font: {
              name: 'Calibri',
              sz: 12,
              color: { rgb: 'FF6600' },
              bold: true,
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
          },
        },
      ];
      let row5 = [
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: 'FFC7CE' },
            },
            font: {
              name: 'Calibri',
              sz: 12,
              color: { rgb: 'FF6600' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: 'INFORMACIÓN QUE NO DEBES MODIFICAR NUNCA',
          t: 's',
          s: {
            font: {
              name: 'Calibri',
              sz: 10,
              color: { rgb: '000000' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: '',
          t: 's',
          s: {
            font: {
              name: 'Calibri',
              sz: 10,
              color: { rgb: '000000' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
            ...border,
          },
        },
        '',
        '',
        {
          v: 'FECHA DESCARGA PLANTILLA',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '99CCFF' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: '000000' },
            },
            alignment: { vertical: 'bottom', horizontal: 'center' },
            ...border,
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '99CCFF' },
            },
            alignment: { vertical: 'bottom', horizontal: 'left' },
            ...border,
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '99CCFF' },
            },
            alignment: { vertical: 'bottom', horizontal: 'left' },
            ...border,
          },
        },
        {
          v: headerTime,
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '99CCFF' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: '000000' },
            },
            alignment: { vertical: 'bottom', horizontal: 'center' },
            ...border,
          },
        },
        {
          v: '17/06/2022 07:59 PM',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '99CCFF' },
            },

            alignment: { vertical: 'bottom', horizontal: 'center' },
            ...border,
          },
        },
      ];
      let row6 = [
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: 'FFFFCC' },
            },
            font: {
              name: 'Calibri',
              sz: 12,
              color: { rgb: 'FF6600' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: 'INFORMACIÓN DEL PRODUCTO/INSUMO QUE TAMPOCO DEBES MODIFICAR',
          t: 's',
          s: {
            font: {
              name: 'Calibri',
              sz: 10,
              color: { rgb: '000000' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: '',
          t: 's',
          s: {
            font: {
              name: 'Calibri',
              sz: 10,
              color: { rgb: '000000' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
            ...border,
          },
        },
        '',
        {
          v: 'NOTAS',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '99CCFF' },
            },
            font: {
              name: 'Calibri',
              sz: 14,
              color: { rgb: '000000' },
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: 'SOLO SE ACTULIZARÁ EN EL SISTEMA COMO UN CUADRE DE STOCK, AQUELLOS CAMPOS QUE CONTENGAN INFORMACIÓN; SI NO DESEO ACTUALIZAR LOS DATOS, DEBO DEJAR EL CAMPO VACÍO SIN NINGÚN CARÁCTER. ASEGURATE DE ESPECIFICAR Y USAR EL FORMATO DE SEPARACIÓN DECIMAL CORRECTO ANTES DE IMPORTAR ESTE ARCHIVO.',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: 'FFFFFF' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'D20000' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
            ...border,
          },
        },
        '',
        '',
        '',
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: 'FFFFFF' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'D20000' },
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
            ...border,
          },
        },
      ];
      let row7 = [
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: 'CCFFCC' },
            },
            font: {
              name: 'Calibri',
              sz: 12,
              color: { rgb: 'FF6600' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: 'CAMPOS QUE PUEDES INGRESAR O MODIFICA',
          t: 's',
          s: {
            font: {
              name: 'Calibri',
              sz: 10,
              color: { rgb: '000000' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: '',
          t: 's',
          s: {
            font: {
              name: 'Calibri',
              sz: 10,
              color: { rgb: '000000' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
            ...border,
          },
        },
        '',
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '99CCFF' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: '000000' },
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: 'FFFFFF' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'D20000' },
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: 'FFFFFF' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'D20000' },
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: 'FFFFFF' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'D20000' },
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: 'FFFFFF' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'D20000' },
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
            ...border,
          },
        },
        {
          v: '',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: 'FFFFFF' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'D20000' },
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
            ...border,
          },
        },
      ];
      //AQUI EL ID DEL ALMACEN
      let row8 = [
        {
          v: 'ID almacén. No alterar',
          t: 's',
          s: {
            font: {
              name: 'Calibri',
              sz: 12,
              color: { rgb: 'FF6600' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
          },
        },
        {
          v: data.row.store_id,
          t: 's',
          s: {
            font: {
              name: 'Calibri',
              sz: 12,
              color: { rgb: 'FF6600' },
            },
            alignment: {
              vertical: 'bottom',
              horizontal: 'left',
              wrapText: true,
            },
          },
        },
      ];
      let row9 = [
        '',
        '',
        '',
        '',
        '',
        '',
        {
          v: 'SOLO NÚMEROS',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
        '',
        '',
        {
          v: 'SOLO NÚMEROS',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
      ];
      let row10 = [
        {
          v: 'ID',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
        {
          v: 'Código',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
        {
          v: 'Producto/Insumo',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
        {
          v: 'Tipo',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
        {
          v: 'Unidad Medida',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
        {
          v: 'Stock hasta el: ' + headerTime,
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
        {
          v: 'Stock contado',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
        {
          v: 'Costo hasta el: ' + headerTime,
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
        {
          v: 'Unidad',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
        {
          v: 'Costo nuevo',
          t: 's',
          s: {
            fill: {
              fgColor: { rgb: '4F4F4F' },
            },
            font: {
              name: 'Calibri',
              sz: 8,
              color: { rgb: 'ffffff' },
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,
            },
          },
        },
      ];
      const heading = [
        row1,
        row2,
        row3,
        row4,
        row5,
        row6,
        row7,
        row8,
        row9,
        row10,
      ];

      duplicado.forEach((x) => {
        heading.push([
          {
            v: x.id,
            t: 's',
            s: {
              fill: {
                fgColor: { rgb: 'FFC7CE' },
              },
              font: {
                name: 'Calibri',
                sz: 11,
                color: { rgb: '9C0006' },
              },
              alignment: { vertical: 'bottom', horizontal: 'center' },
              ...border,
            },
          },
          {
            v: x.codigo,
            t: 's',
            s: {
              fill: {
                fgColor: { rgb: 'FFFFCC' },
              },
              font: {
                name: 'Calibri',
                sz: 11,
                color: { rgb: '9C6500' },
              },
              alignment: { vertical: 'bottom', horizontal: 'center' },
              ...border,
            },
          },
          {
            v: x.producto,
            t: 's',
            s: {
              fill: {
                fgColor: { rgb: 'FFFFCC' },
              },
              font: {
                name: 'Calibri',
                sz: 11,
                color: { rgb: '9C6500' },
              },
              alignment: { vertical: 'bottom', horizontal: 'center' },
              ...border,
            },
          },
          {
            v: x.tipo,
            t: 's',
            s: {
              fill: {
                fgColor: { rgb: 'FFFFCC' },
              },
              font: {
                name: 'Calibri',
                sz: 11,
                color: { rgb: '9C6500' },
              },
              alignment: { vertical: 'bottom', horizontal: 'center' },
              ...border,
            },
          },
          {
            v: x.unidadMedida,
            t: 's',
            s: {
              fill: {
                fgColor: { rgb: 'FFFFCC' },
              },
              font: {
                name: 'Calibri',
                sz: 11,
                color: { rgb: '9C6500' },
              },
              alignment: { vertical: 'bottom', horizontal: 'center' },
              ...border,
            },
          },
          {
            v: x.stockActual,
            t: 's',
            s: {
              fill: {
                fgColor: { rgb: 'FFFFCC' },
              },
              font: {
                name: 'Calibri',
                sz: 11,
                color: { rgb: '9C6500' },
              },
              alignment: { vertical: 'bottom', horizontal: 'center' },
              ...border,
            },
          },
          {
            v: x.stockContado,
            t: 's',
            s: {
              fill: {
                fgColor: { rgb: 'CCFFCC' },
              },
              font: {
                name: 'Calibri',
                sz: 11,
                color: { rgb: '006100' },
              },
              alignment: { vertical: 'bottom', horizontal: 'center' },
              ...border,
            },
          },
          {
            v: x.costo,
            t: 's',
            s: {
              fill: {
                fgColor: { rgb: 'FFFFCC' },
              },
              font: {
                name: 'Calibri',
                sz: 11,
                color: { rgb: '9C6500' },
              },
              alignment: { vertical: 'bottom', horizontal: 'center' },
              ...border,
            },
          },
          {
            v: x.unidad,
            t: 's',
            s: {
              fill: {
                fgColor: { rgb: 'FFFFCC' },
              },
              font: {
                name: 'Calibri',
                sz: 11,
                color: { rgb: '9C6500' },
              },
              alignment: { vertical: 'bottom', horizontal: 'center' },
              ...border,
            },
          },
          {
            v: '',
            t: 's',
            s: {
              fill: {
                fgColor: { rgb: 'CCFFCC' },
              },
              font: {
                name: 'Calibri',
                sz: 11,
                color: { rgb: '006100' },
              },
              alignment: { vertical: 'bottom', horizontal: 'center' },
              ...border,
            },
          },
        ]);
        // if (i < generalList.value.length) {
        //   rowStyle[0].v = generalList.value[i].id;
        //   rowStyle[1].v = generalList.value[i].codigo;
        //   rowStyle[2].v = generalList.value[i].producto;
        //   rowStyle[3].v = generalList.value[i].tipo;
        // }
      });

      //  heading.push(rowStyle);

      const merge = { s: { r: 0, c: 0 }, e: { r: 1, c: 2 } };
      const merge1 = { s: { r: 0, c: 3 }, e: { r: 1, c: 5 } };
      const merge2 = { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } };
      const merge3 = { s: { r: 2, c: 3 }, e: { r: 2, c: 5 } };
      const merge4 = { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } };
      const merge5 = { s: { r: 4, c: 1 }, e: { r: 4, c: 2 } };
      const merge6 = { s: { r: 4, c: 5 }, e: { r: 4, c: 6 } };
      const merge7 = { s: { r: 4, c: 8 }, e: { r: 4, c: 9 } };
      const merge8 = { s: { r: 5, c: 1 }, e: { r: 5, c: 2 } };
      const merge9 = { s: { r: 5, c: 4 }, e: { r: 6, c: 4 } };
      const merge10 = { s: { r: 5, c: 5 }, e: { r: 6, c: 9 } };
      const merge11 = { s: { r: 6, c: 1 }, e: { r: 6, c: 2 } };
      const merge12 = { s: { r: 8, c: 0 }, e: { r: 8, c: 5 } };

      // STEP 3: Create Worksheet, add data, set cols widths
      const ws = XLSX.utils.aoa_to_sheet(heading);
      //   ws['!cols'] = [{ width: 20 }, { width: 20 }, { width: 40 },{ width: 20 }, { width: 20 },{ width: 20 }, { width: 20 }, { width: 20 },{ width: 20 }, { width: 20 }];
      //    ws['!rows'] = [{height:23}]
      if (!ws['!merges']) ws['!merges'] = [];
      ws['!merges'].push(merge);
      ws['!merges'].push(merge1);
      ws['!merges'].push(merge2);
      ws['!merges'].push(merge3);
      ws['!merges'].push(merge4);
      ws['!merges'].push(merge5);
      ws['!merges'].push(merge6);
      ws['!merges'].push(merge7);
      ws['!merges'].push(merge8);
      ws['!merges'].push(merge9);
      ws['!merges'].push(merge10);
      ws['!merges'].push(merge11);
      ws['!merges'].push(merge12);
      $q.loading.hide();
      //    XLSX.utils.sheet_add_aoa(ws1b,{origin: 'A1'});
      //   XLSX.utils.sheet_add_json(ws,rows,{ origin: 'A12', skipHeader: true });
      XLSX.utils.book_append_sheet(wb, ws, 'InsumosYProductosParaCuadre');

      // STEP 4: Write Excel file to browser
      XLSX.writeFile(wb, 'plantilladeinventariorestaurant.xlsx');

      // eslint-disable-next-line quotes
      console.log(
        // eslint-disable-next-line quotes
        `\n--------------------==~==~==~==[ ...DEMO COMPLETE ]==~==~==~==--------------------\n\n`
      );
    };

    const createTemplate = async (data) => {
      generalList = [];
      let rowStyle = [];
      const headerTime = moment().format('DD/MM/YYYY hh:mm A');
      $q.loading.show();
      await generarLista(2);
      await generarTemplateList(data.row.id, 2);
      // console.log('output->generalList.value', generalTemplate.value);

      const result = generalTemplate.reduce((acc, curr) => {
        acc[curr.zona] = acc[curr.zona] || [];
        acc[curr.zona].push({ ident: curr });
        return acc;
      }, {});

      const wb = XLSX.utils.book_new();
      //   const ws = XLSX.utils.json_to_sheet([]);
      const border = {
        border: {
          right: {
            style: 'thin',
            color: { rgb: '000000' },
          },
          left: {
            style: 'thin',
            color: { rgb: '000000' },
          },
          top: {
            style: 'thin',
            color: { rgb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { rgb: '000000' },
          },
        },
      };
      const borderNoTop = {
        border: {
          right: {
            style: 'thin',
            color: { rgb: '000000' },
          },
          left: {
            style: 'thin',
            color: { rgb: '000000' },
          },

          bottom: {
            style: 'thin',
            color: { rgb: '000000' },
          },
        },
      };
      // STEP 2: Create data rows

      let row10 = [
        {
          v: 'Zona',
          t: 's',
          s: '',
        },

        {
          v: 'subZona',
          t: 's',
          s: '',
        },
        {
          v: 'Id',
          t: 's',
          s: '',
        },
        {
          v: 'Tipo',
          t: 's',
          s: '',
        },

        {
          v: 'Producto',
          t: 's',
          s: '',
        },
        {
          v: 'Unidad',
          t: 's',
          s: '',
        },
        {
          v: 'Cantidad',
          t: 's',
          s: '',
        },
      ];

      Object.entries(result).forEach(([key, value]) => {
        const heading = [row10];
        generalTemplate.forEach((x) => {
          if (key === x.zona) {
            heading.push([
              {
                v: x.zona,
                t: 's',
                s: '',
              },
              {
                v: x.subzona,
                t: 's',
                s: '',
              },
              {
                v: x.id,
                t: 's',
                s: '',
              },
              {
                v: x.tipo,
                t: 's',
                s: '',
              },
              {
                v: x.producto,
                t: 's',
                s: '',
              },
              {
                v: x.unidadMedida,
                t: 's',
                s: '',
              },
              {
                v: '',
                t: 's',
                s: '',
              },
            ]);
            // if (i < generalList.value.length) {
            //   rowStyle[0].v = generalList.value[i].id;
            //   rowStyle[1].v = generalList.value[i].codigo;
            //   rowStyle[2].v = generalList.value[i].producto;
            //   rowStyle[3].v = generalList.value[i].tipo;
            // }
          }
        });

        //  heading.push(rowStyle);

        // const merge = { s: { r: 0, c: 0 }, e: { r: 1, c: 2 } };
        // const merge1 = { s: { r: 0, c: 3 }, e: { r: 1, c: 5 } };
        // const merge2 = { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } };
        // const merge3 = { s: { r: 2, c: 3 }, e: { r: 2, c: 5 } };
        // const merge4 = { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } };
        // const merge5 = { s: { r: 4, c: 1 }, e: { r: 4, c: 2 } };
        // const merge6 = { s: { r: 4, c: 5 }, e: { r: 4, c: 6 } };
        // const merge7 = { s: { r: 4, c: 8 }, e: { r: 4, c: 9 } };
        // const merge8 = { s: { r: 5, c: 1 }, e: { r: 5, c: 2 } };
        // const merge9 = { s: { r: 5, c: 4 }, e: { r: 6, c: 4 } };
        // const merge10 = { s: { r: 5, c: 5 }, e: { r: 6, c: 9 } };
        // const merge11 = { s: { r: 6, c: 1 }, e: { r: 6, c: 2 } };
        // const merge12 = { s: { r: 8, c: 0 }, e: { r: 8, c: 5 } };

        // STEP 3: Create Worksheet, add data, set cols widths
        const ws = XLSX.utils.aoa_to_sheet(heading);
        //   ws['!cols'] = [{ width: 20 }, { width: 20 }, { width: 40 },{ width: 20 }, { width: 20 },{ width: 20 }, { width: 20 }, { width: 20 },{ width: 20 }, { width: 20 }];
        //    ws['!rows'] = [{height:23}]
        if (!ws['!merges']) ws['!merges'] = [];
        // ws['!merges'].push(merge);
        // ws['!merges'].push(merge1);
        // ws['!merges'].push(merge2);
        // ws['!merges'].push(merge3);
        // ws['!merges'].push(merge4);
        // ws['!merges'].push(merge5);
        // ws['!merges'].push(merge6);
        // ws['!merges'].push(merge7);
        // ws['!merges'].push(merge8);
        // ws['!merges'].push(merge9);
        // ws['!merges'].push(merge10);
        // ws['!merges'].push(merge11);
        // ws['!merges'].push(merge12);
        $q.loading.hide();
        //    XLSX.utils.sheet_add_aoa(ws1b,{origin: 'A1'});
        //   XLSX.utils.sheet_add_json(ws,rows,{ origin: 'A12', skipHeader: true });
        XLSX.utils.book_append_sheet(wb, ws, key);
      });

      // STEP 4: Write Excel file to browser
      XLSX.writeFile(wb, 'Template.xlsx');

      // eslint-disable-next-line quotes
      console.log(
        // eslint-disable-next-line quotes
        `\n--------------------==~==~==~==[ ...DEMO COMPLETE ]==~==~==~==--------------------\n\n`
      );
    };

    const CompareList = async (tId) => {
      try {
        console.log('storeid', tId);
        const params = {
          store: parseInt(tId),
          dateInv: moment(dateInventory.value).format(
            'YYYY-MM-DD' + '%20' + '23:00:00'
          ),
          select: '*',
        };
        //  console.log('output->params', params);
        if (compareRestList.length === 0) {
          for (let i = 0; i < options.value.length; i++) {
            const restResultItem = await Verify.getRestaurantItems(
              params,
              optionsTipo.value[i].dbVal
            );
            if (restResultItem.success === 1) {
              const restModel = restResultItem.originalResponse.body.data;
              //   console.log('rstmodel' + i, restModel);
              if (restModel.length > 0 && restModel) {
                restModel.forEach((x) => {
                  compareRestList.push(x);
                });
              }
            }
          }
        }
      } catch (error) {
        console.log('mark:EDDA40AD3C64', error);
      }
    };

    const verify = async (data, show) => {
      try {
        compareRestList = [];
        $q.loading.show();
        await CompareList(data.store_id);
        $q.loading.hide();
        try {
          let duplicado = [];
          if (show === 2) {
            let result = await supabase.rpc('gettemplatetoexel', {
              idtemplate: data.id,
            });
            if (result.status === 200) {
              duplicado = result.data;
              const tempItems = duplicado.reduce((acumulador, valorActual) => {
                const elementoYaExiste = acumulador.find(
                  (elemento) => elemento.item === valorActual.item
                );
                if (elementoYaExiste) {
                  return acumulador.map((elemento) => {
                    if (elemento.item === valorActual.item) {
                      return {
                        ...elemento,
                        qty: elemento.qty
                          ? parseFloat(elemento.qty) +
                            parseFloat(valorActual.qty)
                          : 0,
                      };
                    }

                    return elemento;
                  });
                }

                return [...acumulador, valorActual];
              }, []);
              //    console.log(tempItems, 'temp');
              //    console.log('comp', compareRestList);
              compareRestList.map((x: any) => {
                for (let i = 0, len = tempItems.length; i < len; i++) {
                  if (tempItems[i].item === parseInt(x.item_id)) {
                    generalTemplate.push({
                      zona: tempItems[i].zone,
                      subzona: tempItems[i].subzone,
                      id: x.item_id,
                      producto: x.item_descripcion,
                      tipo: obtenerTipo(x.item_prefijo),
                      unidadMedida: x.unidadmedidainsumo_descripcion,
                      stockActual: x.cantidad,
                      stockContado: tempItems[i].qty ? tempItems[i].qty : 0,
                    });
                  }
                }
              });
            } else {
              console.log(
                result.error ? result.error : 'response' + result.statusText
              );
            }
          }
        } catch (error) {
          console.log('mark:EDDA40AD3C64', error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const createTemplateManager = async (data) => {
      generalList = [];
      console.log('output->data', data);
      $q.loading.show();

      //await generarLista(2);
      await verify(data.row, 2);
      // console.log('output->generalList.value', generalTemplate.value);

      const result = generalTemplate.reduce((acc, curr) => {
        acc[curr.zona] = acc[curr.zona] || [];
        acc[curr.zona].push({ ident: curr });
        return acc;
      }, {});

      const wb = XLSX.utils.book_new();

      let row10 = [
        {
          v: 'Zona',
          t: 's',
          s: '',
        },

        {
          v: 'subZona',
          t: 's',
          s: '',
        },
        {
          v: 'Id',
          t: 's',
          s: '',
        },
        {
          v: 'Tipo',
          t: 's',
          s: '',
        },

        {
          v: 'Producto',
          t: 's',
          s: '',
        },
        {
          v: 'Unidad',
          t: 's',
          s: '',
        },
        {
          v: 'Stock',
          t: 's',
          s: '',
        },
        {
          v: 'Cantidad',
          t: 's',
          s: '',
        },
        {
          v: 'Diff',
          t: 's',
          s: '',
        },
      ];

      Object.entries(result).forEach(([key, value]) => {
        const heading = [row10];
        generalTemplate.forEach((x) => {
          if (key === x.zona) {
            heading.push([
              {
                v: x.zona,
                t: 's',
                s: '',
              },
              {
                v: x.subzona,
                t: 's',
                s: '',
              },
              {
                v: x.id,
                t: 's',
                s: '',
              },
              {
                v: x.tipo,
                t: 's',
                s: '',
              },
              {
                v: x.producto,
                t: 's',
                s: '',
              },
              {
                v: x.unidadMedida,
                t: 's',
                s: '',
              },
              {
                v: x.stockActual,
                t: 's',
                s: '',
              },
              {
                v: x.stockContado,
                t: 's',
                s: '',
              },
              {
                v: x.stockActual - x.stockContado,
                t: 's',
                s: '',
              },
            ]);
          }
        });

        const ws = XLSX.utils.aoa_to_sheet(heading);

        if (!ws['!merges']) ws['!merges'] = [];

        $q.loading.hide();

        XLSX.utils.book_append_sheet(wb, ws, key);
      });

      // STEP 4: Write Excel file to browser
      XLSX.writeFile(wb, 'Template.xlsx');

      // eslint-disable-next-line quotes
      console.log(
        // eslint-disable-next-line quotes
        `\n--------------------==~==~==~==[ ...DEMO COMPLETE ]==~==~==~==--------------------\n\n`
      );
    };

    const deleteRow = async (data) => {
      try {
        let result = await supabase
          .from('bizphysicalinventoryzone')
          .delete()
          .eq('pi_id', data.row.id);
        if (result.status === 200) {
          let result2 = await supabase
            .from('bizphysicalinventory')
            .delete()
            .eq('id', data.row.id);
          $q.notify({
            position: 'top',
            type: 'positive',
            message: `Se ha eliminado la plantilla ${data.row.Description}`,
          });
          await onSearch();
        }
        if (result.error) {
          $q.notify({
            position: 'top',
            type: 'negative',
            message: `Hubo un error al tratar de eliminar ${data.row.Description}`,
          });
        }
      } catch (error) {
        console.log('output->error', error);
      }
    };

    return {
      columns,
      rows,
      show,
      tipo,
      options,
      showStock,
      storeName,
      storeId,
      description,
      handleInventory,
      dateInventory,
      visibleColumns,
      selected: ref([]),
      dato: ref(false),
      showInventory,
      idTemplate,
      permiseAll,
      permiseAdmin,
      permiseManager,
      editRow,
      onCloseCreate,
      onCreateInventory,
      onClosePhysycalInventory,
      onSearch,
      setTemplate,
      createTemplate,
      havePermise,
      createTemplateManager,
      deleteRow,
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months:
          'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
            '_'
          ),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split(
          '_'
        ),
        firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
        format24h: true,
        pluralDay: 'dias',
      },
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

:deep(.q-field__native .q-placeholder) {
  color: white;
}

:deep(.q-field--with-bottom) {
  padding-bottom: 0px;
}
</style>
