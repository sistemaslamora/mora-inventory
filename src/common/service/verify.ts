// @strictNullChecks: false

import RemoteClient from '../utils/RemoteClient';
import CommonConstants from '../utils/CommonContants';
import CommonUtils from '../utils/CommonUtils';
import LoggerManager from '../utils/LoggerManager';
import { BASEURL, HEADERS } from '../utils/config';
import { OriginalResponse } from '../references/models';
import { responseInterceptor, errorInterceptor } from '../utils/interceptor';

// export type User = { Username: string }
// export type UserList = Array<User & { password: string}>
// export type data = Array<User & { transport: string }>
// const PATH_LOGIN: string | undefined = '/login'
// const PATH_LOGOUT: string | undefined = '/logout'
// const PATH_AUTH_AVATAR: string | undefined = '/auth'
// const PATH_ACTION: string | undefined = '/actions'
// const PATH_CHECK_TOKEN: string | undefined = '/token/check'
const PATH_MAIN_ITEMS: string | undefined = '/bizItem';
const PATH_INVENTORY_TEMPLATE_ITEMS: string | undefined =
  '/bizInventoryTemplate';
const PATH_TEMPLATE_ITEMS: string | undefined = '/biztemplateitem';

export default class ItemService {
  static findItem = async (data) => {
    let nullable: OriginalResponse | null | undefined;

    const baseUrl: string = BASEURL + PATH_MAIN_ITEMS;
    const result = {
      success: 0,
      feedback: {
        title: null ? null : '',
        message: null ? null : '',
        code: '',
        mark: '',
        kind: 0,
        buttons: [{}],
      },
      body: null ? null : {},
      originalResponse: nullable,
    };

    try {
      const response = await RemoteClient.callRemoteService({
        mark: '7D6E30E5CF3D',
        method: 'get',
        url: [baseUrl],
        timeout: CommonConstants._TIMEOUT_01,
        timeoutCancel: CommonConstants._TIMEOUT_CANCEL_01,
        requestInterceptor: [],
        responseInterceptor: [
          {
            onSuccess: responseInterceptor,
            onReject: errorInterceptor,
          },
        ],
        headers: {
          ...HEADERS,
          apiKey: process.env.SUPABASE_API_KEY_PUBLIC,
          Authorization: process.env.SUPABASE_AUTHORIZATION_PUBLIC,
        },
        params: data,
        body: null,
      });

      if (response.statusCode === 200) {
        result.success = 1;

        if (response.body && Array.isArray(response.body.Data)) {
          result.body = response.body.Data;
        }

        //No feedback
        //Not needed return feedback
      } else if (response.statusCode === 0) {
        //Timeout of the dead
        result.feedback.kind = 2;
        result.feedback.title = 'Connection failed';
        result.feedback.message =
          'Please check your mobile data or wifi connection.';
        result.feedback.code = 'CONNECTION_TIMEOUT';
        result.feedback.mark = '00095F68C6F6';
      } else if (response.backend.Code) {
        //Another response from the backend

        result.success = -1; //Failed

        const strMark =
          response.backend && response.backend.Mark
            ? response.backend.Mark
            : '47B31E7AE825';

        result.feedback.title = 'Error to send getBusinessKind';
        result.feedback.message = response.backend.Message;
        result.feedback.code = response.backend.Code;
        result.feedback.mark = strMark;
      } else {
        result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
          response.backend,
          '808F5A569BB6',
          null
        );

        /*
                result.feedback.title = "Unhandled main server response"
                result.feedback.message = "Unhandled main server response. Please contact with technical support"
                result.feedback.mark = response.backend && response.backend.Mark ? response.backend.Mark : "DB84788B473B"
              */
      }

      //Add default buttons to dialog alert
      if (result.feedback.buttons.length === 0) {
        result.feedback.buttons.push({
          text: 'Close',
          onPress: () => {
            console.log('true');
          }, //To see the feedback when the button is pressed
        });
      }

      result.originalResponse = response; //Always return the original response back
    } catch (error) {
      void LoggerManager.error(
        '2993CF1DFFF7',
        'Error Service Dispatcher => getBusinessKind',
        { sendToExternal: false, notSendToStorage: false, data: error }
      );
    }

    return result;
  };

  static getInventoryTemplate = async (data) => {
    let nullable: OriginalResponse | null | undefined;

    const baseUrl: string = BASEURL + PATH_INVENTORY_TEMPLATE_ITEMS;
    const result = {
      success: 0,
      feedback: {
        title: null ? null : '',
        message: null ? null : '',
        code: '',
        mark: '',
        kind: 0,
        buttons: [{}],
      },
      body: null ? null : {},
      originalResponse: nullable,
    };

    try {
      const response = await RemoteClient.callRemoteService({
        mark: '7D6E30E5CF3D',
        method: 'get',
        url: [baseUrl],
        timeout: CommonConstants._TIMEOUT_01,
        timeoutCancel: CommonConstants._TIMEOUT_CANCEL_01,
        requestInterceptor: [],
        responseInterceptor: [
          {
            onSuccess: responseInterceptor,
            onReject: errorInterceptor,
          },
        ],
        headers: {
          ...HEADERS,
          apiKey: process.env.SUPABASE_API_KEY_PUBLIC,
          Authorization: process.env.SUPABASE_AUTHORIZATION_PUBLIC,
        },
        params: data,
        body: null,
      });

      if (response.statusCode === 200) {
        result.success = 1;

        if (response.body && Array.isArray(response.body.Data)) {
          result.body = response.body.Data;
        }

        //No feedback
        //Not needed return feedback
      } else if (response.statusCode === 0) {
        //Timeout of the dead
        result.feedback.kind = 2;
        result.feedback.title = 'Connection failed';
        result.feedback.message =
          'Please check your mobile data or wifi connection.';
        result.feedback.code = 'CONNECTION_TIMEOUT';
        result.feedback.mark = '00095F68C6F6';
      } else if (response.backend.Code) {
        //Another response from the backend

        result.success = -1; //Failed

        const strMark =
          response.backend && response.backend.Mark
            ? response.backend.Mark
            : '47B31E7AE825';

        result.feedback.title = 'Error to send getBusinessKind';
        result.feedback.message = response.backend.Message;
        result.feedback.code = response.backend.Code;
        result.feedback.mark = strMark;
      } else {
        result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
          response.backend,
          '808F5A569BB6',
          null
        );

        /*
                result.feedback.title = "Unhandled main server response"
                result.feedback.message = "Unhandled main server response. Please contact with technical support"
                result.feedback.mark = response.backend && response.backend.Mark ? response.backend.Mark : "DB84788B473B"
              */
      }

      //Add default buttons to dialog alert
      if (result.feedback.buttons.length === 0) {
        result.feedback.buttons.push({
          text: 'Close',
          onPress: () => {
            console.log('true');
          }, //To see the feedback when the button is pressed
        });
      }

      result.originalResponse = response; //Always return the original response back
    } catch (error) {
      void LoggerManager.error(
        '2993CF1DFFF7',
        'Error Service Dispatcher => getBusinessKind',
        { sendToExternal: false, notSendToStorage: false, data: error }
      );
    }

    return result;
  };

  static getItemsTemplate = async (data) => {
    let nullable: OriginalResponse | null | undefined;

    const baseUrl: string = BASEURL + PATH_TEMPLATE_ITEMS;
    const result = {
      success: 0,
      feedback: {
        title: null ? null : '',
        message: null ? null : '',
        code: '',
        mark: '',
        kind: 0,
        buttons: [{}],
      },
      body: null ? null : {},
      originalResponse: nullable,
    };

    try {
      const response = await RemoteClient.callRemoteService({
        mark: '7D6E30E5CF3D',
        method: 'get',
        url: [baseUrl],
        timeout: CommonConstants._TIMEOUT_03,
        timeoutCancel: CommonConstants._TIMEOUT_CANCEL_03,
        requestInterceptor: [],
        responseInterceptor: [
          {
            onSuccess: responseInterceptor,
            onReject: errorInterceptor,
          },
        ],
        headers: {
          ...HEADERS,
          apiKey: process.env.SUPABASE_API_KEY_PUBLIC,
          Authorization: process.env.SUPABASE_AUTHORIZATION_PUBLIC,
        },
        params: data,
        body: null,
      });

      if (response.statusCode === 200) {
        result.success = 1;

        if (response.body && Array.isArray(response.body.Data)) {
          result.body = response.body.Data;
        }

        //No feedback
        //Not needed return feedback
      } else if (response.statusCode === 0) {
        //Timeout of the dead
        result.feedback.kind = 2;
        result.feedback.title = 'Connection failed';
        result.feedback.message =
          'Please check your mobile data or wifi connection.';
        result.feedback.code = 'CONNECTION_TIMEOUT';
        result.feedback.mark = '00095F68C6F6';
      } else if (response.backend.Code) {
        //Another response from the backend

        result.success = -1; //Failed

        const strMark =
          response.backend && response.backend.Mark
            ? response.backend.Mark
            : '47B31E7AE825';

        result.feedback.title = 'Error to send getBusinessKind';
        result.feedback.message = response.backend.Message;
        result.feedback.code = response.backend.Code;
        result.feedback.mark = strMark;
      } else {
        result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
          response.backend,
          '808F5A569BB6',
          null
        );

        /*
                result.feedback.title = "Unhandled main server response"
                result.feedback.message = "Unhandled main server response. Please contact with technical support"
                result.feedback.mark = response.backend && response.backend.Mark ? response.backend.Mark : "DB84788B473B"
              */
      }

      //Add default buttons to dialog alert
      if (result.feedback.buttons.length === 0) {
        result.feedback.buttons.push({
          text: 'Close',
          onPress: () => {
            console.log('true');
          }, //To see the feedback when the button is pressed
        });
      }

      result.originalResponse = response; //Always return the original response back
    } catch (error) {
      void LoggerManager.error(
        '2993CF1DFFF7',
        'Error Service Dispatcher => getBusinessKind',
        { sendToExternal: false, notSendToStorage: false, data: error }
      );
    }

    return result;
  };

  static createInventoryTemplate = async (data) => {
    const baseUrl: string | undefined = BASEURL + PATH_INVENTORY_TEMPLATE_ITEMS;

    const result = {
      success: 0,
      feedback: {
        title: null,
        message: null,
        code: '',
        mark: '',
        kind: 0,
        buttons: [],
      },
      body: null,
      originalResponse: null,
    };

    try {
      const response: any = await RemoteClient.callRemoteService({
        mark: 'F1D907DDACB4',
        method: 'post',
        url: [baseUrl],
        timeout: CommonConstants._TIMEOUT_01,
        timeoutCancel: CommonConstants._TIMEOUT_CANCEL_01,
        requestInterceptor: [],
        responseInterceptor: [
          {
            onSuccess: responseInterceptor,
            onReject: errorInterceptor,
          },
        ],
        headers: {
          ...HEADERS,
          apiKey: process.env.SUPABASE_API_KEY_PUBLIC,
          Authorization: process.env.SUPABASE_AUTHORIZATION_PUBLIC,
        },
        params: null,
        body: data,
      });

      await LoggerManager.log('D75C0B3A55E9', 'Logout', response);

      if (response.statusCode < 210) {
        result.success = 1;
        console.log('rsponse', response);
        if (response.body && Array.isArray(response.body.Data)) {
          result.body = response.body.Data;
        }

        //No feedback
        //Not needed return feedback
      } else if (response.statusCode === 0) {
        //Timeout of the dead
        result.feedback.kind = 2;
        result.feedback.title = 'Connection failed';
        result.feedback.message =
          'Please check your mobile data or wifi connection.';
        result.feedback.code = 'CONNECTION_TIMEOUT';
        result.feedback.mark = '554A6A962F0F';
      } else if (response.backend.Code) {
        //Another response from the backend

        result.success = -1; //Failed

        const strMark =
          response.backend && response.backend.Mark
            ? response.backend.Mark
            : '32355F4918BD';

        result.feedback.title = 'Error to send createDeliveryOrder';
        result.feedback.message = response.backend.Message;
        result.feedback.code = response.backend.Code;
        result.feedback.mark = strMark;
      } else {
        result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
          response.backend,
          '9AD15CBB828F',
          null
        );

        /*
                result.feedback.title = "Unhandled main server response"
                result.feedback.message = "Unhandled main server response. Please contact with technical support"
                result.feedback.mark = response.backend && response.backend.Mark ? response.backend.Mark : "17512A7BB2CD"
              */
      }

      //Add default buttons to dialog alert
      if (result.feedback.buttons.length === 0) {
        result.feedback.buttons.push({
          text: 'Close',
          onPress: () => {}, //To see the feedback when the button is pressed
        });
      }

      result.originalResponse = response; //Always return the original response back
    } catch (error) {
      void LoggerManager.error(
        '3BC5D9FF85C3',
        'Error Service Logout => logout',
        { sendToExternal: false, notSendToStorage: false, data: error }
      );
    }

    return result;
  };

  static getItemsOfSale = async (data) => {
    const baseUrl: string | undefined =
      'https://lamora.restaurant.pe/restaurant/m/rest/almacen/obtenerListaPreciosPorLocal';

    const result = {
      success: 0,
      feedback: {
        title: null,
        message: null,
        code: '',
        mark: '',
        kind: 0,
        buttons: [],
      },
      body: null,
      originalResponse: null,
    };

    try {
      const response: any = await RemoteClient.callRemoteService({
        mark: 'F1D907DDACB4',
        method: 'post',
        url: [baseUrl],
        timeout: CommonConstants._TIMEOUT_01,
        timeoutCancel: CommonConstants._TIMEOUT_CANCEL_01,
        requestInterceptor: [],
        responseInterceptor: [
          {
            onSuccess: responseInterceptor,
            onReject: errorInterceptor,
          },
        ],
        headers: {
          //   ...HEADERS,
          //   apiKey: process.env.SUPABASE_API_KEY_PUBLIC,
          //   Authorization: process.env.SUPABASE_AUTHORIZATION_PUBLIC,
        },
        params: null,
        body: data,
      });

      await LoggerManager.log('D75C0B3A55E9', 'Logout', response);

      if (response.statusCode < 210) {
        result.success = 1;

        if (response.body && Array.isArray(response.body.Data)) {
          result.body = response.body.Data;
        }

        //No feedback
        //Not needed return feedback
      } else if (response.statusCode === 0) {
        //Timeout of the dead
        result.feedback.kind = 2;
        result.feedback.title = 'Connection failed';
        result.feedback.message =
          'Please check your mobile data or wifi connection.';
        result.feedback.code = 'CONNECTION_TIMEOUT';
        result.feedback.mark = '554A6A962F0F';
      } else if (response.backend.Code) {
        //Another response from the backend

        result.success = -1; //Failed

        const strMark =
          response.backend && response.backend.Mark
            ? response.backend.Mark
            : '32355F4918BD';

        result.feedback.title = 'Error to send createDeliveryOrder';
        result.feedback.message = response.backend.Message;
        result.feedback.code = response.backend.Code;
        result.feedback.mark = strMark;
      } else {
        result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
          response.backend,
          '9AD15CBB828F',
          null
        );

        /*
                    result.feedback.title = "Unhandled main server response"
                    result.feedback.message = "Unhandled main server response. Please contact with technical support"
                    result.feedback.mark = response.backend && response.backend.Mark ? response.backend.Mark : "17512A7BB2CD"
                  */
      }

      //Add default buttons to dialog alert
      if (result.feedback.buttons.length === 0) {
        result.feedback.buttons.push({
          text: 'Close',
          onPress: () => {}, //To see the feedback when the button is pressed
        });
      }

      result.originalResponse = response; //Always return the original response back
    } catch (error) {
      void LoggerManager.error(
        '3BC5D9FF85C3',
        'Error Service Logout => logout',
        { sendToExternal: false, notSendToStorage: false, data: error }
      );
    }

    return result;
  };

  static getRestaurantItems = async (data, format) => {
    let nullable: OriginalResponse | null | undefined;

    const baseUrl = `https://lamora.restaurant.pe/restaurant/public/rest/local/getStockParaCuadre/${data.store}/-1/${format}/${data.dateInv}`; //2022-09-02%2020:00:00
    const result = {
      success: 0,
      feedback: {
        title: null ? null : '',
        message: null ? null : '',
        code: '',
        mark: '',
        kind: 0,
        buttons: [{}],
      },
      body: null ? null : {},
      originalResponse: nullable,
    };

    try {
      const response = await RemoteClient.callRemoteService({
        mark: '7D6E30E5CF3D',
        method: 'get',
        url: [baseUrl],
        timeout: CommonConstants._TIMEOUT_03,
        timeoutCancel: CommonConstants._TIMEOUT_CANCEL_03,
        requestInterceptor: [],
        responseInterceptor: [
          {
            onSuccess: responseInterceptor,
            onReject: errorInterceptor,
          },
        ],
        headers: {
          // ...HEADERS,
          // apiKey: process.env.SUPABASE_API_KEY_PUBLIC,
          // Authorization: process.env.SUPABASE_AUTHORIZATION_PUBLIC
        },
        params: null,
        body: null,
      });

      if (response.statusCode === 200) {
        result.success = 1;

        if (response.body && Array.isArray(response.body.Data)) {
          result.body = response.body.Data;
        }

        //No feedback
        //Not needed return feedback
      } else if (response.statusCode === 0) {
        //Timeout of the dead
        result.feedback.kind = 2;
        result.feedback.title = 'Connection failed';
        result.feedback.message =
          'Please check your mobile data or wifi connection.';
        result.feedback.code = 'CONNECTION_TIMEOUT';
        result.feedback.mark = '00095F68C6F6';
      } else if (response.backend.Code) {
        //Another response from the backend

        result.success = -1; //Failed

        const strMark =
          response.backend && response.backend.Mark
            ? response.backend.Mark
            : '47B31E7AE825';

        result.feedback.title = 'Error to send getBusinessKind';
        result.feedback.message = response.backend.Message;
        result.feedback.code = response.backend.Code;
        result.feedback.mark = strMark;
      } else {
        result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
          response.backend,
          '808F5A569BB6',
          null
        );

        /*
                result.feedback.title = "Unhandled main server response"
                result.feedback.message = "Unhandled main server response. Please contact with technical support"
                result.feedback.mark = response.backend && response.backend.Mark ? response.backend.Mark : "DB84788B473B"
              */
      }

      //Add default buttons to dialog alert
      if (result.feedback.buttons.length === 0) {
        result.feedback.buttons.push({
          text: 'Close',
          onPress: () => {
            console.log('true');
          }, //To see the feedback when the button is pressed
        });
      }

      result.originalResponse = response; //Always return the original response back
    } catch (error) {
      void LoggerManager.error(
        '2993CF1DFFF7',
        'Error Service Dispatcher => getBusinessKind',
        { sendToExternal: false, notSendToStorage: false, data: error }
      );
    }

    return result;
  };
  // static exampleGet = async (user: User) => {

  //     let nullable: OriginalResponse | null | undefined

  //     const baseUrl: string = BASEURL + AUTHURL + '/login'

  //      const result = {
  //         success: 0,
  //         feedback: {
  //             title: null ? null: '',
  //             message: null ? null: '',
  //             code: '',
  //             mark: '',
  //             kind: 0,
  //             buttons: [{}]
  //         },
  //         body: null?null:{},
  //         originalResponse: nullable
  //     }

  //     try {

  //         const response = await RemoteClient.callRemoteService(
  //             {
  //                 mark: '7D6E30E5CF3D',
  //                 method: 'get',
  //                 url: [
  //                     baseUrl
  //                 ],
  //                 timeout: CommonConstants._TIMEOUT_01,
  //                 timeoutCancel: CommonConstants._TIMEOUT_CANCEL_01,
  //                 requestInterceptor: [],
  //                 responseInterceptor: [
  //                     {
  //                         onSuccess: responseInterceptor,
  //                         onReject: errorInterceptor
  //                     }
  //                 ],
  //                 headers: {
  //                     ...HEADERS,
  //                     //Authorization: auth
  //                 },
  //                 params: user,
  //                 body: null,
  //             },

  //         )

  //         if (response.statusCode === 200) {

  //             result.success = 1

  //             if (response.body &&
  //                 Array.isArray(response.body.Data)) {

  //                 result.body = response.body.Data

  //             }

  //             //No feedback
  //             //Not needed return feedback

  //         }
  //         else if (response.statusCode === 0) {

  //             //Timeout of the dead
  //             result.feedback.kind = 2
  //             result.feedback.title = 'Connection failed'
  //             result.feedback.message = 'Please check your mobile data or wifi connection.'
  //             result.feedback.code = 'CONNECTION_TIMEOUT'
  //             result.feedback.mark = '00095F68C6F6'

  //         }
  //         else if (response.backend.Code) { //Another response from the backend

  //             result.success = -1 //Failed

  //             const strMark = response.backend && response.backend.Mark ? response.backend.Mark : '47B31E7AE825'

  //             result.feedback.title = 'Error to send getBusinessKind'
  //             result.feedback.message = response.backend.Message
  //             result.feedback.code = response.backend.Code
  //             result.feedback.mark = strMark

  //         }
  //         else {

  //           result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback( response.backend,
  //                                                                                    '808F5A569BB6',
  //                                                                                    null )

  //           /*
  //             result.feedback.title = "Unhandled main server response"
  //             result.feedback.message = "Unhandled main server response. Please contact with technical support"
  //             result.feedback.mark = response.backend && response.backend.Mark ? response.backend.Mark : "DB84788B473B"
  //           */

  //         }

  //         //Add default buttons to dialog alert
  //         if (result.feedback.buttons.length === 0) {

  //             result.feedback.buttons.push(
  //                 {
  //                     text: 'Close',
  //                     onPress: () => { console.log('true')} //To see the feedback when the button is pressed
  //                 }
  //             )

  //         }

  //         result.originalResponse = response //Always return the original response back

  //     }
  //     catch (error) {

  //        void LoggerManager.error( '2993CF1DFFF7', 'Error Service Dispatcher => getBusinessKind', {sendToExternal:false,notSendToStorage:false,data:error} )

  //     }

  //     return result

  // }
}
