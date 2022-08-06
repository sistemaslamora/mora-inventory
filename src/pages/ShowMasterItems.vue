<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <q-page >    
 

   <div class='q-pa-md'>
    <q-file
      v-model='files'
      label='Pick one file'
      filled
      style='max-width: 300px'
    />
      <q-btn @click='subirExcel()' color='primary' label='Primary' />
  </div>
 <!-- <div class='q-pa-md'>
   <h1>EXCEL</h1>
    <input id='archivoExcel' type='file' @change='subirExcel()' />
  </div> -->


  </q-page>


</template>


<script lang='ts'>


import { defineComponent, ref } from 'vue';
import XLSX from 'xlsx-js-style'
import readXlsFile from 'read-excel-file'
export default defineComponent({
  name: 'ToExcel',
  components: {  },
  setup () {
    
    //vars

     const items = ref([])   
    
     const files = ref(null)
    //methods
    const subirExcel = async() =>{
        try {
             const data2 = files.value  //document.getElementById('archivoExcel') as HTMLInputElement | null;

             items.value = await readXlsFile(data2?.files[0])
             console.log(items.value)
             
        }
        catch (error) {
            console.log(error)
        }
    }

   

  
    return { 
             //vars  
             items,  
             files,
             //methods
             subirExcel,
           
           };
  }
});
</script>
