<template>
  <div class="content">
    <DxPivotGrid
      id="pivotgrid"
      ref="grid"
      :height="560"
      :data-source="dataSource"
      :allow-sorting-by-summary="true"
      :allow-filtering="true"
      :show-borders="true"
      :show-column-grand-totals="false"
      :show-row-grand-totals="false"
      :show-row-totals="false"
      row-header-layout="tree"
      :show-column-totals="false"
      @exporting="onExporting"
    >
      <DxFieldChooser :enabled="true" :height="400" />
      <DxExport :enabled="true" />
      <DxScrolling mode="virtual" />
    </DxPivotGrid>
  </div>
</template>

<script>
import DxPivotGrid, {
  DxExport,
  DxScrolling,
  DxFieldChooser,
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
// Our demo infrastructure requires us to use 'file-saver-es'.
// We recommend that you use the official 'file-saver' package in your applications.
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { ref, onMounted, onBeforeUnmount } from 'vue';

import { useitemsTemplateStore } from '../stores/itemsTemplate';
import 'devextreme/dist/css/dx.light.css';
import Verify from '../common/service/verify';
import { useQuasar } from 'quasar';
export default {
  components: {
    DxPivotGrid,
    DxExport,
    DxFieldChooser,
    DxScrolling,
  },
  setup() {
    const useItems = useitemsTemplateStore();
    const dataSource = ref({});
    const $q = useQuasar();

    const onExporting = (e) => {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('productos');

      exportPivotGrid({
        component: e.component,
        worksheet,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: 'application/octet-stream' }),
            'productosXprecios.xlsx'
          );
        });
      });
      e.cancel = true;
    };

    const recursiva = async (canal) => {
      const result = await Verify.getItemsOfSale({
        local_id: 1,
        integracion_id: canal,
        porMarca: 0,
        typemoneda: null,
      });
      console.log('output->result', result);
      if (result.success === 1) {
        return result.originalResponse.body.data;
        // console.log(
        //   'output->info[0].preciolocalproducto_precio',
        //   info[0].preciolocalproducto_precio
        // );
      } else {
        return null;
      }
    };

    const setItemsPivot = async () => {
      const options = {
        row: 'Productos',
        column: 'Canal',
        value: 'Precio',
      };
      const canales = [
        { id: null, name: 'Local' },
        { id: 29, name: 'Shopify' },
        { id: 999, name: 'Rappi sopitas' },
        { id: 1000, name: 'Rappi lamora' },
        { id: 1002, name: 'Justo sopitas' },
        { id: 1003, name: 'Justo lamora' },
        { id: 1004, name: 'Justo triplemania' },
        { id: 1006, name: 'Mora' },
        { id: 1007, name: 'Sopitas' },
        { id: 1008, name: 'Barra' },
        { id: 1009, name: 'Salon' },
        { id: 1011, name: 'Rappi triplemania' },
      ];
      const output = [];
      for (let i = 0; i < canales.length; i++) {
        const info = await recursiva(canales[i].id);
        if (info) {
          console.log('output->canales[i].id', canales[i].id);
          console.log('output->info', info);
          const name = canales[i].name;
          for (let j = 0; j < info.length - 1; j++) {
            output.push({
              Producto_Id: info[j].producto_id,
              Producto: info[j].producto_descripcion,
              Precio:
                info[j].preciolocalproducto_precio === '-'
                  ? '-1'
                  : info[j].preciolocalproducto_precio,
              Local: info[j].local_descripcion,
              Canal: name,
            });
          }
        }
      }

      return output;
    };
    onMounted(async () => {
      $q.loading.show();
      const source = await setItemsPivot();
      $q.loading.hide();

      dataSource.value = new PivotGridDataSource({
        fields: [
          {
            caption: 'Producto',
            width: 120,
            dataField: 'Producto',
            area: 'row',
            //  sortBySummaryField: 'Total',
          },

          {
            dataField: 'Canal',
            dataType: 'Canal',
            area: 'column',
          },
          // {
          //   groupName: 'date',
          //   groupInterval: 'month',
          //   visible: false,
          // },
          {
            caption: 'Precio',
            dataField: 'Precio',
            dataType: 'number',
            summaryType: 'sum',
            area: 'data',
          },
        ],
        store: source,
      });
    });
    return {
      dataSource,
      onExporting,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  overflow: auto;
  margin: 2rem;
}
</style>