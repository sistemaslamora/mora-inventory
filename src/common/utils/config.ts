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
export const AUTHURL = '/v1/system/security/authentication';
export const USERURL = '/v1/system/user';
export const SYSTEMURL = '/v1/system';
export const SYSTEMBINARYURL = '/v1/system/binary';
export const FINALCOSTUMERURL = '/v1/business/dev007/final/customer';
export const DISPATCHERURL = '/v1/business/dev007/dispatcher';
export const EXPORTURL = '/v1/business/dev007/export';
export const ORDERURL = '/v1/business/dev007/common/full/delivery/order'
export const PASSRECOVERURL = '/v1/system/user/password/recover/code/send'
export const PASSCHANGE = '/v1/system/user/password/recover'



export const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',  
  TimeZoneId: 'America/Los_Angeles',
  Language: 'en_US',
};
