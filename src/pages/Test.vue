<template>
  <div class="content">
    <DxPivotGrid
      id="pivotgrid"
      ref="grid"
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
    </DxPivotGrid>
  </div>
</template>

<script>
import DxPivotGrid, {
  DxExport,
  DxFieldChooser,
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
// Our demo infrastructure requires us to use 'file-saver-es'.
// We recommend that you use the official 'file-saver' package in your applications.
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { ref, onMounted, onBeforeMount } from 'vue';
import { sales } from '../common/references/data.js';
import { useitemsTemplateStore } from '../stores/itemsTemplate';
import 'devextreme/dist/css/dx.light.css';

export default {
  components: {
    DxPivotGrid,
    DxExport,
    DxFieldChooser,
  },
  setup() {
    const useItems = useitemsTemplateStore();
    const dataSource = ref({
      fields: [
        {
          caption: 'Producto',
          width: 120,
          dataField: 'Producto',
          area: 'row',
          sortBySummaryField: 'Total',
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
      store: useItems.itemsPrice,
    });
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
    onMounted(() => {});
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