<template>
  <div class="q-pa-sm">
    <div>
      <q-toolbar
        class="bg-primary q-mb-md text-white"
        style="padding-top: 0.5rem"
      >
        <q-btn
          stack
          flat
          size="12px"
          no-caps
          class="q-mx-sm"
          label="Guardar"
          @click="saveAll()"
          icon="fa-regular fa-floppy-disk"
          style="line-height: 1.5rem"
        >
        </q-btn>

        <q-btn
          flat
          stack
          size="12px"
          no-caps
          label="Eliminar"
          icon="fa-regular fa-trash-can"
          style="line-height: 1.5rem"
        >
        </q-btn>

        <q-separator vertical color="warning" inset />

        <q-btn
          stack
          flat
          size="12px"
          no-caps
          @click="showZone()"
          @ok="checkData()"
          label="Editar Zonas"
          icon="fa-solid fa-map-location-dot"
          style="line-height: 1.5rem"
        >
        </q-btn>

        <q-separator vertical inset color="warning" />

        <q-btn
          stack
          flat
          size="12px"
          no-caps
          class="q-mx-sm"
          label="Importar"
          @click="showImport = true"
          icon="fa-solid fa-file-import"
          style="line-height: 1.5rem"
        >
        </q-btn>
        <q-btn
          stack
          flat
          size="12px"
          no-caps
          label="Exportar"
          @click="exportData()"
          icon="fa-solid fa-file-export"
          style="line-height: 1.5rem"
          :disable="templateId ? false : true"
        >
        </q-btn>
        <q-separator vertical inset color="warning" />

        <q-btn
          stack
          flat
          size="12px"
          no-caps
          label="Atras"
          @click="toBack"
          icon="fa-regular fa-hand-point-left"
          style="line-height: 1.5rem"
        >
        </q-btn>
      </q-toolbar>
    </div>

    <div>
      <div>
        <q-splitter v-model="splitterModel">
          <template v-slot:before>
            <div>
              <q-input
                bottom-slots
                v-model="modelDescription"
                label="Descripcion"
                rounded
              >
                <template v-slot:prepend>
                  <q-icon name="place" />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="modelDescription = ''"
                    class="cursor-pointer"
                  />
                </template>
                <template v-slot:hint> Obligatorio </template>
              </q-input>
            </div>
            <div class="q-pa-md">
              <q-tree
                :nodes="simple"
                accordion
                node-key="idSubZone"
                label-key="label"
                selected-color="primary"
                v-model:selected="selected"
                @update:selected="updateSelected"
              />
            </div>
          </template>

          <template v-slot:after>
            <q-breadcrumbs v-if="breadcumData" class="q-px-md text-orange">
              <q-breadcrumbs-el
                :label="breadcumData.Zone"
                icon="fa-solid fa-map-location-dot"
              />
              <q-breadcrumbs-el
                :label="breadcumData.SubZone"
                icon="fa-solid fa-location-dot"
              />
            </q-breadcrumbs>
            <div class="q-pa-sm container">
              <DualListBoxComponent
                ref="dualList"
                v-model="listItems"
                :selected="treeData"
                :show="visible"
                @onUpdate="onUpdateItems"
              />
            </div>
          </template>
        </q-splitter>
      </div>
    </div>
  </div>
  <ImportDataModel v-if="showImport" @import="onImportData" />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  watch,
  watchEffect,
} from 'vue';
import Verify from '../common/service/verify';
import { useQuasar, useDialogPluginComponent, uid } from 'quasar';
import { useRouter } from 'vue-router';
import CreateZoneModal from '../components/CreateZoneModal.vue';
import DualListBoxComponent from '../components/DualListBoxComponent.vue';
import ImportDataModel from '../components/ImportDataModel.vue';
import useSupabase from '../boot/supabase';
import moment from 'moment';

export default defineComponent({
  name: 'NewInventoryTemplate',
  props: {
    show: {
      type: String,
      required: false,
    },
    templateId: {
      type: String,
      required: false,
    },
    templateName: {
      type: String,
      required: false,
    },
  },
  emits: [...useDialogPluginComponent.emits],

  components: {
    DualListBoxComponent,
    ImportDataModel,
  },
  setup(props) {
    const $q = useQuasar();
    const router = useRouter();
    const visible = ref('');
    const dualList = ref(null);
    const simple = ref([]);
    const selected = ref('');
    const listItems = ref([]);
    const treeData = ref(null);
    const breadcumData = ref(null);
    const expanded = ref(true);
    const showImport = ref(false);
    const response = ref(false);
    const mainRestList = ref([]);
    let subzone = [];
    let message = '';
    let templateId = 0;
    const modelDescription = ref('');
    const { supabase } = useSupabase();
    const first = ref([]);

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

    const toBack = () => {
      try {
        $q.dialog({
          title: 'Confirmar',
          message:
            'Esta seguro que desea salir, es posible que no haya guardado',
          cancel: true,
          persistent: true,
        })
          .onOk(() => {
            // console.log('>>>> OK')
            router.go(-1);
          })
          .onOk(() => {
            // console.log('>>>> second OK catcher')
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      } catch (error) {
        console.log('mark:EF7259BC17FC', error);
      }
    };

    const deleteZoneItems = (arr) => {
      for (let i = 0; i < listItems.value.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (listItems.value[i].idZone === arr[j].idZone) {
            //  console.log(i);
            listItems.value.splice(i, 1);
            i = 0;
          }
        }
      }
    };

    const deleteSubZoneItems = (arr) => {
      //    console.log('list', listItems.value);
      for (let i = 0; i < listItems.value.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (listItems.value[i].idSubZone === arr[j].idSubZone) {
            // console.log(i);
            listItems.value.splice(i, 1);
            i = 0;
          }
        }
      }

      //console.log('list', listItems.value);
    };

    const showZone = () => {
      try {
        $q.dialog({
          component: CreateZoneModal,

          // props forwarded to your custom component
          componentProps: {
            simple: simple.value,
          },
        })
          .onOk((data) => {
            if (data.deletedZone.length > 0) {
              deleteZoneItems(data.deletedZone);
            }
            if (data.deletedSubZone.length > 0) {
              deleteSubZoneItems(data.deletedSubZone);
            }
            checkData(data.modelZones);
          })
          .onCancel(() => {
            console.log('Cancel');
          });
      } catch (error) {
        console.log('mark:162AD26EBCEE', error);
      }
    };

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

    const onImportData = async (json) => {
      showImport.value = false;

      if (json.length > 0) {
        simple.value = json[0].simple;
        const arr = json[0].list.map((x) => {
          return {
            idTemplate: undefined,
            idZone: x.idZone,
            idSubZone: x.idSubZone,
            item_id: x.item_id,
            item_descripcion: x.item_descripcion,
          };
        });
        // console.log('arr', arr);

        const t = simple.value[0];
        selected.value = t.children[0].idSubZone;
        updateSelected(selected.value);
        await dualList.value?.generarImportLista(
          arr,
          t.children[0].idSubZone,
          '2'
        );
      } else {
      }
    };

    const exportData = () => {
      const arr = [{ simple: simple.value, list: listItems.value }];

      const data = JSON.stringify(arr);
      const blob = new Blob([data], { type: 'text/plain' });
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = 'test.json';
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    };
    //  watchEffect(async () => {});
    // watch(
    //   () => response,
    //   async (newValue, oldValue) => {

    //   }
    // );

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
            return listValue;
          }
        } else {
          return listValue;
        }
      } catch (error) {
        console.log('mark:EDDA40AD3C64', error);
      }
    };

    onMounted(async () => {
      try {
        dualList.value.loadingList(true, props.show);
        await generarLista('1');
        await dualList.value?.generarLista(mainRestList.value);
        if (props.show === '0') {
          simple.value = [];
          visible.value = '0';
        } else if (props.show === '1') {
          modelDescription.value = props.templateName;
          visible.value = '1';

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
          await dualList.value?.generarTempLista(props.templateId, '2');
        } else {
          router.push('/managerinventorytemplate');
        }
        //  console.log('respose', response.value);
      } catch (error) {
        console.log('mark:4B67FB683345', error);
      }
    });

    //NOTE - TENGO QUE USAR ESETA FUNCION DE UPDATE SELECT PARA CARGAR TODOS LOS ITEMS A LA LISTA
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

    const onLazyLoad = ({ node, key, done, fail }) => {
      if (node.length < 1) {
        done([]);
        return;
      }
      done = simple.value;
      // console.log(done, 'done');
    };

    const checkData = async (data: any[]) => {
      try {
        if (data) {
          visible.value = '1';
          // const params = {
          //   store: '6',
          //   dateInv: moment().format('YYYY-MM-DD' + '%20' + 'HH:mm:00'),
          //   select: '*',
          // };
          // await dualList.value?.generarLista(params, '1');
          simple.value = [];
          data.forEach((element) => {
            simple.value.push({
              label: element.name,
              idZone: element.idZone,
              type: 'father',
              icon: 'fa-solid fa-map-location-dot',
              selectable: false,

              children: element.subZone?.map((y) => {
                return {
                  label: y.nameSubZone,
                  idZone: element.idZone,
                  idSubZone: y.idSubZone,
                  icon: 'fa-solid fa-location-dot',
                  type: 'child',
                  selectable: true,
                };
              }),
            });
          });

          // simple.value = [
          //   {
          //     label: 'Zonas',
          //     children: children,
          //   },
          // ];
        }
      } catch (error) {
        console.log('mark:162AD26EBCEE', error);
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
      if (listItems.value.length === 0) {
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

    const createTemplate = async (): Promise<string> => {
      try {
        const uuidTemplate = uid();
        const params = {
          Id: uuidTemplate,
          Description: modelDescription.value,
          Comment: '',
          ReadOnly: false,
          System: false,
        };

        const template = await Verify.createInventoryTemplate(params);
        //const { data, error } = await supabase.rpc('get_last_id_template');
        return uuidTemplate;
      } catch (error) {
        console.log('mark:E2D87765FE56', error);
      }
    };

    const createZone = async (id) => {
      try {
        const data = simple.value.map((x) => {
          return {
            PLI_Id: id,
            PLZ_Id: x.idZone,
            Description: x.label,
          };
        });

        //  const template = await Verify.createInventoryTemplate(params);
        const { error } = await supabase.from('bizTemplateZone').insert(data);
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
              plz_pli_id: id,
              plz_id: x.idZone,
              pls_id: x.idSubZone,
              description: x.label,
            });
          });
        });
        //  const template = await Verify.createInventoryTemplate(params);
        const { error } = await supabase
          .from('biztemplatesubzone')
          .insert(data);
        if (error) {
          console.log(error);
        }
      } catch (error) {
        console.log('mark:E2D87765FE56', error);
      }
    };

    // const isItemsTemplate = async (id): Promise<boolean> => {
    //   let finded = await supabase
    //     .from('biztemplateitem')
    //     .select('pls_plz_pli_id')
    //     .eq('pls_plz_pli_id', id);
    //   if (finded.data.length > 0) {
    //     const { data, error } = await supabase
    //       .from('biztemplateitem')
    //       .delete()
    //       .eq('pls_plz_pli_id', id);
    //     if (error) {
    //       console.log(error);
    //       $q.notify({
    //         position: 'top',
    //         multiLine: true,
    //         type: 'negative',
    //         message: `No se han actualizado los datos ${error}`,
    //       });
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   } else return true;
    // };

    const createItems = async (id) => {
      try {
        let data = [];
        listItems.value.forEach((element) => {
          data.push({
            pls_plz_pli_id: id,
            pls_plz_id: element.idZone,
            pls_id: element.idSubZone,
            item: parseInt(element.item_id),
          });
        });
        //  const template = await Verify.createInventoryTemplate(params);

        const { error } = await supabase.from('biztemplateitem').insert(data);
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

    const saveAll = async () => {
      try {
        if (verifyDescription() && verifyTreeData() && verifyItems()) {
          const tId = listItems.value[0].idTemplate
            ? listItems.value[0].idTemplate
            : await createTemplate();
          if (await isUpdate(tId)) {
            await createZone(tId);
            await createSubZone(tId);
            await createItems(tId);
            $q.notify({
              position: 'top',
              type: 'positive',
              message: `Se ha creado la plantila ${modelDescription.value}`,
            });
            router.push('/managerinventorytemplate');
          }
        } else {
          showNotif(message);
          message = '';
        }
      } catch (error) {
        console.log('mark:ADB5994C7B4B', error);
      }
    };

    const onUpdateItems = (data) => {
      listItems.value = data;
      //  console.log('listitems', data);
    };

    return {
      splitterModel: ref(25),
      modelDescription,
      listItems,
      expanded,
      showImport,
      treeData,
      selected,
      breadcumData,
      simple,
      visible,
      dualList,
      showZone,
      checkData,
      toBack,
      updateSelected,
      onUpdateItems,
      saveAll,
      exportData,
      onImportData,
      onLazyLoad,
    };
  },
});
</script>
<style lang="scss">
.continer {
  height: 50vh;
}

.description_container {
  width: 100%;
  height: 3rem;
  border: 2px solid #811715;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
}
</style>