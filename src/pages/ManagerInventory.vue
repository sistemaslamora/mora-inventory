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
        @click="showStock = true"
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
          <q-input
            dark
            dense
            standout
            v-model="dateInventory"
            mask="date"
            :rules="['date']"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
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
                    <div class="row items-center justify-start">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
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
        style="line-height: 1.5rem;"
      >
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
              icon="far fa-edit"
            ></q-btn>
            <q-btn
              dense
              round
              flat
              color="grey"
              @click="setTemplate(props)"
              icon="far fa-file-excel"
            ></q-btn>
            <q-btn
              dense
              round
              flat
              color="grey"
              @click="createTemplate(props)"
              icon="far fa-file-excel"
            ></q-btn>
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
    :storeId="storeId"
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

export default defineComponent({
  components: {
    CreateStockInventory,
    PysicalInventory,
  },
  setup() {
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
    const jsonExcel = ref();
    const items = ref([]);
    const valor = ref([]);
    const files = ref(null);
    const mainRestList = ref([]);
    const generalList = ref([]);
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
        name: 'CreateBy',
        align: 'center',
        label: 'Usuario',
        field: (row) => row.create_by,
        format: (val) => `${val}`,
        sortable: true,
        //    required: showScreen.value,
      },
      {
        name: 'CreateAt',
        align: 'center',
        label: 'Fecha',
        field: (row) => moment(row.created_at).format('YYYY-MM-DD'),
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
          dateInv: moment().format('YYYY-MM-DD' + '%20' + 'HH:mm:00'),
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

            //  $q.localStorage.set('mainList', mainRestList.value);

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
            console.log('temps', mainRestList.value);
            mainRestList.value.map((x: any) => {
              let index = -1;
              for (let i = 0, len = tempItems.length; i < len; i++) {
                if (tempItems[i].item === parseInt(x.item_id)) {
                  generalList.value.push({
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
      dateInventory.value = moment().format('YYYY-MM-DD HH:mm::ssZ');
      // try {
      //   let physical = await supabase
      //   .from('bizphysicalinventory')
      //   .select('*')
      //   // Filters
      //   .eq('column', 'Equal to')
      // } catch (error) {
      //   console.log(error)
      // }
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
        let _date = moment(dateInventory.value).format('YYYY-MM-DD');
        // const timeStamp = Date.now();
        // const formattedString = date.formatDate(
        //   timeStamp,
        //   'YYYY-MM-DDTHH:mm:ss.SSSZ'
        // );
        // console.log('date', formattedString);
        // console.log(_date);
        let { data: response, error } = await supabase
          .from('bizphysicalinventory')
          .select('created_at');
        // Filters
        // .eq('dateconvert', _date);
        console.log(response);
        const physical = await supabase.rpc('get_inventory_by_date', {
          fecha: _date,
        });
        if (physical.status === 200) {
          physical.data.forEach((x) => {
            rows.value.push(x);
          });
        } else {
          console.log(
            physical.error ? physical.error : 'result' + physical.statusText
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    const editRow = (data) => {
      try {
        console.log('data', data);
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
        console.log('data', data);
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

    const subirExcel = async () => {
      try {
        //const data2 = files.value //document.getElementById('archivoExcel') as HTMLInputElement | null;
        await readXlsFile(files.value, { schema }).then(({ rows, errors }) => {
          // `errors` list items have shape: `{ row, column, error, reason?, value?, type? }`.
          errors.length === 0;
          jsonExcel.value = rows;
          // rows === [{
          //     date: new Date(2018, 2, 24),
          //     numberOfStudents: 10,
          //     course: {
          //     isFree: true,
          //     title: 'Chemistry'
          //     },
          //     contact: '+11234567890',
          //     status: 'SCHEDULED'
          // }]
        });
        //  jsonExcel.value = await readXlsFile(files.value, { schema })
        // console.log('devolver el excel', jsonExcel.value);

        verificarExcel(jsonExcel.value);
      } catch (error) {
        console.log(error);
      }
    };

    function getDifference<T>(a: T[], b: T[]): T[] {
      return a.filter((element) => {
        return !b.includes(element);
      });
    }

    const verificarExcel = async (data: []) => {
      let info = [];
      let containsAll: [];
      const params = {
        select: 'IdRest',
      };
      const resultAvatar = await Verify.findItem(params);
      if (resultAvatar.success === 1) {
        items.value = resultAvatar.originalResponse.body;

        info = data.map((x: any) => {
          let index = -1;
          for (let i = 0, len = items.value.length; i < len; i++) {
            if (items.value[i].IdRest === parseInt(x.IdRest)) {
              index = i;
              break;
            }
          }
          if (index === -1) {
            valor.value.push(x);
          }
        });

        console.log('la diff', valor.value);
      }
    };

    const setTemplate = async (data) => {
      generalList.value = [];
      let rowStyle = [];
      const headerTime = moment().format('DD/MM/YYYY hh:mm A');
      $q.loading.show();
      await generarLista(2);
      await generarTempListaEdit(data.row.id, 2);
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

      generalList.value.forEach((x) => {
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
      XLSX.writeFile(wb, 'xx.xlsx');

      // eslint-disable-next-line quotes
      console.log(
        // eslint-disable-next-line quotes
        `\n--------------------==~==~==~==[ ...DEMO COMPLETE ]==~==~==~==--------------------\n\n`
      );
    };

    const createTemplate = async (data) => {
      generalList.value = [];
      let rowStyle = [];
      const headerTime = moment().format('DD/MM/YYYY hh:mm A');
      $q.loading.show();
      await generarLista(2);
      await generarTempListaEdit(data.row.id, 2);
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
          v: 'ID',
          t: 's',
          s: '',
        },

        {
          v: 'Producto/Insumo',
          t: 's',
          s: '',
        },
        {
          v: 'Tipo',
          t: 's',
          s: '',
        },
        {
          v: 'Unidad Medida',
          t: 's',
          s: '',
        },

        {
          v: 'Stock contado',
          t: 's',
          s: '',
        },
      ];
      const heading = [row10];

      generalList.value.forEach((x) => {
        heading.push([
          {
            v: x.id,
            t: 's',
            s: '',
          },
          {
            v: x.codigo,
            t: 's',
            s: '',
          },
          {
            v: x.producto,
            t: 's',
            s: '',
          },
          {
            v: x.tipo,
            t: 's',
            s: '',
          },
          {
            v: x.unidadMedida,
            t: 's',
            s: '',
          },
          {
            v: x.stockContado,
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
      XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

      // STEP 4: Write Excel file to browser
      XLSX.writeFile(wb, 'Template.xlsx');

      // eslint-disable-next-line quotes
      console.log(
        // eslint-disable-next-line quotes
        `\n--------------------==~==~==~==[ ...DEMO COMPLETE ]==~==~==~==--------------------\n\n`
      );
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
      editRow,
      onCloseCreate,
      onCreateInventory,
      onClosePhysycalInventory,
      onSearch,
      setTemplate,
      createTemplate,
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

::v-deep(.q-field__native .q-placeholder) {
  color: white;
}

::v-deep(.q-field--with-bottom) {
  padding-bottom: 0px;
}
</style>
