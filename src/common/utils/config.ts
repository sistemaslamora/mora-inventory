import { LocalStorage } from 'quasar'
// export const URL = 'https://odindt.com';
// export const CONTEXT = 'kk/api';
// export const CONTEXT = 'test01/odin-v2/kk/fl/miami/api';
// export const BASEURL =  () =>{
//     const storageServer = LocalStorage.getItem('serverData')['serverLink']
//     let BASEURL = ''
//     if(storageServer == null){
//       BASEURL = 'https://www.weknock-tech.com/test01/odin-v2/kk/fl/miami/api'
//     }else{
//       BASEURL = storageServer
//     }
//     return BASEURL
//   }

export const URL = 'https://xyclixgnixwkizbakynf.supabase.co';
export const CONTEXT = '/rest/v1';
export const BASEURL = `${URL}/${CONTEXT}`;




export const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',  
  TimeZoneId: 'America/Los_Angeles',
  Language: 'en_US',
};
