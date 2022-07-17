import LoggerManager from './LoggerManager';
import { LocalStorage, Dialog } from 'quasar';

//import store from '../../../store/index.ts';
//import route from '../../../router/index.ts';
//import { $store, $router } from '../../../boot/router-auth.ts';
//import OrdersToolbar from '../../../03_bussiness/dev008/components/ordersToolbar.vue';

export const responseInterceptor = (response) => {
  return response;
};

export const errorInterceptor = async (error, showAlert = false) => {
  try {
    if (error.response) {
      if (error.response.status === 401 && !global.session_expired) {
        //  await OrdersToolbar.cancelAutoUpdate();
        global.session_expired = true;
        LocalStorage.remove('authData');

        // $store.dispatch('authModule/InitialAction');
        // $router.push('/');
      }

      if (showAlert) {
        alert(error.response.data.Message);
      }

      LoggerManager.error(
        'F9FAC300475E',
        'Error Interceptor, error => interceptor',
        { sendToExternal: false, data: error.response }
      );
    } else {
      // let sendToExternal = false;

      // if (process.env.NODE_ENV !== 'production') {

      //     sendToExternal = true;

      // }

      LoggerManager.error(
        '30180AD6964D',
        'Network Error!, error => interceptor',
        { sendToExternal: false, data: error }
      );
    }
  } catch (error) {
    LoggerManager.error(
      '30180AD6964D',
      'Network Error!, error => interceptor',
      { sendToExternal: false, data: error }
    );
  }

  return error;
};
