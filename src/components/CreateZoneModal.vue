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
            <div class="text-h7">Our Changing Planet</div>

          </q-card-section>

          <q-card-actions align="around">
            <q-btn
              icon="fa-regular fa-square-plus"
              flat
              style="line-height: 1.5rem;"
            > Añadir</q-btn>
            <q-btn
              icon="fa-regular fa-square-minus"
              flat
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
                  <template>
                    <q-item
                      clickable
                      v-ripple
                      :active="active"
                      active-class="bg-teal-1 text-grey-8"
                    >
                      <q-item-section avatar>
                        <q-icon name="signal_wifi_off" />
                      </q-item-section>
                      <q-item-section>Active, Active class</q-item-section>
                      <q-item-section side>Side</q-item-section>
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
            <div class="text-h6">Our Changing Planet</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>

          <q-card-actions align="around">
            <q-btn flat>Action 1</q-btn>
            <q-btn flat>Action 2</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="OK"
          @click="onOKClick"
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
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';

export default {
  props: {
    // ...your custom props
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup() {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK();
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,

      active: ref(false),
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