// @strictNullChecks: false

import RemoteClient from '../utils/RemoteClient'
import CommonConstants from '../utils/CommonContants'
import CommonUtils from '../utils/CommonUtils'
import LoggerManager from '../utils/LoggerManager'
import { BASEURL, 
         AUTHURL, 
         PASSRECOVERURL, 
         PASSCHANGE, 
         HEADERS, 
         SYSTEMBINARYURL, 
         USERURL 
        } from '../utils/config';
import { OriginalResponse } from '../references/models'
import { responseInterceptor, errorInterceptor } from '../utils/interceptor'


export type User = { Username: string }
export type UserList = Array<User & { password: string}>
export type data = Array<User & { transport: string }>
const PATH_LOGIN: string | undefined = '/login'
const PATH_LOGOUT: string | undefined = '/logout'
const PATH_AUTH_AVATAR: string | undefined = '/auth'
const PATH_ACTION: string | undefined = '/actions'
const PATH_CHECK_TOKEN: string | undefined = '/token/check'


export default class AuthService {

   

  static login = async (user: User) => {
     
    const baseUrl: string | undefined =  `${BASEURL()}${AUTHURL}`
  

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
    }

    try {
      const response: any = await RemoteClient.callRemoteService(
        {
          mark: '40D42FBEA0F3',
          method: 'post',
          url: [baseUrl + PATH_LOGIN],
          timeout: CommonConstants._TIMEOUT_01,
          timeoutCancel: CommonConstants._TIMEOUT_CANCEL_01,
         /*  requestInterceptor: [],
          responseInterceptor: [
            {
              onSuccess: responseInterceptor,
              onReject: errorInterceptor,
            },
          ], */
          headers: {
            ...HEADERS,
            
          },
          params: null,
          body: user,
        },
        
      )

      await LoggerManager.log('73814D31D8BB', 'Login', response)

      if (response.statusCode === 200) {
        result.success = 1

        if (response.body && Array.isArray(response.body.Data)) {
          result.body = response.body.Data
        }

        //No feedback
        //Not needed return feedback
      } else if (response.statusCode === 0) {
        //Timeout of the dead
        result.feedback.kind = 2
        result.feedback.title = 'Connection failed'
        result.feedback.message =
          'Please check your mobile data or wifi connection.'
        result.feedback.code = 'CONNECTION_TIMEOUT'
        result.feedback.mark = '554A6A962F0F'
      } else if (response.backend.Code) {
        //Another response from the backend

        result.success = -1 //Failed

        const strMark =
          response.backend && response.backend.Mark
            ? response.backend.Mark
            : '32355F4918BD'

        result.feedback.title = 'Error in Login'
        result.feedback.message = response.backend.Message
        result.feedback.code = response.backend.Code
        result.feedback.mark = strMark
      } else {
        result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
          response.backend,
          '9AD15CBB828F',
          null
        )

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
        })
      }

      result.originalResponse = response //Always return the original response back
    } catch (error) {
      void LoggerManager.error(
        '4CD244F8EF5E',
        'Error Service Login => login',
        {sendToExternal:false,notSendToStorage:false,data:error} 
      )

    }

    return result
    }    

    static logout = async (auth) => {
     
    const baseUrl: string | undefined =  `${BASEURL()}${AUTHURL}`
    
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
    }

    try {
      const response: any = await RemoteClient.callRemoteService(
        {
          mark: 'F1D907DDACB4',
          method: 'post',
          url: [baseUrl + PATH_LOGOUT],
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
            Authorization: auth
            
          },
          params: null,
          body: null,
        },
        
      )

      await LoggerManager.log('D75C0B3A55E9', 'Logout', response)


      if (response.statusCode === 200) {
        result.success = 1

        if (response.body && Array.isArray(response.body.Data)) {
          result.body = response.body.Data
        }

        //No feedback
        //Not needed return feedback
      } else if (response.statusCode === 0) {
        //Timeout of the dead
        result.feedback.kind = 2
        result.feedback.title = 'Connection failed'
        result.feedback.message =
          'Please check your mobile data or wifi connection.'
        result.feedback.code = 'CONNECTION_TIMEOUT'
        result.feedback.mark = '554A6A962F0F'
      } else if (response.backend.Code) {
        //Another response from the backend

        result.success = -1 //Failed

        const strMark =
          response.backend && response.backend.Mark
            ? response.backend.Mark
            : '32355F4918BD'

        result.feedback.title = 'Error to send createDeliveryOrder'
        result.feedback.message = response.backend.Message
        result.feedback.code = response.backend.Code
        result.feedback.mark = strMark
      } else {
        result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
          response.backend,
          '9AD15CBB828F',
          null
        )

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
        })
      }

      result.originalResponse = response //Always return the original response back
    } catch (error) {
     void LoggerManager.error(
        '3BC5D9FF85C3',
        'Error Service Logout => logout',
        {sendToExternal:false,notSendToStorage:false,data:error} 
      )
    }

    return result
    }

    static restorePassword = async (data) => {
     
      const baseUrl: string | undefined =  `${BASEURL()}${PASSRECOVERURL}`
    

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
      }

      try {
        const response: any = await RemoteClient.callRemoteService(
          {
            mark: '7BB631F51C04',
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
              
            },
            params: null,
            body: data,
          },
          
        )

        void LoggerManager.log('50FC661529A0', 'Restore Password', response)


        if (response.statusCode === 200) {
          result.success = 1

          if (response.body && Array.isArray(response.body.Data)) {
            result.body = response.body.Data
          }

          //No feedback
          //Not needed return feedback
        } else if (response.statusCode === 0) {
          //Timeout of the dead
          result.feedback.kind = 2
          result.feedback.title = 'Connection failed'
          result.feedback.message =
            'Please check your mobile data or wifi connection.'
          result.feedback.code = 'CONNECTION_TIMEOUT'
          result.feedback.mark = '554A6A962F0F'
        } else if (response.backend.Code) {
          //Another response from the backend

          result.success = -1 //Failed

          const strMark =
            response.backend && response.backend.Mark
              ? response.backend.Mark
              : '32355F4918BD'

          result.feedback.title = 'Error to Send Email Restore Password'
          result.feedback.message = response.backend.Message
          result.feedback.code = response.backend.Code
          result.feedback.mark = strMark
        } else {
          result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
            response.backend,
            '9AD15CBB828F',
            null
          )

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
          })
        }

        result.originalResponse = response //Always return the original response back
      } catch (error) {
       void LoggerManager.error(
          '5F4C57E20831',
          'Error Service Login => Restore Password',
         {sendToExternal:false,notSendToStorage:false,data:error}
        )

      }

      return result
    }

    static changePassword = async (data) => {
     
      const baseUrl: string | undefined =  `${BASEURL()}${PASSCHANGE}`
    

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
      }

      try {
        const response: any = await RemoteClient.callRemoteService(
          {
            mark: '90508D57A2E1',
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
              
            },
            params: null,
            body: data,
          },
          
        )

        void LoggerManager.log('287A6B8BBFFA', 'Change password', response )


        if (response.statusCode === 200) {
          result.success = 1

          if (response.body && Array.isArray(response.body.Data)) {
            result.body = response.body.Data
          }

          //No feedback
          //Not needed return feedback
        } else if (response.statusCode === 0) {
          //Timeout of the dead
          result.feedback.kind = 2
          result.feedback.title = 'Connection failed'
          result.feedback.message =
            'Please check your mobile data or wifi connection.'
          result.feedback.code = 'CONNECTION_TIMEOUT'
          result.feedback.mark = '554A6A962F0F'
        } else if (response.backend.Code) {
          //Another response from the backend

          result.success = -1 //Failed

          const strMark =
            response.backend && response.backend.Mark
              ? response.backend.Mark
              : '32355F4918BD'

          result.feedback.title = 'Error to send createDeliveryOrder'
          result.feedback.message = response.backend.Message
          result.feedback.code = response.backend.Code
          result.feedback.mark = strMark
        } else {
          result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
            response.backend,
            '9AD15CBB828F',
            null
          )

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
          })
        }

        result.originalResponse = response //Always return the original response back
      } catch (error) {
       void LoggerManager.error(
          'BC2002ACB9B6',
          'Error Service Login => recover password',
          {sendToExternal:false,notSendToStorage:false,data:error}
        )

      }

      return result
    }
    
    static checkToken  = async (auth) => { 
     
      const baseUrl: string | undefined =  `${BASEURL()}${AUTHURL}`
      
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
      }

      try {
        const response: any = await RemoteClient.callRemoteService(
          {
            mark: '79C00696FE74',
            method: 'post',
            url: [baseUrl + PATH_CHECK_TOKEN],
            timeout: CommonConstants._TIMEOUT_01,
            timeoutCancel: CommonConstants._TIMEOUT_CANCEL_01,
          
            headers: {
              ...HEADERS,
              Authorization: auth
              
            },
            params: null,
            body: null,
          },
          
        )

        await LoggerManager.log('5B13FC8739FA', 'CHECK TOKEN', response)


        if (response.statusCode === 200) {
          result.success = 1

          if (response.body && Array.isArray(response.body.Data)) {
            result.body = response.body.Data
          }

          //No feedback
          //Not needed return feedback
        } else if (response.statusCode === 0) {
          //Timeout of the dead
          result.feedback.kind = 2
          result.feedback.title = 'Connection failed'
          result.feedback.message =
            'Please check your mobile data or wifi connection.'
          result.feedback.code = 'CONNECTION_TIMEOUT'
          result.feedback.mark = '4E173097AA37'
        } else if (response.backend.Code) {
          //Another response from the backend

          result.success = -1 //Failed

          const strMark =
            response.backend && response.backend.Mark
              ? response.backend.Mark
              : '197E2D9CD855'

          result.feedback.title = 'Token is out'
          result.feedback.message = response.backend.Message
          result.feedback.code = response.backend.Code
          result.feedback.mark = strMark
        } else {
          result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
            response.backend,
            '58CE856E2B58',
            null
          )

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
          })
        }

        result.originalResponse = response //Always return the original response back
      } catch (error) {
      void LoggerManager.error(
          'EEFEF9112DC1',
          'Error Service checkToken => checkToken',
          {sendToExternal:false,notSendToStorage:false,data:error}
        )

      }

      return result
    }

    static authTokenProfile  = async (auth) => { 
     
      const baseUrl: string | undefined =  `${BASEURL()}${SYSTEMBINARYURL}`
      
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
      }

      try {
        const response: any = await RemoteClient.callRemoteService(
          {
            mark: '9D7DE4FB8112',
            method: 'post',
            url: [baseUrl + PATH_AUTH_AVATAR],
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
              Authorization: auth
              
            },
            params: null,
            body: null,
          },
          
        )

        void LoggerManager.log('D75C0B3A55E9', 'system binary auth', response)


        if (response.statusCode === 200) {
          result.success = 1

          if (response.body && Array.isArray(response.body.Data)) {
            result.body = response.body.Data
          }

          //No feedback
          //Not needed return feedback
        } else if (response.statusCode === 0) {
          //Timeout of the dead
          result.feedback.kind = 2
          result.feedback.title = 'Connection failed'
          result.feedback.message =
            'Please check your mobile data or wifi connection.'
          result.feedback.code = 'CONNECTION_TIMEOUT'
          result.feedback.mark = '554A6A962F0F'
        } else if (response.backend.Code) {
          //Another response from the backend

          result.success = -1 //Failed

          const strMark =
            response.backend && response.backend.Mark
              ? response.backend.Mark
              : '32355F4918BD'

          result.feedback.title = 'Error to get system binary auth'
          result.feedback.message = response.backend.Message
          result.feedback.code = response.backend.Code
          result.feedback.mark = strMark
        } else {
          result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback(
            response.backend,
            '9AD15CBB828F',
            null
          )

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
          })
        }

        result.originalResponse = response //Always return the original response back
      } catch (error) {
      void LoggerManager.error(
          '8409ABB1F34F',
          'Error Service authTokenProfile => authTokenProfile',
          {sendToExternal:false,notSendToStorage:false,data:error}
        )

      }

      return result
    }

    static getAvatar = async (auth,data) => { 

        let nullable: OriginalResponse | null | undefined
        
        const baseUrl: string = BASEURL() + SYSTEMBINARYURL
        
         const result = {
            success: 0,
            feedback: {
                title: null ? null: '',
                message: null ? null: '',
                code: '',
                mark: '',
                kind: 0,
                buttons: [{}]
            },
            body: null?null:{},
            originalResponse: nullable
        }

        try {

            const response = await RemoteClient.callRemoteService(
                {
                    mark: '7D6E30E5CF3D',
                    method: 'get',
                    url: [
                        baseUrl
                    ],
                    timeout: CommonConstants._TIMEOUT_01,
                    timeoutCancel: CommonConstants._TIMEOUT_CANCEL_01,
                    requestInterceptor: [],
                    responseInterceptor: [
                        {
                            onSuccess: responseInterceptor,
                            onReject: errorInterceptor
                        }
                    ],
                    headers: {
                        ...HEADERS,
                        Authorization: auth
                    },
                    params: data,
                    body: null,
                },
                
            )

            if (response.statusCode === 200) {

                result.success = 1

                if (response.body &&
                    Array.isArray(response.body.Data)) {

                    result.body = response.body.Data

                }

                //No feedback
                //Not needed return feedback

            }
            else if (response.statusCode === 0) {

                //Timeout of the dead
                result.feedback.kind = 2
                result.feedback.title = 'Connection failed'
                result.feedback.message = 'Please check your mobile data or wifi connection.'
                result.feedback.code = 'CONNECTION_TIMEOUT'
                result.feedback.mark = '00095F68C6F6'

            }
            else if (response.backend.Code) { //Another response from the backend

                result.success = -1 //Failed

                const strMark = response.backend && response.backend.Mark ? response.backend.Mark : '47B31E7AE825'

                result.feedback.title = 'Error to send getBusinessKind'
                result.feedback.message = response.backend.Message
                result.feedback.code = response.backend.Code
                result.feedback.mark = strMark

            }
            else {

              result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback( response.backend,
                                                                                       '808F5A569BB6',
                                                                                       null )

              /*
                result.feedback.title = "Unhandled main server response"
                result.feedback.message = "Unhandled main server response. Please contact with technical support"
                result.feedback.mark = response.backend && response.backend.Mark ? response.backend.Mark : "DB84788B473B"
              */

            }

            //Add default buttons to dialog alert
            if (result.feedback.buttons.length === 0) {

                result.feedback.buttons.push(
                    {
                        text: 'Close',
                        onPress: () => { console.log('true')} //To see the feedback when the button is pressed
                    }
                )

            }

            result.originalResponse = response //Always return the original response back

        }
        catch (error) {

           void LoggerManager.error( '2993CF1DFFF7', 'Error Service Dispatcher => getBusinessKind', {sendToExternal:false,notSendToStorage:false,data:error} )
            
        }

        return result

    }

    static getActions = async (auth,data) => {

        let nullable: OriginalResponse | null | undefined
        
        const baseUrl: string = BASEURL() + USERURL + PATH_ACTION
        
         const result = {
            success: 0,
            feedback: {
                title: null ? null: '',
                message: null ? null: '',
                code: '',
                mark: '',
                kind: 0,
                buttons: [{}]
            },
            body: null?null:{},
            originalResponse: nullable
        }

        try {

            const response = await RemoteClient.callRemoteService(
                {
                    mark: '7D6E30E5CF3D',
                    method: 'get',
                    url: [
                        baseUrl
                    ],
                    timeout: CommonConstants._TIMEOUT_01,
                    timeoutCancel: CommonConstants._TIMEOUT_CANCEL_01,
                    requestInterceptor: [],
                    responseInterceptor: [
                        {
                            onSuccess: responseInterceptor,
                            onReject: errorInterceptor
                        }
                    ],
                    headers: {
                        ...HEADERS,
                        Authorization: auth
                    },
                    params: data,
                    body: null,
                },
                
            )

            if (response.statusCode === 200) {

                result.success = 1

                if (response.body &&
                    Array.isArray(response.body.Data)) {

                    result.body = response.body.Data

                }

                //No feedback
                //Not needed return feedback

            }
            else if (response.statusCode === 0) {

                //Timeout of the dead
                result.feedback.kind = 2
                result.feedback.title = 'Connection failed'
                result.feedback.message = 'Please check your mobile data or wifi connection.'
                result.feedback.code = 'CONNECTION_TIMEOUT'
                result.feedback.mark = '00095F68C6F6'

            }
            else if (response.backend.Code) { //Another response from the backend

                result.success = -1 //Failed

                const strMark = response.backend && response.backend.Mark ? response.backend.Mark : '47B31E7AE825'

                result.feedback.title = 'Error to send getBusinessKind'
                result.feedback.message = response.backend.Message
                result.feedback.code = response.backend.Code
                result.feedback.mark = strMark

            }
            else {

              result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback( response.backend,
                                                                                       '808F5A569BB6',
                                                                                       null )

              /*
                result.feedback.title = "Unhandled main server response"
                result.feedback.message = "Unhandled main server response. Please contact with technical support"
                result.feedback.mark = response.backend && response.backend.Mark ? response.backend.Mark : "DB84788B473B"
              */

            }

            //Add default buttons to dialog alert
            if (result.feedback.buttons.length === 0) {

                result.feedback.buttons.push(
                    {
                        text: 'Close',
                        onPress: () => { console.log('true')} //To see the feedback when the button is pressed
                    }
                )

            }

            result.originalResponse = response //Always return the original response back

        }
        catch (error) {

           void LoggerManager.error( '2993CF1DFFF7', 'Error Service Dispatcher => getBusinessKind', {sendToExternal:false,notSendToStorage:false,data:error} )
            
        }

        return result

    }
      
    static exampleGet = async (user: User) => {

        let nullable: OriginalResponse | null | undefined
        
        const baseUrl: string = BASEURL() + AUTHURL + '/login'
        
         const result = {
            success: 0,
            feedback: {
                title: null ? null: '',
                message: null ? null: '',
                code: '',
                mark: '',
                kind: 0,
                buttons: [{}]
            },
            body: null?null:{},
            originalResponse: nullable
        }

        try {

            const response = await RemoteClient.callRemoteService(
                {
                    mark: '7D6E30E5CF3D',
                    method: 'get',
                    url: [
                        baseUrl
                    ],
                    timeout: CommonConstants._TIMEOUT_01,
                    timeoutCancel: CommonConstants._TIMEOUT_CANCEL_01,
                    requestInterceptor: [],
                    responseInterceptor: [
                        {
                            onSuccess: responseInterceptor,
                            onReject: errorInterceptor
                        }
                    ],
                    headers: {
                        ...HEADERS,
                        //Authorization: auth
                    },
                    params: user,
                    body: null,
                },
                
            )

            if (response.statusCode === 200) {

                result.success = 1

                if (response.body &&
                    Array.isArray(response.body.Data)) {

                    result.body = response.body.Data

                }

                //No feedback
                //Not needed return feedback

            }
            else if (response.statusCode === 0) {

                //Timeout of the dead
                result.feedback.kind = 2
                result.feedback.title = 'Connection failed'
                result.feedback.message = 'Please check your mobile data or wifi connection.'
                result.feedback.code = 'CONNECTION_TIMEOUT'
                result.feedback.mark = '00095F68C6F6'

            }
            else if (response.backend.Code) { //Another response from the backend

                result.success = -1 //Failed

                const strMark = response.backend && response.backend.Mark ? response.backend.Mark : '47B31E7AE825'

                result.feedback.title = 'Error to send getBusinessKind'
                result.feedback.message = response.backend.Message
                result.feedback.code = response.backend.Code
                result.feedback.mark = strMark

            }
            else {

              result.feedback = CommonUtils.createUnhandledMainServerResponseFeedback( response.backend,
                                                                                       '808F5A569BB6',
                                                                                       null )

              /*
                result.feedback.title = "Unhandled main server response"
                result.feedback.message = "Unhandled main server response. Please contact with technical support"
                result.feedback.mark = response.backend && response.backend.Mark ? response.backend.Mark : "DB84788B473B"
              */

            }

            //Add default buttons to dialog alert
            if (result.feedback.buttons.length === 0) {

                result.feedback.buttons.push(
                    {
                        text: 'Close',
                        onPress: () => { console.log('true')} //To see the feedback when the button is pressed
                    }
                )

            }

            result.originalResponse = response //Always return the original response back

        }
        catch (error) {

           void LoggerManager.error( '2993CF1DFFF7', 'Error Service Dispatcher => getBusinessKind', {sendToExternal:false,notSendToStorage:false,data:error} )
            
        }

        return result

    }

    
}
