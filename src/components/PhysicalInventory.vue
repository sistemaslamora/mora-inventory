<template>
  <div class="q-pa-md q-gutter-sm">

    <q-dialog
      v-if="show"
      v-model="prompt"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >

      <div>
        <q-layout
          view="hHh Lpr lff"
          container
          class="shadow-2 rounded-borders"
        >
          <q-header
            elevated
            class="bg-primary"
          >
            <q-toolbar>
              <q-btn
                flat
                @click="invDrawerOpen = !invDrawerOpen"
                round
                dense
                icon="menu"
              />
              <q-toolbar-title>{{ store }}</q-toolbar-title>
              <q-btn
                flat
                dense
                size="sm"
                no-caps
                stack
                label="Verificar"
                icon="fas fa-boxes"
                class="q-mr-xs q-pr-md"
                @click="verify"
              />
              <q-btn
                flat
                dense
                size="sm"
                no-caps
                stack
                label="Exit"
                icon="fas fa-door-open"
                class="q-mr-xs"
                @click="onCancel"
              />
            </q-toolbar>
          </q-header>

          <q-drawer
            v-model="invDrawerOpen"
            show-if-above
            :width="200"
            :breakpoint="700"
            elevated
            class="bg-grey-3 text-black"
          >
            <q-scroll-area class="fit">
              <div class="q-pa-md">
                <q-tree
                  :nodes="simple"
                  accordion
                  node-key="idSubZone"
                  selected-color="primary"
                  v-model:selected="selected"
                  @update:selected="updateSelected"
                  default-expand-all
                />
              </div>
            </q-scroll-area>
          </q-drawer>

          <q-page-container>
            <q-page
              class="bg-white"
              padding
            >
              <div class="flex justify-between">
                <div>
                  <q-breadcrumbs
                    v-if="breadcumData"
                    class="q-px-md text-orange"
                  >
                    <q-breadcrumbs-el
                      :label="breadcumData.Zone"
                      icon="fa-solid fa-map-location-dot"
                    />
                    <q-breadcrumbs-el
                      :label="breadcumData.SubZone"
                      icon="fa-solid fa-location-dot"
                    />

                  </q-breadcrumbs>
                </div>
                <div>
                  <q-btn
                    size="xs"
                    push
                    :color="playSimulate?'primary' : 'white'"
                    :text-color="playSimulate?'white' : 'primary'"
                    icon="fas fa-play"
                    class="q-mr-xs q-pr-md"
                    @click="simulate"
                  />
                  <q-btn
                    size="xs"
                    push
                    :color="playSimulate?'white' : 'primary'"
                    :text-color="playSimulate?'primary' : 'white'"
                    icon="fas fa-pause"
                    class="q-mr-xs q-pr-md"
                    @click="closeSimulate"
                  />
                </div>
              </div>
              <div style="width: 100%">
                <q-table
                  class="my-sticky-header-table"
                  title="Zone"
                  dense
                  :rows="rowsTemp"
                  :columns="columnsTemp"
                  separator="cell"
                  row-key="name"
                  :filter="filterTemp"
                  virtual-scroll
                  v-model:pagination="pagination"
                  :rows-per-page-options="[0]"
                  no-data-label="No hay información"
                >

                  <template v-slot:top>
                    <!-- <q-btn color="primary" :disable="loading" label="Add row" @click="addRow" />
                    <q-btn class="q-ml-sm" color="primary" :disable="loading" label="Remove row" @click="removeRow" />-->

                    <div class="row justify-end">
                      <div>
                        <q-input
                          dark
                          dense
                          standout
                          v-model="filterTemp"
                          style="width: 360px"
                          class="q-ml-sm "
                        >
                          <template v-slot:append>
                            <q-icon
                              v-if="filterTemp === ''"
                              name="search"
                            />
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
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        key="description"
                        :props="props"
                      >
                        {{ props.row.item_descripcion }}
                      </q-td>
                      <q-td
                        key="unidad"
                        :props="props"
                      >
                        {{ props.row.item_unidad }}
                      </q-td>
                      <q-td
                        key="qty"
                        :props="props"
                      >
                        {{ props.row.item_qty }}
                        <q-popup-edit
                          v-model.number="props.row.item_qty"
                          auto-save
                          @update:model-value="(val)=>addValueDb(val,props.row) "
                          v-slot="scope"
                        >
                          <q-input
                            type="number"
                            v-model.number="scope.value"
                            dense
                            autofocus
                            @keyup.enter="scope.set"
                          ></q-input>
                        </q-popup-edit>
                      </q-td>
                      <!-- 
                      <q-td
                        key="fat"
                        :props="props"
                      >
                        {{ props.row.fat }}
                        <q-popup-edit
                          disable
                          v-model="props.row.fat"
                          auto-save
                          v-slot="scope"
                        >
                          <div class="text-italic text-primary q-mb-xs">
                            My Custom Title
                          </div>

                          <q-input
                            type="number"
                            v-model.number="scope.value"
                            dense
                            autofocus
                            @keyup.enter="scope.set"
                          ></q-input>
                        </q-popup-edit>
                      </q-td> -->
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </q-page>
          </q-page-container>
        </q-layout>
      </div>

      <q-btn
        flat
        label="Cancel"
        @click="onCancel"
        v-close-popup
      />
      <q-btn
        flat
        label="Createee"
        @click="onCreate"
        v-close-popup
      />
    </q-dialog>
  </div>
</template>

<script  lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Verify from '../common/service/verify';
import { useQuasar, uid, date } from 'quasar';
import { useRouter } from 'vue-router';
import moment from 'moment';
import 'moment/locale/es';
import rules from 'quasar-app-extension-vuelidate-rules';
import useSupabase from '../boot/supabase';

const columnsTemp = [
  {
    name: 'description',
    label: 'Descripción',
    align: 'left',
    field: (row) => row.item_descripcion,
    format: (val) => `${val}`,
    sortable: true,
    headerStyle: 'width: 65%',
  },
  {
    name: 'unidad',
    required: true,
    label: 'Unidad',
    align: 'left',
    field: (row) => row.item_unidad,
    format: (val) => `${val}`,
    sortable: true,
    style: 'width: 25%',
  },
  {
    name: 'qty',
    required: true,
    label: 'Conteo',
    align: 'right',
    field: (row) => row.item_qty,
    format: (val) => `${val}`,
    sortable: true,
    headerStyle: 'width: 10%',
  },
];

export default {
  emits: ['onAccept', 'onClose'],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    templateId: {
      type: String,
      required: false,
    },
    store: {
      type: String,
      required: false,
    },
    storeId: {
      type: String,
      required: false,
    },
    handleInventory: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  setup(props, context: any) {
    const $q = useQuasar();
    const tipo = ref(null);
    const router = useRouter();
    const { supabase } = useSupabase();
    const optTemplate = ref([]);
    const invDrawerOpen = ref(false);
    const dualList = ref(null);
    const simple = ref([]);
    const selected = ref('');
    const listItems = ref([]);
    const treeData = ref(null);
    const breadcumData = ref(null);
    const mainRestList = ref([]);
    const compareRestList = ref([]);
    const response = ref(false);
    const generalList = ref([]);
    const rowsTemp = ref([]);
    const filterTemp = ref('');
    const jsonStorage = ref([]);
    const playSimulate = ref(false);
    const idTemplate = ref('');
    let message = '';
    let autoUpdate = null;
    const modelDescription = ref('');

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

    const addChildren = (subzone, zoneId) => {
      let arr = [];
      subzone.forEach((y) => {
        if (y.plz_id === zoneId) {
          arr.push({
            label: y.description,
            idZone: y.plz_id,
            idSubZone: y.pls_id,
            icon: 'fa-solid fa-location-dot',
            type: 'child',
            selectable: true,
          });
        }
      });

      return arr;
    };

    const addChildrenEdit = (subzone, zoneId) => {
      let arr = [];
      subzone.forEach((y) => {
        if (y.pis_piz_id === zoneId) {
          arr.push({
            label: y.description,
            idZone: y.pis_piz_id,
            idSubZone: y.pis_id,
            icon: 'fa-solid fa-location-dot',
            type: 'child',
            selectable: true,
          });
        }
      });

      return arr;
    };

    watch(
      () => treeData.value,
      (newValue, oldValue) => {
        rowsTemp.value = generalList.value.filter(
          (x) => x.idSubZone === treeData.value.idSubZone
        );
      }
    );

    const updateSelected = (target) => {
      if (target) {
        simple.value.forEach((e) => {
          const toSelected = e.children.find((x) => x.idSubZone === target);
          if (toSelected) {
            treeData.value = {
              idTemplate: props.templateId,
              idZone: toSelected.idZone,
              idSubZone: toSelected.idSubZone,
            };
            breadcumData.value = {
              Zone: e.label,
              SubZone: toSelected.label,
            };
          }
        });
      }
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
                options.value[i].dbVal
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
            response.value = true;
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

    const CompareList = async () => {
      try {
        console.log('storeid', props.storeId);
        const params = {
          store: parseInt(props.storeId),
          dateInv: moment().format('YYYY-MM-DD' + '%20' + 'HH:mm:00'),
          select: '*',
        };

        if (compareRestList.value.length === 0) {
          for (let i = 0; i < options.value.length; i++) {
            const restResultItem = await Verify.getRestaurantItems(
              params,
              options.value[i].dbVal
            );
            if (restResultItem.success === 1) {
              const restModel = restResultItem.originalResponse.body.data;
              //   console.log('rstmodel' + i, restModel);
              if (restModel.length > 0 && restModel) {
                restModel.forEach((x) => {
                  compareRestList.value.push(x);
                });
              }
            }
          }
          response.value = true;
        }
      } catch (error) {
        console.log('mark:EDDA40AD3C64', error);
      }
    };

    const addValueDb = async (row, value) => {
      try {
        const { data, error } = await supabase
          .from('bizphysicalinventoryitems')
          .update({ qty: value.item_qty })
          .eq('item', value.item_id)
          .eq('pis_piz_pi_id', value.idTemplate)
          .eq('pis_piz_id', value.idZone)
          .eq('pis_id', value.idSubZone);
      } catch (error) {
        console.log(error);
      }
    };

    const generarTempListaEdit = async (tId, show) => {
      try {
        let tempItems = [];
        if (show === 2) {
          rowsTemp.value = [];

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
                if (
                  tempItems[i].item === parseInt(x.item_id) &&
                  tempItems[i].status === 0
                ) {
                  // console.log(
                  //   'items',
                  //   'tempItems[' +
                  //     i +
                  //     '].item = ' +
                  //     tempItems[i].item +
                  //     ' === ' +
                  //     'parseInt(x.item_id) = ' +
                  //     parseInt(x.item_id)
                  // );
                  generalList.value.push({
                    idTemplate: tempItems[i].pis_piz_pi_id,
                    idZone: tempItems[i].pis_piz_id,
                    idSubZone: tempItems[i].pis_id,
                    item_id: x.item_id,
                    item_descripcion: x.item_descripcion,
                    item_unidad: x.unidadmedidainsumo_descripcion,
                    item_qty: tempItems[i].qty ? tempItems[i].qty : null,
                  });
                }
              }
            });

            rowsTemp.value = generalList.value.filter(
              (x) => x.idSubZone === treeData.value.idSubZone
            );

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

    const generarTempLista = async (params, show) => {
      try {
        let tempItems = [];
        if (show === 2) {
          rowsTemp.value = [];
          const filter = {
            pls_plz_pli_id: `eq.${params}`,
            select: '*',
          };
          //NOTE - hay que enviar el tipo de articulos(insumo = 1, producto = 2, recetas = 3, descartable= 6)
          //   console.log('main2', mainRestList.value);
          const templateResultItem = await Verify.getItemsTemplate(filter);
          if (templateResultItem.success === 1) {
            tempItems = templateResultItem.originalResponse.body;
            //   console.log('temps', tempItems);
          } else {
          }
          mainRestList.value.map((x: any) => {
            let index = -1;
            for (let i = 0, len = tempItems.length; i < len; i++) {
              if (tempItems[i].item === parseInt(x.item_id)) {
                // console.log(
                //   'items',
                //   'tempItems[' +
                //     i +
                //     '].item = ' +
                //     tempItems[i].item +
                //     ' === ' +
                //     'parseInt(x.item_id) = ' +
                //     parseInt(x.item_id)
                // );
                generalList.value.push({
                  idTemplate: tempItems[i].pls_plz_pli_id,
                  idZone: tempItems[i].pls_plz_id,
                  idSubZone: tempItems[i].pls_id,
                  item_id: x.item_id,
                  item_descripcion: x.item_descripcion,
                  item_unidad: x.unidadmedidainsumo_descripcion,
                  item_qty: null,
                });
              }
            }
          });

          // rowsTemp.value = generalList.value.filter(
          //   (x) => x.idSubZone === treeData.value.idSubZone
          // );

          // context.emit('onUpdate', generalList.value);
        }
      } catch (error) {
        console.log('mark:EDDA40AD3C64', error);
      }
    };

    const verifyDescription = (): boolean => {
      if (!modelDescription.value || modelDescription.value === '') {
        message = 'Debe arregar una descripcion a la plantilla';
        return false;
      } else {
        return true;
      }
    };

    const verifyTreeData = (): boolean => {
      if (simple.value.length === 0) {
        message = 'Faltan datos en las zonas y subzonas';
        return false;
      } else {
        return true;
      }
    };

    const verifyItems = (): boolean => {
      if (generalList.value.length === 0) {
        message = 'Debe arregar al menos un elemento a la plantilla';
        return false;
      } else {
        return true;
      }
    };

    const isUpdate = async (id): Promise<boolean> => {
      let finded = await supabase
        .from('bizTemplateZone')
        .select('PLI_Id')
        .eq('PLI_Id', id);
      if (finded.data.length > 0) {
        const { data, error } = await supabase
          .from('bizTemplateZone')
          .delete()
          .eq('PLI_Id', id);
        if (error) {
          console.log(error);
          $q.notify({
            position: 'top',
            multiLine: true,
            type: 'negative',
            message: `No se han actualizado los datos ${error}`,
          });
          return false;
        } else {
          return true;
        }
      } else return true;
    };

    const createTemplate = async (id) => {
      try {
        const timeStamp = Date.now();
        const formattedString = date.formatDate(
          timeStamp,
          'YYYY-MM-DDTHH:mm:ss.SSSZ'
        );
        const params = {
          id: id,
          description: modelDescription.value,
          store: props.store,
          store_id: props.storeId,
          comment: '',
          created_at: formattedString,
          update_at: formattedString,
        };
        const { error } = await supabase
          .from('bizphysicalinventory')
          .insert([params]);
        if (error) {
          console.log(error);
        }
      } catch (error) {
        console.log('mark:E2D87765FE56', error);
      }
    };

    const createZone = async (id) => {
      try {
        const data = simple.value.map((x) => {
          return {
            pi_id: id,
            piz_id: x.idZone,
            description: x.label,
          };
        });

        //  const template = await Verify.createInventoryTemplate(params);
        const { error } = await supabase
          .from('bizphysicalinventoryzone')
          .insert(data);
        if (error) {
          console.log(error);
        }
      } catch (error) {
        console.log('mark:E2D87765FE56', error);
      }
    };

    const createSubZone = async (id) => {
      try {
        let data = [];
        simple.value.forEach((element) => {
          element.children.map((x) => {
            data.push({
              pis_piz_pi_id: id,
              pis_piz_id: x.idZone,
              pis_id: x.idSubZone,
              description: x.label,
            });
          });
        });
        //  const template = await Verify.createInventoryTemplate(params);
        const { error } = await supabase
          .from('bizphysicalinventorysubzone')
          .insert(data);
        if (error) {
          console.log(error);
        }
      } catch (error) {
        console.log('mark:E2D87765FE56', error);
      }
    };

    const createItems = async (id) => {
      try {
        let data = [];

        generalList.value.forEach((element) => {
          data.push({
            pis_piz_pi_id: id,
            pis_piz_id: element.idZone,
            pis_id: element.idSubZone,
            item: parseInt(element.item_id),
          });
        });
        //  const template = await Verify.createInventoryTemplate(params);

        const { error } = await supabase
          .from('bizphysicalinventoryitems')
          .insert(data);
        if (error) {
          console.log(error);
        }
      } catch (error) {
        console.log('mark:E2D87765FE56', error);
      }
    };

    const showNotif = (msg) => {
      $q.notify({
        position: 'top',
        type: 'negative',
        message: msg,
      });
    };

    const saveAll = async (tId) => {
      try {
        if (verifyDescription() && verifyTreeData() && verifyItems()) {
          await createTemplate(tId);
          await createZone(tId);
          await createSubZone(tId);
          await createItems(tId);
          // $q.notify({
          //   position: 'top',
          //   type: 'positive',
          //   message: `Se ha creado la plantila ${modelDescription.value}`,
          // });
          // router.push('/managerinventorytemplate');
        } else {
          showNotif(message);
          message = '';
        }
      } catch (error) {
        console.log('mark:ADB5994C7B4B', error);
      }
    };

    const addDataToPhysicalInventory = async () => {
      try {
        $q.loading.show();
        let zone = await supabase
          .from('bizTemplateZone')
          .select()
          .eq('PLI_Id', props.templateId);

        let subzone = await supabase
          .from('biztemplatesubzone')
          .select()
          .eq('plz_pli_id', props.templateId);

        let zoneSort = zone.data.sort(function (a, b) {
          if (a.Description > b.Description) {
            return 1;
          }
          if (a.Description < b.Description) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        let subzoneSort = subzone.data.sort(function (a, b) {
          if (a.Description > b.Description) {
            return 1;
          }
          if (a.Description < b.Description) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        simple.value = [];

        zoneSort.forEach((element) => {
          simple.value.push({
            label: element.Description,
            idZone: element.PLZ_Id,
            type: 'father',
            icon: 'fa-solid fa-map-location-dot',
            selectable: false,
            children: addChildren(subzoneSort, element.PLZ_Id),
          });
        });
        const t = simple.value[0];
        selected.value = t.children[0].idSubZone;
        updateSelected(selected.value);
        await generarTempLista(props.templateId, 2);
        const tId = uid();
        idTemplate.value = tId;
        await saveAll(tId);
        generalList.value = [];
        rowsTemp.value = [];
        simple.value = [];
        await editDataToPhysicalInventory(tId);
        $q.loading.hide();
      } catch (error) {}
    };

    const editDataToPhysicalInventory = async (tId) => {
      try {
        let zone = await supabase
          .from('bizphysicalinventoryzone')
          .select()
          .eq('pi_id', tId);

        let subzone = await supabase
          .from('bizphysicalinventorysubzone')
          .select()
          .eq('pis_piz_pi_id', tId);

        let zoneSort = zone.data.sort(function (a, b) {
          if (a.Description > b.Description) {
            return 1;
          }
          if (a.Description < b.Description) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        let subzoneSort = subzone.data.sort(function (a, b) {
          if (a.Description > b.Description) {
            return 1;
          }
          if (a.Description < b.Description) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        simple.value = [];

        zoneSort.forEach((element) => {
          simple.value.push({
            label: element.description,
            idZone: element.piz_id,
            type: 'father',
            icon: 'fa-solid fa-map-location-dot',
            selectable: false,
            children: addChildrenEdit(subzoneSort, element.piz_id),
          });
        });
        const t = simple.value[0];
        selected.value = t.children[0].idSubZone;
        updateSelected(selected.value);
        await generarTempListaEdit(tId, 2);
      } catch (error) {}
    };

    const closeSimulate = () => {
      playSimulate.value = false;
      clearInterval(autoUpdate);
    };

    const simulate = async () => {
      playSimulate.value = true;
      autoUpdate = setInterval(async () => {
        if (props.handleInventory === 'new') {
          generalList.value = [];
          await generarTempLista(props.templateId, 2);
        } else if (props.handleInventory === 'edit') {
          generalList.value = [];
          await generarTempListaEdit(props.templateId, 2);
        } else {
          //
        }
      }, 20000);
    };

    const evaluate = async (value, val) => {
      try {
        const { data, error } = await supabase
          .from('bizphysicalinventoryitems')
          .update({ status: val })
          .eq('item', value.item)
          .eq('pis_piz_pi_id', value.pis_piz_pi_id)
          .eq('pis_piz_id', value.pis_piz_id)
          .eq('pis_id', value.pis_id);
      } catch (error) {
        console.log(error);
      }
    };

    const verify = async () => {
      try {
        compareRestList.value = [];
        $q.loading.show();
        await CompareList();
        $q.loading.hide();
        try {
          let tempItems = [];

          rowsTemp.value = [];
          generalList.value = [];
          let result = await supabase
            .from('bizphysicalinventoryitems')
            .select()
            .eq('pis_piz_pi_id', idTemplate.value);
          if (result.status === 200) {
            tempItems = result.data;
            console.log('comp', compareRestList.value);
            compareRestList.value.map((x: any) => {
              let index = -1;
              for (let i = 0, len = tempItems.length; i < len; i++) {
                if (tempItems[i].item === parseInt(x.item_id)) {
                  if (tempItems[i].qty === x.cantidad) {
                    evaluate(tempItems[i], 1);
                  } else {
                    if (tempItems[i].status === 1) {
                      evaluate(tempItems[i], 0);
                    }
                    generalList.value.push({
                      idTemplate: tempItems[i].pis_piz_pi_id,
                      idZone: tempItems[i].pis_piz_id,
                      idSubZone: tempItems[i].pis_id,
                      item_id: x.item_id,
                      item_descripcion: x.item_descripcion,
                      item_unidad: x.unidadmedidainsumo_descripcion,
                      item_qty: tempItems[i].qty ? tempItems[i].qty : null,
                    });
                  }
                }
              }
            });

            rowsTemp.value = generalList.value.filter(
              (x) => x.idSubZone === treeData.value.idSubZone
            );

            // context.emit('onUpdate', generalList.value);
          } else {
            console.log(
              result.error ? result.error : 'response' + result.statusText
            );
          }
        } catch (error) {
          console.log('mark:EDDA40AD3C64', error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(async () => {
      try {
        // dualList.value.loadingList(true, props.show);
        idTemplate.value = props.templateId;
        modelDescription.value = props.description;
        jsonStorage.value = $q.localStorage.getItem('mainList');
        if (!jsonStorage.value) {
          $q.loading.show();
          await generarLista('1');
          $q.loading.hide();
        } else {
          jsonStorage.value.forEach((element) => {
            mainRestList.value.push(element);
          });
          // console.log(mainRestList.value);
        }

        if (props.handleInventory === 'new') {
          addDataToPhysicalInventory();
        } else if (props.handleInventory === 'edit') {
          editDataToPhysicalInventory(props.templateId);
        } else {
          router.push('/managerinventorytemplate');
        }
        //console.log('respose', response.value);
      } catch (error) {
        console.log('mark:4B67FB683345', error);
      }
      // simulate();
    });

    onBeforeUnmount(() => {
      onCancel();
      clearInterval(autoUpdate);
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
        const data = { store: tipo.value.label, template: selected.value };
        context.emit('onAccept', data);
      } catch (error) {
        console.log(error);
      }
    };

    return {
      prompt: ref(true),
      tipo,
      selected,
      optTemplate,
      invDrawerOpen,
      dualList,
      simple,
      listItems,
      treeData,
      breadcumData,
      generalList,
      columnsTemp,
      rowsTemp,
      filterTemp,
      playSimulate,
      pagination: ref({
        rowsPerPage: 0,
      }),
      onCancel,
      onCreate,
      updateSelected,
      addValueDb,
      simulate,
      closeSimulate,
      verify,
    };
  },
};
</script>

<style lang="scss">
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

.my-sticky-header-table {
  /* height or max-height is important */
  height: 80vh;
  margin-top: 1rem;
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #811715;
    color: aliceblue;
    justify-content: flex-end;
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
