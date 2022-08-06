<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <q-page>
    <q-btn @click='setTemplate'>

      Download Excel (you can customize this with html code!)
    </q-btn>

    <div class='q-pa-md'>
      <q-file
        v-model='files'
        label='Pick one file'
        filled
        style='max-width: 300px'
      />
      <q-btn
        @click='subirExcel()'
        color='primary'
        label='Primary'
      />
    </div>
    <!-- <div class='q-pa-md'>
   <h1>EXCEL</h1>
    <input id='archivoExcel' type='file' @change='subirExcel()' />
  </div> -->

  </q-page>

</template>


<script lang='ts'>
import { defineComponent, ref } from 'vue';
import XLSX from 'xlsx-js-style';
import readXlsFile from 'read-excel-file';
import Verify from '../common/service/verify';
import {
  diff,
  addedDiff,
  deletedDiff,
  updatedDiff,
  detailedDiff,
} from 'deep-object-diff';
export default defineComponent({
  name: 'ToExcel',
  components: {},
  setup() {
    //vars

    const jsonExcel = ref();
    const items = ref([]);
    const valor = ref([]);
    const files = ref(null);
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
    //methods

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

    const setTemplate = async () => {
      /* fetch JSON data and parse */
      const url = 'https://sheetjs.com/executive.json';
      const raw_data = await (await fetch(url)).json();

      /* filter for the Presidents */
      const prez = raw_data.filter((row: { terms: any[] }) =>
        row.terms.some((term) => term.type === 'prez')
      );

      /* flatten objects */
      const rows = prez.map(
        (row: {
          name: { first: string; last: string };
          bio: { birthday: any };
        }) => ({
          name: row.name.first + ' ' + row.name.last,
          birthday: row.bio.birthday,
        })
      );

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
          v: '17/06/2022 07:59 PM',
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
          v: '15',
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
          v: 'Stock hasta el: 17/06/2022 07:59 PM',
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
          v: 'Costo hasta el: 17/06/2022 07:59 PM',
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

      for (let i = 0; i < 60; i++) {
        let rowStyle = [
          {
            v: '',
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
            v: '',
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
          {
            v: '',
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
        ];
        if (i < rows.length) {
          rowStyle[0].v = rows[i].name;
          rowStyle[1].v = rows[i].birthday;
        }
        heading.push(rowStyle);
      }

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

      //    XLSX.utils.sheet_add_aoa(ws1b,{origin: 'A1'});
      //   XLSX.utils.sheet_add_json(ws,rows,{ origin: 'A12', skipHeader: true });
      XLSX.utils.book_append_sheet(wb, ws, 'browser-demo');

      // STEP 4: Write Excel file to browser
      XLSX.writeFile(wb, 'xx.xlsx');

      // eslint-disable-next-line quotes
      console.log(
        // eslint-disable-next-line quotes
        `\n--------------------==~==~==~==[ ...DEMO COMPLETE ]==~==~==~==--------------------\n\n`
      );
    };

    return {
      //vars
      items,
      files,
      //methods
      subirExcel,
      setTemplate,
    };
  },
});
</script>
