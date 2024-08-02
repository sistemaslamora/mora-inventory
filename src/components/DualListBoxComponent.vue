<template>
  <div class="row q-pa-sm justify-between section">
    <div style="width: 49%">
      <q-table
        class="my-sticky-header-table"
        title="Treats"
        dense
        :rows="rowsDb"
        :columns="columnsDb"
        row-key="idrest"
        :filter="filter"
        :loading="loading"
        virtual-scroll
        v-model:pagination="pagination"
        no-data-label="No se ha cargado inforamción"
        :rows-per-page-options="[0]"
        :visible-columns="visibleColumns"
        @row-dblclick="passData"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-italic text-white"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:top>
          <!-- <q-btn color="primary" :disable="loading" label="Add row" @click="addRow" />
                    <q-btn class="q-ml-sm" color="primary" :disable="loading" label="Remove row" @click="removeRow" />-->

          <div style="margin-right: 1rem; width: 130px">
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
          <div>
            <q-input dark dense standout v-model="filter">
              <template v-slot:append>
                <q-icon v-if="filterTemp === ''" name="search" />
                <q-icon
                  v-else
                  name="clear"
                  class="cursor-pointer"
                  @click="filterTemp = ''"
                />
              </template>
            </q-input>
          </div>
        </template>
      </q-table>
    </div>
    <!-- <div
      class="flex column justify-center"
      style="width: 10%"
    >
      <div class="q-pa-md q-gutter-sm">
        <q-btn
          square
          color="warning"
          text-color="black"
          icon="fas fa-share"
        />
      </div>
      <div class="q-pa-md q-gutter-sm">
        <q-btn
          square
          color="warning"
          text-color="black"
          icon="fas fa-reply"
        />
      </div>
    </div> -->
    <div style="width: 49%">
      <q-table
        class="my-sticky-header-table"
        title="Zone"
        dense
        :rows="rowsTemp"
        :columns="columnsTemp"
        row-key="id"
        :filter="filterTemp"
        :loading="loading2"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        no-data-label="I didn't find anything for you"
        :visible-columns="visibleColumns"
        @row-dblclick="restoreData"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template v-slot:top>
          <!-- <q-btn color="primary" :disable="loading" label="Add row" @click="addRow" />
                    <q-btn class="q-ml-sm" color="primary" :disable="loading" label="Remove row" @click="removeRow" />-->
          <div class="row no-wrap justify-between">
            <div>
              <q-file
                :model-value="files"
                @update:model-value="updateFiles"
                label="Xls"
                dark
                dense
                standout
                class="q-ml-sm"
                :clearable="!isUploading"
                style="max-width: 200px"
              >
                <template v-slot:file="{ index, file }">
                  <q-chip
                    class="full-width q-my-xs text-italic text-black"
                    :removable="
                      isUploading && uploadProgress[index].percent < 1
                    "
                    square
                    @remove="cancelFile(index)"
                  >
                    <q-linear-progress
                      class="absolute-full full-height"
                      :value="uploadProgress[index].percent"
                      :color="uploadProgress[index].color"
                      track-color="grey-2"
                    />

                    <q-avatar>
                      <q-icon :name="uploadProgress[index].icon" />
                    </q-avatar>

                    <div
                      class="ellipsis relative-position text-italic text-black"
                    >
                      {{ file.name }}
                    </div>

                    <q-tooltip>
                      {{ file.name }}
                    </q-tooltip>
                  </q-chip>
                </template>

                <template v-slot:after v-if="canUpload">
                  <q-btn
                    color="secondary"
                    dense
                    icon="cloud_upload"
                    round
                    @click="upload"
                    :disable="!canUpload"
                    :loading="isUploading"
                  />
                </template>
              </q-file>
            </div>

            <div>
              <q-input dark dense standout v-model="filterTemp" class="q-ml-sm">
                <template v-slot:append>
                  <q-icon v-if="filterTemp === ''" name="search" />
                  <q-icon
                    v-else
                    name="clear"
                    class="cursor-pointer"
                    @click="filterTemp = ''"
                  />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import Verify from '../common/service/verify';
import readXlsFile from 'read-excel-file';
import { QTableProps } from 'quasar';

const columnsDb = [
  {
    name: 'idrest',
    label: 'Id',
    align: 'left',
    field: (row:any) => row.item_id,
    format: (val:any) => `${val}`,
    sortable: true,
  },
  {
    name: 'insumo',
    required: true,
    label: 'Item',
    align: 'left',
    field: (row:any) => row.item_descripcion,
    format: (val:any) => `${val}`,
    sortable: true,
  },
] as QTableProps['columns'];

const columnsTemp = [
  {
    name: 'idrest',
    label: 'Id',
    align: 'left',
    field: (row:any) => row.item_id,
    format: (val:any) => `${val}`,
    sortable: true,
  },
  {
    name: 'insumo',
    required: true,
    label: 'Item',
    align: 'left',
    field: (row:any) => row.item_descripcion,
    format: (val:any) => `${val}`,
    sortable: true,
  },
]as QTableProps['columns'];

export default {
  emits: ['onUpdate'],
  props: {
    show: {
      type: String,
      required: true,
    },
    selected: {
      type: Object,
      required: false,
    },
  },
  setup(props, context: any) {
    const loading = ref(false);
    const loading2 = ref(false);
    const filter = ref('');
    const filterTemp = ref('');
    const rowCount = ref(10);
    const rowsDb = ref([]);
    const rowsTemp = ref([]);
    const items = ref([]);
    const generalList = ref([]);
    const mainRestList = ref([]);
    const tipo = ref(null);
    const jsonExcel = ref();
    const files = ref(null);
    const schema = {
      Codigo: {
        // JSON object property name.
        prop: 'codigo',
        type: String,
      },
      Insumo: {
        // JSON object property name.
        prop: 'insumo',
        type: String,
      },
    };
    const map = {
      codigo: 'codigo',
      insumo: 'insumo',
    };

    const options = ref([
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

    const filterType = () => {
      try {
        if (mainRestList.value.length > 0) {
          rowsDb.value = mainRestList.value.filter(
            (x) => x.item_prefijo === tipo.value.value
          );
        }
      } catch (error) {
        console.log('mark:EDDA40AD3C64', error);
      }
    };

    const uploadProgress = ref([]);
    const uploading = ref(null);

    function cleanUp() {
      clearTimeout(uploading.value);
    }

    function updateUploadProgress() {
      let done = true;

      uploadProgress.value = uploadProgress.value.map((progress) => {
        if (progress.percent === 1 || progress.error === true) {
          return progress;
        }

        const percent = Math.min(1, progress.percent + Math.random() / 0.1);
        const error = false; //percent < 1 && Math.random() > 0.95;

        if (error === false && percent < 1 && done === true) {
          done = false;
        }

        return {
          ...progress,
          error,
          color: 'green-2',
          percent,
        };
      });

      uploading.value =
        done !== true ? setTimeout(updateUploadProgress, 300) : null;
    }

    // onBeforeUnmount(cleanUp)
    const cancelFile = (index) => {
      uploadProgress[index] = {
        ...uploadProgress[index],
        error: true,
        color: 'orange-2',
      };
    };

    const updateFiles = (newFiles) => {
      files.value = newFiles;
      console;
      uploadProgress.value = [
        {
          error: false,
          color: 'green-2',
          percent: 0,
          // icon:
          //   newFiles.type.indexOf('video/') === 0
          //     ? 'movie'
          //     : newFiles.type.indexOf('image/') === 0
          //     ? 'photo'
          //     : newFiles.type.indexOf('audio/') === 0
          //     ? 'audiotrack'
          //     : 'insert_drive_newFiles',
        },
      ];
    };

    const upload = async () => {
      cleanUp();

      const allDone = uploadProgress.value.every(
        (progress) => progress.percent === 1
      );

      uploadProgress.value = uploadProgress.value.map((progress) => ({
        ...progress,
        error: false,
        color: 'green-2',
        percent: allDone === true ? 0 : progress.percent,
      }));

      updateUploadProgress();
      await subirExcel();
    };

    const subirExcel = async () => {
      try {
        //const data2 = files.value //document.getElementById('archivoExcel') as HTMLInputElement | null;
        // await readXlsFile(files.value, { schema }).then(({ rows, errors }) => {
        // `errors` list items have shape: `{ row, column, error, reason?, value?, type? }`.
        //     errors.length === 0;
        //     jsonExcel.value = rows;

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
        // });
        const template = props.selected;
        jsonExcel.value = await readXlsFile(files.value, { map });
        jsonExcel.value.rows.forEach((element) => {
          generalList.value.push({
            idTemplate: template.idTemplate,
            idZone: template.idZone,
            idSubZone: template.idSubZone,
            item_id: element.codigo,
            item_descripcion: element.insumo,
          });
          files.value = null;
          uploadProgress.value = [];
          uploading.value = null;
        });

        rowsTemp.value = generalList.value.filter(
          (x) => x.idSubZone === props.selected.idSubZone
        );

        // verificarExcel(jsonExcel.value);
      } catch (error) {
        console.log(error);
      }
    };

    const clearList = () => {
      rowsTemp.value = [];
    };

    const loadingList = (value, show) => {
      loading.value = value;
      loading2.value = show === '0' ? false : true;
    };

    const generarLista = async (list) => {
      let listValue = false;
      try {
        mainRestList.value = list;
        //console.log('main', mainRestList.value);
        rowsDb.value = [];
        rowsDb.value = mainRestList.value.filter(
          (x) => x.item_prefijo === '(I)'
        );
        if (rowsDb.value.length > 0) {
          loading.value = false;
        }
      } catch (error) {
        console.log('mark:EDDA40AD3C64', error);
      }
    };

    const generarImportLista = async (importList, subzone, show) => {
      try {
        let tempItems = [];
        if (show === '2') {
          rowsTemp.value = [];
          generalList.value = importList;
          // generalList.value.forEach((x) => {
          //   let j = rowsDb.value.findIndex(
          //     (data) => data.item_id === x.item_id
          //   );

          //   if (j !== -1) {
          //     rowsDb.value.splice(j, 1);
          //   }
          // });

          rowsTemp.value = generalList.value.filter(
            (x) => x.idSubZone === subzone
          );
          context.emit('onUpdate', generalList.value);
        }
      } catch (error) {
        console.log('mark:EDDA40AD3C64', error);
      }
    };

    const generarTempLista = async (params, show) => {
      try {
        let tempItems = [];
        generalList.value = [];
        if (show === '2') {
          rowsTemp.value = [];
          const filter = {
            pls_plz_pli_id: `eq.${params}`,
            select: '*',
          };
          //NOTE - hay que enviar el tipo de articulos(insumo = 1, producto = 2, recetas = 3, descartable= 6)
          // Cache the result of Verify.getItemsTemplate(filter)
          const templateResultItem = await Verify.getItemsTemplate(filter);
          if (templateResultItem.success === 1) {
            const tempItems = templateResultItem.originalResponse.body;
            const itemsByItemId = {}; // Convert tempItems to an object with item_id keys
            tempItems.forEach((item) => (itemsByItemId[item.item] = item));

            // Use array methods to filter and find relevant items
            generalList.value = mainRestList.value
              .filter((x) => itemsByItemId[x.item_id]) // Filter out irrelevant items
              .map((x) => {
                const item = itemsByItemId[x.item_id];
                return {
                  idTemplate: item.pls_plz_pli_id,
                  idZone: item.pls_plz_id,
                  idSubZone: item.pls_id,
                  item_id: x.item_id,
                  item_descripcion: x.item_descripcion,
                };
              });
          }
          rowsTemp.value = generalList.value.filter(
            (x) => x.idSubZone === props.selected.idSubZone
          );
          //   console.log('main2', mainRestList.value);
          // const templateResultItem = await Verify.getItemsTemplate(filter);
          // if (templateResultItem.success === 1) {
          //   tempItems = templateResultItem.originalResponse.body;
          //   //   console.log('temps', tempItems);
          // } else {
          // }
          // mainRestList.value.map((x: any) => {
          //   let index = -1;
          //   for (let i = 0, len = tempItems.length; i < len; i++) {
          //     if (tempItems[i].item === parseInt(x.item_id)) {
          //       generalList.value.push({
          //         idTemplate: tempItems[i].pls_plz_pli_id,
          //         idZone: tempItems[i].pls_plz_id,
          //         idSubZone: tempItems[i].pls_id,
          //         item_id: x.item_id,
          //         item_descripcion: x.item_descripcion,
          //       });
          //       // let j = rowsDb.value.findIndex(
          //       //   (data) => data.item_id === x.item_id
          //       // );

          //       // if (j !== -1) {
          //       //   rowsDb.value.splice(j, 1);
          //       // }
          //     }
          //     rowsTemp.value = generalList.value.filter(
          //       (x) => x.idSubZone === props.selected.idSubZone
          //     );
          //   }
          // });
          // // console.log('generarl', generalList.value);
          loading2.value = false;
          context.emit('onUpdate', generalList.value);
        }
      } catch (error) {
        console.log('mark:EDDA40AD3C64', error);
      }
    };

    const restoreData = (evt, row) => {
      try {
        // rowsDb.value.push(row);
        // rowsDb.value.sort(function (a, b) {
        //   if (a.item_descripcion > b.item_descripcion) {
        //     return 1;
        //   }
        //   if (a.item_descripcion < b.item_descripcion) {
        //     return -1;
        //   }
        //   // a must be equal to b
        //   return 0;
        // });
        // console.log('rowsdb', rowsDb.value);
        let i = rowsTemp.value.findIndex(
          (data) => data.item_id === row.item_id
        );

        if (i !== -1) {
          rowsTemp.value.splice(i, 1);
        }

        generalList.value = generalList.value.filter(
          (item) => item.item_id !== row.item_id
        );

        //    let j = generalList.value.findIndex(
        //   (data) => data.item_id === row.item_id
        // );

        // if (j !== -1) {
        //   generalList.value.splice(i, 1);
        // }
        context.emit('onUpdate', generalList.value);
      } catch (error) {
        console.log('mark:04AD35E5A5CF', error);
      }
    };

    const passData = (evt, row) => {
      try {
        if (props.selected) {
          const rowData = {
            item_id: row.item_id,
            item_descripcion: row.item_descripcion,
          };
          //console.log(row);
          let j = rowsTemp.value.findIndex(
            (data) => data.item_id === rowData.item_id
          );
          if (j === -1) {
            const allData = { ...props.selected, ...rowData };
            rowsTemp.value.push(allData);
            generalList.value.push(allData);
            // console.log('general', generalList.value);
            rowsTemp.value.sort(function (a, b) {
              if (a.item_descripcion > b.item_descripcion) {
                return 1;
              }
              if (a.item_descripcion < b.item_descripcion) {
                return -1;
              }
              // a must be equal to b
              return 0;
            });
            // console.log('rowsdb', rowsDb.value);
            // let i = rowsDb.value.findIndex(
            //   (data) => data.item_id === rowData.item_id
            // );

            // if (i !== -1) {
            //   rowsDb.value.splice(i, 1);
            // }
          }
          context.emit('onUpdate', generalList.value);
        }
      } catch (error) {
        console.log('mark:04AD35E5A5CF', error);
      }
    };

    onMounted(async () => {
      //  const params = {
      //       store: '15',
      //       dateInv: moment().format('YYYY-MM-DD' + '%20' + 'HH:mm:00'),
      //       select: '*',
      //     };
      // generarLista(params, props.show);
    });

    watch(
      () => props.selected,
      (newValue, oldValue) => {
        rowsTemp.value = generalList.value.filter(
          (x) => x.idSubZone === props.selected.idSubZone
        );
      }
    );

    return {
      columnsDb,
      rowsDb,
      tipo,
      options,
      rowsTemp,
      columnsTemp,
      loading2,
      filterTemp,
      pagination: ref({
        rowsPerPage: 0,
      }),
      visibleColumns: ref(['insumo']),
      loading,
      filter,
      rowCount,
      filterType,
      passData,
      restoreData,
      generarLista,
      generarTempLista,
      generarImportLista,
      loadingList,
      clearList,
      subirExcel,
      uploadProgress,
      uploading,
      cancelFile,
      updateFiles,
      upload,
      files,
      isUploading: computed(() => uploading.value !== null),
      canUpload: computed(() => files.value !== null),
    };
  },
};
</script>

<style lang="scss">
.my-sticky-header-table {
  /* height or max-height is important */
  height: 70vh;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #811715;
    color: aliceblue;
    justify-content: center;
    flex-wrap: nowrap;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
    background-color: #157f81;
    /* this is when the loading indicator appears */
  }
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
}
.q-table--dense .q-table__top {
  padding: 0.2rem 0.5rem;
}
.header-background {
  background-color: #157f81;
}
.section {
  overflow-y: auto;
  direction: ltr;
  scrollbar-color: #d4aa70 #e4e4e4;
  scrollbar-width: thin;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}

::-webkit-scrollbar-thumb {
  border-radius: 100px;
  border: 6px solid rgba(208, 147, 61, 0.18);
  border-left: 0;
  border-right: 0;
  background-color: #d0933d;
}
.container {
  height: 100%;
}
</style>
