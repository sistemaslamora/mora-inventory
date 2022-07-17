// import AsyncStorage from '@react-native-async-storage/async-storage';

//import { Platform } from 'react-native';
//import { getVersion, getBuildNumber } from "react-native-device-info";

//import Rollbar from 'rollbar';

import CommonConstants from './CommonContants';

import LoggerManagerUtils from './LoggerManagerUtils';

export default class LoggerManager {
  static mainInstanceJSONConfig = null;

  static mainInstance = null;

  static level = LoggerManager.ERROR();

  //static strLastMark = "";
  //static lastDebugMark = null;

  static currentStoreDate = LoggerManagerUtils.getCurrentDateAndTime(
    CommonConstants._DATE_TIME_LONG_FORMAT_12
  );

  static logInBuffer = [];

  static strUserName = null;

  static ERROR() {
    return 3;
  }

  static WARN() {
    return 4;
  }

  static INFO() {
    return 5;
  }

  static DEBUG() {
    return 6;
  }

  static async initJSONConfig() {
    let result = {
      useLog: 1, //0 = no use log, 1 = use
      logLevel: 'info', //Info level as minimal by default
      logTo: '#console#,#external#',
      fullBackground: false,
    };

    const strMainLoggerConfig = await AsyncStorage.getItem('app#log#config');

    if (strMainLoggerConfig) {
      try {
        const mainLoggerJSONConfig = JSON.parse(strMainLoggerConfig);

        result = mainLoggerJSONConfig;
      } catch (error) {
        //
      }
    }

    return result;
  }

  static async persistJSONConfig(logManagerConfig) {
    try {
      await AsyncStorage.setItem(
        CommonConstants._APP_LOG_CONFIG_PREFIX,
        JSON.stringify(logManagerConfig)
      );
    } catch (error) {
      //
    }
  }

  static fromLogLevelToLevel(strLogLevel) {
    let intResult = -1;

    if (strLogLevel === 'debug') {
      intResult = LoggerManager.DEBUG();
    } else if (strLogLevel === 'info') {
      intResult = LoggerManager.INFO();
    } else if (strLogLevel === 'warn') {
      LoggerManager.level = LoggerManager.WARN();
    } else {
      LoggerManager.level = LoggerManager.ERROR();
    }

    return intResult;
  }

  static fromLevelToLogLevel(intLevel) {
    let strResult = '';

    if (intLevel === LoggerManager.DEBUG()) {
      strResult = 'debug';
    } else if (intLevel === LoggerManager.INFO()) {
      strResult = 'info';
    } else if (intLevel === LoggerManager.WARN()) {
      strResult = 'warn';
    } else {
      strResult = 'error';
    }

    return strResult;
  }

  static setUserName(strUserName) {
    if (strUserName) {
      LoggerManager.strUserName = strUserName;
    }
  }

  static resetUserName() {
    LoggerManager.strUserName = null;
  }

  static getUserName() {
    return LoggerManager.strUserName;
  }

  static async init() {
    LoggerManager.mainInstanceJSONConfig = await LoggerManager.initJSONConfig();

    await LoggerManager.persistJSONConfig(LoggerManager.mainInstanceJSONConfig);

    if (LoggerManager.mainInstanceJSONConfig.useLog === 1) {
      LoggerManager.level = LoggerManager.fromLogLevelToLevel(
        LoggerManager.mainInstanceJSONConfig.logLevel
      );

      if (LoggerManager.mainInstanceJSONConfig.logTo.includes('#external#')) {
        this.mainInstance = new Rollbar({
          accessToken: CommonConstants._ROLLBAR_API_KEY,
          captureUncaught: true,
          captureUnhandledRejections: true,
          //version: getVersion() + "-" + getBuildNumber(),
          captureIp: true,
          payload: {
            environment: 'Produccion',
            //context: process.env.REACT_APP_DEVELOPER_CONTEXT,
            client: {
              javascript: {
                source_map_enabled: true,
                //   code_version: getVersion() + "-" + getBuildNumber(), //+ '.' + Platform.OS,
              },
            },
          },
        });
      }
    }
  }

  static async sendLogToConsole(intLevel, strMark, strMessage, options) {
    try {
      let strPrefix = `${strMark} :anonymous: `;

      if (LoggerManager.strUserName) {
        strPrefix = strMark + ':' + LoggerManager.strUserName + ': ';
      }

      if (intLevel === LoggerManager.ERROR()) {
        const strStyle = LoggerManager.mainInstanceJSONConfig.fullBackground
          ? 'background: red; color: red; font-weight: bold;'
          : 'color: red; font-weight: bold;';

        console.log('%c' + strPrefix + strMessage, strStyle);

        if (options && options.data instanceof Error) {
          console.log(
            '%c' +
              strPrefix +
              'Error message: ' +
              (options.data.message
                ? options.data.message
                : 'No error message available'),
            strStyle
          );
          console.error('%c' + strPrefix, strStyle, options.data);
        } else if (options && options.data instanceof Object) {
          console.log('%c' + strPrefix, strStyle, options.data);
        }
      } else if (intLevel === LoggerManager.WARN()) {
        const strStyle = LoggerManager.mainInstanceJSONConfig.fullBackground
          ? 'background: #ff8000; color: white; font-weight: bold;'
          : 'color: #ff8000; font-weight: bold;';

        console.log('%c' + strPrefix + strMessage, strStyle);

        if (options && options.data instanceof Object) {
          console.log('%c' + strPrefix, strStyle, options.data);
        }
      } else if (intLevel === LoggerManager.INFO()) {
        const strStyle = LoggerManager.mainInstanceJSONConfig.fullBackground
          ? 'background: green; color: white; font-weight: bold;'
          : 'color: green; font-weight: bold;';

        console.log('%c' + strPrefix + strMessage, strStyle);

        if (options && options.data instanceof Object) {
          console.log('%c' + strPrefix, strStyle, options.data);
        }
      } else if (intLevel === LoggerManager.DEBUG()) {
        const strStyle = LoggerManager.mainInstanceJSONConfig.fullBackground
          ? 'background: #0080ff; color: white; font-weight: bold;'
          : 'color: #0080ff; font-weight: bold;';

        console.log('%c' + strPrefix + strMessage, strStyle);

        if (options && options.data instanceof Object) {
          console.log('%c' + strPrefix, strStyle, options.data);
        }
      }
    } catch (error) {
      //
    }
  }

  static async sendLogToExternalRollbar(
    intLevel,
    strMark,
    strMessage,
    options
  ) {
    try {
      let strPrefix = (strMark ? strMark : '') + ':anonymous:';

      if (LoggerManager.strUserName) {
        strPrefix = strMark + ':' + LoggerManager.strUserName + ':';
      }

      if (intLevel === LoggerManager.ERROR()) {
        if (options && options.data instanceof Error) {
          options.Mark = strMark; //Inject the mark to error object
          LoggerManager.mainInstance.error(options.data);
        } else {
          LoggerManager.mainInstance.error(strPrefix + strMessage);
        }
      } else if (intLevel === LoggerManager.WARN()) {
        if (options && options.data instanceof Object) {
          LoggerManager.mainInstance.warning(
            strPrefix + strMessage + ':' + JSON.stringify(options.data)
          );
        } else {
          LoggerManager.mainInstance.warning(strPrefix + strMessage);
        }
      } else if (intLevel === LoggerManager.INFO()) {
        if (options && options.data instanceof Object) {
          LoggerManager.mainInstance.info(
            strPrefix + strMessage + ':' + JSON.stringify(options.data)
          );
        } else {
          LoggerManager.mainInstance.info(strPrefix + strMessage);
        }
      } else if (intLevel === LoggerManager.DEBUG()) {
        if (options && options.data instanceof Object) {
          LoggerManager.mainInstance.debug(
            strPrefix + strMessage + ':' + JSON.stringify(options.data)
          );
        } else {
          LoggerManager.mainInstance.debug(strPrefix + strMessage);
        }
      }
    } catch (error) {
      //
    }
  }

  static async sendLogToStorage(intLevel, strMark, strMessage, options) {
    try {
      let jsonLogToPersist = {
        Id: options.LogId || LoggerManagerUtils.getUUIDV4(),
        UserName: LoggerManager.strUserName
          ? LoggerManager.strUserName
          : 'anonymous',
        Kind: '',
        Mark: '',
        Message: '',
        Data: '',
        Location: {
          latitude: '',
          longitude: '',
        },
      };

      if (options && options.data instanceof Object) {
        jsonLogToPersist.Kind = LoggerManager.fromLevelToLogLevel(intLevel);
        jsonLogToPersist.Mark = strMark;
        jsonLogToPersist.Message = strMessage;
        jsonLogToPersist.Data = options.data;
      } else {
        jsonLogToPersist.Kind = LoggerManager.fromLevelToLogLevel(intLevel);
        jsonLogToPersist.Mark = strMark;
        jsonLogToPersist.Message = strMessage;
        jsonLogToPersist.Data = null;
      }

      //Add the location if getLocation callback is passed
      if (options.getLocation) {
        const location = await options.getLocation();

        if (location && location.coords) {
          jsonLogToPersist.Location = location.coords;
        }
      }

      const currentDate = LoggerManagerUtils.getCurrentDateAndTime(
        CommonConstants._DATE_TIME_LONG_FORMAT_12
      );

      if (currentDate !== LoggerManager.currentStoreDate) {
        LoggerManager.logInBuffer = []; //Clean when hour change

        LoggerManager.currentStoreDate = currentDate;
      }

      //Check for empty array
      if (LoggerManager.logInBuffer.length === 0) {
        try {
          //Try to ge the entry with old data
          const strOldEntries = await AsyncStorage.getItem(
            'app#log#' + LoggerManager.currentStoreDate
          );

          if (strOldEntries) {
            //Valid data?

            //Try to reload the old entries in the store
            LoggerManager.logInBuffer = JSON.parse(strOldEntries);

            //Final check the data loaded is a valid array no a object
            if (Array.isArray(LoggerManager.logInBuffer) === false) {
              LoggerManager.logInBuffer = []; //Return the to original empty array
            }
          }
        } catch (error) {
          LoggerManager.logInBuffer = []; //Stay sure valid empty array
        }
      }

      LoggerManager.logInBuffer.push(jsonLogToPersist);

      //Not await to persist the logs
      // AsyncStorage.setItem(
      //   CommonConstants._APP_LOG_PREFIX + LoggerManager.currentStoreDate,
      //   JSON.stringify(LoggerManager.logInBuffer)
      // );
    } catch (error) {
      console.log(error); //Last resource
    }
  }

  static async commonLog(
    intLevel,
    strMark,
    strMessage,
    options = {
      sendToExternal: false,
      notSendToStorage: false,
      data: null,
    }
  ) {
    const strLogId = LoggerManagerUtils.getUUIDV4();

    try {
      if (
        intLevel <= LoggerManager.level &&
        LoggerManager.mainInstanceJSONConfig.logTo
      ) {
        if (!options) {
          options = {
            sendToExternal: false,
            notSendToStorage: false,
            data: null,
          };
        }

        if (options.sendToExternal === undefined) {
          options.sendToExternal = false;
        }

        if (options.notSendToStorage === undefined) {
          options.notSendToStorage = false;
        }

        if (options.data === undefined) {
          options.data = null;
        }

        options.LogId = strLogId;

        if (LoggerManager.mainInstanceJSONConfig.logTo.includes('#console#')) {
          LoggerManager.sendLogToConsole(
            intLevel,
            strMark,
            strMessage,
            options
          );
        }

        if (
          LoggerManager.mainInstanceJSONConfig.logTo.includes('#external#') &&
          options.sendToExternal
        ) {
          LoggerManager.sendLogToExternalRollbar(
            intLevel,
            strMark,
            strMessage,
            options
          );
        }

        if (
          LoggerManager.mainInstanceJSONConfig.useLog === 1 &&
          options.notSendToStorage === false
        ) {
          LoggerManager.sendLogToStorage(
            intLevel,
            strMark,
            strMessage,
            options
          );
        }
      }
    } catch (error) {
      //
    }

    return strLogId;
  }

  static async error(
    strMark,
    strMessage,
    options = {
      sendToExternal: false,
      notSendToStorage: false,
      data: null,
    }
  ) {
    return await LoggerManager.commonLog(
      LoggerManager.ERROR(),
      strMark,
      strMessage,
      options
    );
  }

  static async warn(
    strMark,
    strMessage,
    options = {
      sendToExternal: false,
      notSendToStorage: false,
      data: null,
    }
  ) {
    return await LoggerManager.commonLog(
      LoggerManager.WARN(),
      strMark,
      strMessage,
      options
    );
  }

  static async info(
    strMark,
    strMessage,
    options = {
      sendToExternal: false,
      notSendToStorage: false,
      data: null,
    }
  ) {
    return await LoggerManager.commonLog(
      LoggerManager.INFO(),
      strMark,
      strMessage,
      options
    );
  }

  static async log(
    strMark,
    strMessage,
    options = {
      sendToExternal: false,
      notSendToStorage: false,
      data: null,
    }
  ) {
    return await LoggerManager.commonLog(
      LoggerManager.INFO(),
      strMark,
      strMessage,
      options
    );
  }

  static async debug(
    strMark,
    strMessage,
    options = {
      sendToExternal: false,
      notSendToStorage: false,
      data: null,
    }
  ) {
    return await LoggerManager.commonLog(
      LoggerManager.DEBUG(),
      strMark,
      strMessage,
      options
    );
  }
}
