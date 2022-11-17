<template>
  <!-- notice dialogRef here -->
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin card-principal">
      <div class="my-card q-ma-sm">
        <q-card class="zone">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">ZONAS</div>

          </q-card-section>

          <q-card-actions align="around">
            <q-btn
              icon="fa-regular fa-square-plus"
              flat
              style="line-height: 1.5rem;"
              @click="prompt"
            > Añadir</q-btn>
            <q-btn
              icon="fa-regular fa-square-minus"
              flat
              @click="deleteZone"
              style="line-height: 1.5rem;"
            >Eliminar</q-btn>
          </q-card-actions>
          <q-separator />
          <q-card-section>
            <q-scroll-area style="height: 200px">
              <div
                v-if="modelZones"
                class="q-pa-sm"
              >

                <q-list
                  bordered
                  separator
                >
                  <template
                    v-for="zone in modelZones"
                    :key="zone"
                  >
                    <q-item
                      clickable
                      v-ripple
                      :active="active === zone.idZone"
                      @click="selectZone(zone)"
                      active-class="bg-teal-1 text-grey-8"
                    >
                      <q-item-section avatar>
                        <q-icon
                          color="warning"
                          name="fa-solid fa-map-location-dot"
                        />
                      </q-item-section>
                      <q-item-section>{{zone.name}}</q-item-section>
                      <q-item-section avatar>

                        <q-icon
                          color="cyan-5"
                          size="18px"
                          name="fa-regular fa-pen-to-square"
                          @click="editZone(zone)"
                        />

                      </q-item-section>
                    </q-item>
                  </template>
                </q-list>

              </div>
            </q-scroll-area>
          </q-card-section>

        </q-card>

        <q-separator vertical />

        <q-card class="subzone">
          <q-card-section class="bg-primary text-white">
            <div class="row justify-between">
              <div class="text-h6">SUBZONAS</div>
              <div class="text-h8 self-end text-warning text-bold ">Zona: {{modelLabelZone}}</div>
            </div>
          </q-card-section>

          <q-card-actions align="around">
            <q-btn
              icon="fa-regular fa-square-plus"
              flat
              :disable="modelDisable"
              style="line-height: 1.5rem;"
              @click="promptSubZone"
            > Añadir</q-btn>
            <q-btn
              icon="fa-regular fa-square-minus"
              flat
              @click="deleteSubZone"
              style="line-height: 1.5rem;"
            >Eliminar</q-btn>
          </q-card-actions>

          <q-separator />

          <q-card-section>
            <q-scroll-area style="height: 200px">
              <div class="q-pa-sm">

                <q-list
                  bordered
                  separator
                >
                  <template
                    v-for="subZone in modelSubZones"
                    :key="subZone"
                  >
                    <q-item
                      clickable
                      v-ripple
                      :active="activeSubZone === subZone.idSubZone"
                      @click="selectSubZone(subZone)"
                      active-class="bg-teal-1 text-grey-8"
                    >
                      <q-item-section avatar>
                        <q-icon
                          color="warning"
                          name="fa-solid fa-location-dot"
                        />
                      </q-item-section>
                      <q-item-section>{{subZone.nameSubZone}}</q-item-section>
                      <q-item-section avatar>

                        <q-icon
                          color="cyan-5"
                          size="18px"
                          name="fa-regular fa-pen-to-square"
                          @click="editSubZone(subZone)"
                        />

                      </q-item-section>
                    </q-item>
                  </template>
                </q-list>

              </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="OK"
          @click="verificarSubZonas"
        />
        <q-btn
          color="primary"
          label="Cancel"
          @click="onCancelClick"
        />
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>

<script lang="ts">
import { capitalize, ref, onMounted, reactive } from 'vue';
import { useDialogPluginComponent, useQuasar, uid } from 'quasar';

export default {
  props: {
    simple: {
      type: Object,
      required: false,
    },
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup(props, { emit }) {
    const $q = useQuasar();
    const active = ref(0);
    const modelZones = ref([]);
    const modelLabelZone = ref('');
    const activeSubZone = ref(0);
    const modelSubZones = ref([]);
    const modelLabelSubZone = ref('');
    const modelDisable = ref(true);
    const deletedSubZone = ref([]);
    const deletedZone = ref([]);
    const fd = reactive({
      noti: () => {},
    });
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    const capitalizeFirstLetter = (str) => {
      try {
        // converting first letter to uppercase
        const capitalized = str.replace(/^./, str[0].toUpperCase());

        return capitalized;
      } catch (error) {
        console.log('mark : FW-FA5675C5CBD0', error);
      }
    };

    const prompt = () => {
      try {
        $q.dialog({
          title: 'Añadir Zonas',
          message: 'Añade el nombre de la zona',
          prompt: {
            model: '',
            isValid: (val) => val.length > 2, // << here is the magic
            type: 'text', // optional
          },
          cancel: true,
          persistent: true,
        }).onOk((data) => {
          addZone(capitalizeFirstLetter(data.toLowerCase())); // console.log('>>>> OK, received', data)
        });
      } catch (error) {
        console.log('mark : FW-8DD303A05CDF', error);
      }
    };

    const promptSubZone = () => {
      try {
        $q.dialog({
          title: 'Añadir Sub-Zonas',
          message: 'Añade el nombre de la sub-zona',
          prompt: {
            model: '',
            isValid: (val) => val.length > 2, // << here is the magic
            type: 'text', // optional
          },
          cancel: true,
          persistent: true,
        }).onOk((data) => {
          addSubZone(capitalizeFirstLetter(data.toLowerCase())); // console.log('>>>> OK, received', data)
        });
      } catch (error) {
        console.log('mark : FW-55E3164DC593', error);
      }
    };

    const selectZone = (data) => {
      try {
        modelDisable.value = false;
        active.value = data.idZone;
        modelLabelZone.value = data.name;
        let index = modelZones.value.findIndex((x) => x.idZone === data.idZone);
        modelSubZones.value = modelZones.value[index].subZone;
      } catch (error) {
        console.log('mark : FW-DF749FC08A5A', error);
      }
    };

    const selectSubZone = (data) => {
      try {
        activeSubZone.value = data.idSubZone;
        modelLabelSubZone.value = data.nameSubZone;
      } catch (error) {
        console.log('mark : FW-2C36D976C391', error);
      }
    };

    const addZone = (data) => {
      try {
        modelZones.value.push({ idZone: uid(), name: data, subZone: [] });
        modelZones.value.sort(function (a, b) {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        // modelZones.value.forEach((x, index) => {
        //   x.idZone = index + 1;
        // });
      } catch (error) {
        console.log('mark : FW-7A0CF65B8CBE', error);
      }
    };

    const addSubZone = (data) => {
      try {
        modelSubZones.value = [];
        modelZones.value.forEach((element, index) => {
          if (element.idZone === active.value) {
            modelZones.value[index].subZone.push({
              idZone: element.idZone,
              idSubZone: uid(),
              nameSubZone: data,
            });
            modelZones.value[index].subZone.sort(function (a, b) {
              if (a.nameSubZone > b.nameSubZone) {
                return 1;
              }
              if (a.nameSubZone < b.nameSubZone) {
                return -1;
              }
              // a must be equal to b
              return 0;
            });
            // modelZones.value[index].subZone.forEach((x, index) => {
            //   x.idSubZone = index + 1;
            // });
            modelSubZones.value = modelZones.value[index].subZone;
          }
        });
      } catch (error) {
        console.log('mark : FW-7A0CF65B8CBE', error);
      }
    };

    const editZone = (data) => {
      try {
        $q.dialog({
          title: `Editar Zona ${data.name}`,
          message: 'Cambia nombre de la zona',
          prompt: {
            model: data.name,
            isValid: (val) => val.length > 2, // << here is the magic
            type: 'text', // optional
          },
          cancel: true,
          persistent: true,
        }).onOk((data) => {
          let dato = modelZones.value.findIndex(
            (x) => x.idZone === active.value
          );
          modelZones.value[dato].name = capitalizeFirstLetter(
            data.toLowerCase()
          );

          modelZones.value.sort(function (a, b) {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          // modelZones.value.forEach((x, index) => {
          //   x.idZone = index + 1;
          // });
          // console.log('>>>> OK, received', data)
        });
      } catch (error) {
        console.log('mark : FW-7A0CF65B8CBE', error);
      }
    };

    const editSubZone = (data) => {
      try {
        $q.dialog({
          title: `Editar Zona ${data.nameSubZone}`,
          message: 'Cambia nombre de la zona',
          prompt: {
            model: data.nameSubZone,
            isValid: (val) => val.length > 2, // << here is the magic
            type: 'text', // optional
          },
          cancel: true,
          persistent: true,
        }).onOk((data) => {
          let dato = modelZones.value.findIndex(
            (x) => x.idZone === active.value
          );

          let sub = modelZones.value[dato].subZone.findIndex(
            (x) => x.idSubZone === activeSubZone.value
          );

          modelZones.value[dato].subZone[sub].nameSubZone =
            capitalizeFirstLetter(data.toLowerCase());

          modelZones.value[dato].subZone.sort(function (a, b) {
            if (a.nameSubZone > b.nameSubZone) {
              return 1;
            }
            if (a.nameSubZone < b.nameSubZone) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          // modelZones.value[dato].subZone.forEach((x, index) => {
          //   x.idSubZone = index + 1;
          // });
          // console.log('>>>> OK, received', data)
          modelSubZones.value = modelZones.value[dato].subZone;
        });
      } catch (error) {
        console.log('mark : FW-7A0CF65B8CBE', error);
      }
    };

    const deleteZone = () => {
      try {
        let dato = modelZones.value.findIndex((x) => x.idZone === active.value);
        deletedZone.value.push(modelZones.value[dato]);
        modelZones.value.splice(dato, 1);
        // modelZones.value.forEach((x, index) => {
        //   x.idZone = index + 1;
        // });
        modelLabelZone.value = '';
        modelSubZones.value = [];
        active.value = -1;
      } catch (error) {
        console.log('mark : FW-DE66FFFD1FE4', error);
      }
    };

    const deleteSubZone = () => {
      try {
        let dato = modelZones.value.findIndex((x) => x.idZone === active.value);
        let sub = modelZones.value[dato].subZone.findIndex(
          (x) => x.idSubZone === activeSubZone.value
        );
        deletedSubZone.value.push(modelZones.value[dato].subZone[sub]);
        modelZones.value[dato].subZone.splice(sub, 1);
        // modelZones.value[dato].subZone.forEach((x, index) => {
        //   x.idSubZone = index + 1;
        // });
        // console.log(modelZones.value);
      } catch (error) {
        console.log('mark : FW-DE66FFFD1FE4', error);
      }
    };

    const triggerWarning = () => {
      $q.notify({
        message: 'DEBE TENER AL MENOS UNA SUBZONA POR ZONA',
        type: 'negative',
      });
    };

    const verificarSubZonas = () => {
      const result = modelZones.value.find((x) => x.subZone.length === 0);
      if (result) {
        triggerWarning();
      } else {
        const data = {
          modelZones: modelZones.value,
          deletedZone: deletedZone.value,
          deletedSubZone: deletedSubZone.value,
        };
        //emit('ok', data);
        onDialogOK(data);
      }
    };

    onMounted(() => {
      try {
        if (props.simple) {
          const data = props.simple;
          modelZones.value = [];
          data.forEach((element) => {
            modelZones.value.push({
              name: element.label,
              idZone: element.idZone,
              subZone: element.children?.map((y) => {
                return {
                  idZone: element.idZone,
                  idSubZone: y.idSubZone,
                  nameSubZone: y.label,
                };
              }),
            });
          });
          console.log(modelZones.value);
        }
      } catch (error) {}
    });

    // const sendZones =  () => {
    //   emit("onFire")
    // }

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      active,
      modelZones,
      modelLabelZone,
      activeSubZone,
      modelLabelSubZone,
      modelDisable,
      modelSubZones,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        // emit('ok', modelZones.value);
        // onDialogOK();
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
      prompt,
      addZone,
      selectZone,
      deleteZone,
      promptSubZone,
      addSubZone,
      selectSubZone,
      deleteSubZone,
      editZone,
      editSubZone,
      verificarSubZonas,
    };
  },
};
</script>

<style lang="scss" scoped>
.card-principal {
  width: 100%;
  max-width: 1000px;
}

.my-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.zone {
  flex: 1 0 0;
  width: 100%;
  max-width: 480px;
}

.subzone {
  flex: 1 0 0;
  width: 100%;
  max-width: 480px;
}
</style>