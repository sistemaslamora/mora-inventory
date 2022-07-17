// import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

import CommonConstants from './CommonContants';

import CommonUtils from './CommonUtils';

import LoggerManager from './LoggerManager';

export default class RemoteClient {
  static _HTTP_CODE_DESCRIPTION = {
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    499: 'WTF?', //No found in standard definition of http codes
  };

  static currentStoreDate = CommonUtils.getCurrentDateAndTime(
    CommonConstants._DATE_TIME_LONG_FORMAT_12
  );

  static requestLogInBuffer = [];

  static parseBodyToJSON(data) {
    let result = data.body;

    try {
      if (data.body) {
        //Only if result body exists

        if (typeof data.body !== 'object') {
          const jsonResponse = JSON.parse(data.body);

          result = jsonResponse;
        }
      }
    } catch (error) {
      //Cannot parse the response as JSON
      LoggerManager.error('661F2D4BF869', 'Error RemoteClient', {
        data: error,
      }); //Not send to external by default

      //Send log to rollbar
      // sendError( "Error RemoteClient", error ); //Send error to rollbar

      // console.log( "Error RemoteClient", error );
    }

    return result;
  }

  static fillBackendSection(data) {
    let result = {
      Code: '',
      Message: '',
      Mark: '',
    };

    try {
      if (data.body) {
        //Only if result body exists

        if (data.body.Code) {
          result.Code = data.body.Code;
        }

        if (data.body.Message) {
          result.Message = data.body.Message;
        }

        if (data.body.Mark) {
          result.Mark = data.body.Mark;
        }
      }
    } catch (error) {
      LoggerManager.error('8BE8350E36A7', 'Error RemoteClient', {
        data: error,
      }); //Not send to external by default
      //Send log to rollbar
      // sendError( "Error RemoteClient", error ); //Send error to rollbar

      // console.log( "Error RemoteClient", error );
    }

    return result;
  }

  static async internalCallRemoteService(options) {
    const result = {
      service: '',
      startDate: CommonUtils.getCurrentDateAndTime(
        CommonConstants._DATE_TIME_LONG_FORMAT_ISO8601_Millis
      ),
      endDate: '',
      statusCode: -10000, //Default value
      statusDescription: '',
      headers: null,
      body: null,
      backend: {
        Code: '',
        Message: '',
        Mark: '',
      },
      error: {
        message: '',
      },
    };

    try {
      if (options.method && options.url && options.url.length > 0) {
        const cancelTokenSource = axios.CancelToken.source(); //Get the cancel token

        if (options.timeout > 0 || !options.timeout) {
          if (!options.timeout) {
            options.timeout = 10000;
          }

          if (!options.timeoutCancel) {
            if (options.timeout - 1000 > 0) {
              options.timeoutCancel = options.timeout - 1000;
            } else {
              options.timeoutCancel = options.timeout;
            }
          }

          setTimeout(() => {
            //Automatic cancel using automatic timeout
            //timeoutCancel > 0 or timeoutCancel != undefined or timeoutCancel !== null
            cancelTokenSource.cancel(CommonConstants._CANCEL_MESSAGE);
          }, options.timeoutCancel);
        }

        if (options.manualCancel) {
          //Check if passed manualCancel callback

          //Send manual cancel callback to save reference to cancelTokenSource and allow to cancel on push button in the ui (Manual Cancel)
          options.manualCancel(cancelTokenSource, options.timeoutCancel); //Send back the cancel token source, usefull to button cancel,
          //allow to user manual cancel on press button cancel in ui
        }

        let response = null;

        const httpRequest = axios.create();

        if (
          Array.isArray(options.requestInterceptor) &&
          options.requestInterceptor.length > 0
        ) {
          for (let interceptor of options.requestInterceptor) {
            httpRequest.interceptors.request.use(
              interceptor.onSuccess,
              interceptor.onReject
            );
          }
        }

        if (
          Array.isArray(options.responseInterceptor) &&
          options.responseInterceptor.length > 0
        ) {
          for (let interceptor of options.responseInterceptor) {
            httpRequest.interceptors.response.use(
              interceptor.onSuccess,
              interceptor.onReject
            );
          }
        }

        try {
          response = await httpRequest.request({
            cancelToken: cancelTokenSource.token,
            method: options.method,
            baseURL: options.url[0],
            onUploadProgress: options.onUploadProgress, //Callback to get feedback when upload files see the axios documentation
            onDownloadProgress: options.onDownloadProgress, //Call back to get feedback when download files
            timeout: options.timeout,
            headers: options.headers,
            params: options.params || null, //Paramas by the case of GET and DELETE
            data: options.body || null, //Body json to case of POST and PUT
          });
        } catch (errorL2) {
          //sendError( "Error L2 RemoteClient", errorL2 ); //Send error to rollbar

          //console.log( "Error L2 RemoteClient", errorL2 );

          LoggerManager.error('A95A9A130193', 'Error L2 RemoteClient', {
            data: errorL2,
            sendToExternal: true,
          }); //Force to send to external

          if (!errorL2.response) {
            result.statusCode = 0; //Timeout code

            if (errorL2.message === CommonConstants._CANCEL_MESSAGE) {
              //Timeout triggered by cancel timer

              result.statusDescription = `timeout of ${options.timeoutCancel}ms exceeded (canceled)`;
              result.error.message = errorL2.message;
            } else {
              //Timeout triggered by axios

              result.statusDescription = errorL2.message;
              result.error.message = errorL2.message;
            }
          } else {
            //Other responses diferent of 2xx

            //This is not real error, is only the http reponse code is different of 2xx, example 400
            result.error.message = errorL2.message;

            result.statusCode = errorL2.response.status;
            result.statusDescription = errorL2.response.statusText;

            result.body = errorL2.response.data; //Copy the boyd data response

            if (
              options.headers &&
              options.headers['Content-Type'] === 'application/json'
            ) {
              result.body = RemoteClient.parseBodyToJSON(result);

              result.backend = RemoteClient.fillBackendSection(result);
            }
          }
        }

        result.service = options.method.toUpperCase() + ':' + options.url[0];

        //Log the params in the url of the request
        if (options.params) {
          const paramNames = Object.keys(options.params);

          let strParams = '';

          for (
            let intIndexParam = 0;
            intIndexParam < paramNames.length;
            intIndexParam++
          ) {
            //LoggerManager.log( "5493488E7F93", intIndexParam );

            //console.log( intIndexParam );

            if (strParams) {
              strParams =
                strParams +
                '&' +
                paramNames[intIndexParam] +
                '=' +
                options.params[paramNames[intIndexParam]];
            } else {
              strParams =
                '?' +
                paramNames[intIndexParam] +
                '=' +
                options.params[paramNames[intIndexParam]];
            }
          }

          result.service = result.service + strParams;
        }

        if (response) {
          //4xx http status code only??? or 5xx too?
          if (response.isAxiosError && response.response) {
            result.statusCode = response.response.status;

            if (result.statusCode === 200) {
              //Ok

              result.statusDescription = 'Success';
            } else if (!response.response.statusText) {
              //No status text defined for axios library

              //Handle ALL 4xx http status code. Just in case of needed. Axios is very particular library. In us english is "tricky library"
              if (result.statusCode >= 400 && result.statusCode <= 499) {
                if (result.statusCode <= 417) {
                  result.statusDescription =
                    RemoteClient._HTTP_CODE_DESCRIPTION[result.statusCode];
                } else {
                  result.statusDescription =
                    RemoteClient._HTTP_CODE_DESCRIPTION[499]; //WTF?
                }
              }
            } else {
              //Status text defined by axios library

              result.statusDescription = response.response.statusText;
            }

            result.body = response.response.data;
          } else {
            result.statusCode = response.status;

            if (result.statusCode === 200) {
              //Ok

              result.statusDescription = 'Success';
            } else {
              result.statusDescription = response.statusText;
            }

            result.body = response.data;
          }

          if (
            options.headers &&
            options.headers['Content-Type'] === 'application/json'
          ) {
            result.body = RemoteClient.parseBodyToJSON(result);

            result.backend = RemoteClient.fillBackendSection(result);
          }
        }

        result.headers = response && response.headers ? response.headers : null; //Copy the response headers from the backend.
      } else {
        if (!options.method) {
          result.statusCode = -100;
          result.statusDescription =
            'options.method field is null in parameter';
          result.error.message = result.statusDescription;
        } else if (!options.url) {
          result.statusCode = -200;
          result.statusDescription = 'options.url field is null in parameter';
          result.error.message = result.statusDescription;
        } else if (options.url.length === 0) {
          result.statusCode = -300;
          result.statusDescription =
            'options.url.length field is 0 in parameter';
          result.error.message = result.statusDescription;
        }
      }
    } catch (errorL1) {
      result.statusCode = -10001;
      result.statusDescription = errorL1.message;
      result.error.message = result.statusDescription;

      //sendError( "Error L1 RemoteClient", errorL1 );  //Send error to rollbar

      //console.log( "Error L1 RemoteClient", errorL1 );

      LoggerManager.error('0A8EC877033A', 'Error L1 RemoteClient', {
        data: errorL1,
        sendToExternal: true,
      });
    }

    result.endDate = CommonUtils.getCurrentDateAndTime(
      CommonConstants._DATE_TIME_LONG_FORMAT_ISO8601_Millis
    );

    return result;
  }

  static async callRemoteService(options) {
    let result = await RemoteClient.internalCallRemoteService(options);

    if (result) {
      //Save the request to log

      try {
        const currentDate = CommonUtils.getCurrentDateAndTime(
          CommonConstants._DATE_TIME_LONG_FORMAT_12
        );

        if (currentDate !== RemoteClient.currentStoreDate) {
          RemoteClient.requestLogInBuffer = []; //Clean when hour change

          RemoteClient.currentStoreDate = currentDate;
        }

        //Check for empty array
        if (RemoteClient.requestLogInBuffer.length === 0) {
          try {
            //Try to ge the entry with old data
            const strOldEntries = await AsyncStorage.getItem(
              CommonConstants._REQUEST_LOG_PREFIX +
                RemoteClient.currentStoreDate
            );

            if (strOldEntries) {
              //Valid data?

              //Try to reload the old entries in the store
              RemoteClient.requestLogInBuffer = JSON.parse(strOldEntries);

              //Final check the data loaded is a valid array no a object
              if (Array.isArray(RemoteClient.requestLogInBuffer) === false) {
                RemoteClient.requestLogInBuffer = []; //Return the to original empty array
              }
            }
          } catch (error) {
            RemoteClient.requestLogInBuffer = []; //Stay sure valid empty array
          }
        }

        const resultToLog = {
          id: CommonUtils.getUUIDV4(),
          mark: options.mark,
          service: result.service,
          startDate: result.startDate,
          endDate: result.endDate,
          statusCode: result.statusCode,
          statusDescription: result.statusDescription,
          headers: options.logRequestHeaders ? options.headers : {}, //Only if specific request log the request.headers
          requestBody: options.logRequestBody ? options.body : {}, //Only if specific request log the request.body
          requestParams: options.logRequestParams ? options.body : {}, //Only if specific request log the request.params
          responseBody: options.logResponseBody ? result.body : {}, //Only if specific request log the response.body
          responseHeaders: options.logResponseHeaders ? result.body : {}, //Only if specific request log the response.headers
          location: {
            latidude: '',
            longitude: '',
          },
          backend: {
            Code: result.backend.Code || null,
            Message: result.backend.Message || null,
            Mark: result.backend.Mark || null,
          },
          error: {
            message: result.error.message || null,
          },
        };

        //Add the location if getLocation callback is passed
        if (options.getLocation) {
          const location = await options.getLocation();

          if (location && location.coords) {
            resultToLog.location = location.coords;
          }
        }

        RemoteClient.requestLogInBuffer.push(resultToLog);

        // await AsyncStorage.setItem(
        //   CommonConstants._REQUEST_LOG_PREFIX + RemoteClient.currentStoreDate,
        //   JSON.stringify(RemoteClient.requestLogInBuffer)
        // );
      } catch (error) {
        console.log(error); //Last resource
      }
    }

    return result;
  }
}
