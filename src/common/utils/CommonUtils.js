import {v4 as uuid} from 'uuid';

import moment from 'moment';


//import { getState, sendLogsEmail } from "./Helper";

import CommonConstants from './CommonContants';

import LoggerManager from './LoggerManager';

export default class CommonUtils {
  static getUUIDV4() {
    return uuid();
  }

  static getCurrentDateAndTime(strFormat) {
    let result = null;

    try {
      if (strFormat) {
        result = moment().format(strFormat);
      } else {
        result = moment();
      }
    } catch (error) {
      //
    }

    return result;
  }

  static getCurrentDateAndTimeDecDays(intDays, strFormat) {
    let result = null;

    try {
      if (strFormat) {
        result = moment().subtract(intDays, 'days').format(strFormat);
      } else {
        result = moment().subtract(intDays, 'days'); //moment().format( CommonUtilities.getCurrentTimeZoneId() );
      }
    } catch (error) {
      //
    }

    return result;
  }

  static async clearAllOldLog() {
    try {
      await CommonUtils.clearOldXHourLog(
        CommonConstants._REQUEST_LOG_PREFIX,
        1
      );

      await CommonUtils.clearOldXHourLog(CommonConstants._APP_LOG_PREFIX, 1);

      // CommonUtils.clearOldXLog( CommonConstants._DELIVERY_PREFIX, 20 );
    } catch (error) {
      //
    }
  }

  static async clearOldXHourLog(strLogPrefix, intDays) {
    try {
      const lastDays = []; //Last N days

      for (let intDay = intDays - 1; intDay >= 0; intDay--) {
        lastDays.push(
          CommonUtils.getCurrentDateAndTimeDecDays(
            intDay,
            CommonConstants._DATE_TIME_LONG_FORMAT_10
          )
        );
      }

      LoggerManager.log('3D0418ED8629', lastDays); //Last N days

      const storeKeys = ((await AsyncStorage.getAllKeys()) || []).filter(
        (item) => item.startsWith(strLogPrefix)
      ); //CommonConstants._REQUEST_LOG_PREFIX ) );

      LoggerManager.log('AB18C4BEEB73', storeKeys);

      for (let intIndex = 0; intIndex < storeKeys.length; intIndex++) {
        const strStoreKey = storeKeys[intIndex];

        const strStoreKeyDateAndHour = strStoreKey
          .replace(strLogPrefix, '')
          .split('-');

        const strStoreKeyOnlyDate =
          strStoreKeyDateAndHour[0] +
          '-' +
          strStoreKeyDateAndHour[1] +
          '-' +
          strStoreKeyDateAndHour[2];

        if (lastDays.includes(strStoreKeyOnlyDate) === false) {
          LoggerManager.log(
            '0BF65FC5343',
            'Deleting entry ' + strStoreKeyDateAndHour.join('-')
          );

          await AsyncStorage.removeItem(strStoreKey);
        } else {
          LoggerManager.log(
            '8A064ED5BCCD',
            'Keeping entry ' + strStoreKeyDateAndHour.join('-')
          );
        }
      }

      //process.exit( 0 );
    } catch (error) {
      //
    }
  }

  static async clearOldXLog(strLogPrefix, intDays) {
    try {
      const lastDays = []; //Last N days

      for (let intDay = intDays - 1; intDay >= 0; intDay--) {
        lastDays.push(
          CommonUtils.getCurrentDateAndTimeDecDays(
            intDay,
            CommonConstants._DATE_TIME_LONG_FORMAT_10
          )
        );
      }

      LoggerManager.log('2616F4409B3E', lastDays); //Last N days

      const storeKeys = ((await AsyncStorage.getAllKeys()) || []).filter(
        (item) => item.startsWith(strLogPrefix)
      ); //CommonConstants._REQUEST_LOG_PREFIX ) );

      LoggerManager.log('6F4B785CA2B3', storeKeys);

      for (let intIndex = 0; intIndex < storeKeys.length; intIndex++) {
        const strStoreKey = storeKeys[intIndex];

        const strStoreKeyUserAndDate = strStoreKey
          .replace(strLogPrefix, '')
          .split('#'); //"delivery#username#2021-01-12" => [ "username", "2021-01-12" ]

        let strStoreKeyOnlyDate = '';

        if (strStoreKeyUserAndDate.length >= 2) {
          strStoreKeyOnlyDate = strStoreKeyUserAndDate[1]; //[ "username", "2021-01-12" ]
        }

        if (lastDays.includes(strStoreKeyOnlyDate) === false) {
          LoggerManager.log(
            '7DC68DEC4887',
            'Deleting entry ' + strStoreKeyOnlyDate
          );

          await AsyncStorage.removeItem(strStoreKey);
        } else {
          LoggerManager.log(
            'B26E4DB6B0BF',
            'Keeping entry ' + strStoreKeyOnlyDate
          );
        }
      }

      //process.exit( 0 );
    } catch (error) {
      //
    }
  }

  static createUnhandledMainServerResponseFeedback(
    backend,
    strCustomMark,
    strUserName,
    options = {
      notAddCloseButton: false,
    }
  ) {
    const result = {
      title: null,
      message: null,
      code: '',
      mark: '',
      kind: 0, //0 = Regular feedback, 1 = Unhandled response feedback
      buttons: [],
    };

    try {
      if (!options) {
        options = {
          notAddCloseButton: false,
        };
      }

      if (options.notAddCloseButton === undefined) {
        options.notAddCloseButton = false;
      }

      const strCode =
        backend && backend.Code ? backend.Code : 'EMPTY_RESPONSE_CODE';
      const strMark = backend && backend.Mark ? backend.Mark : strCustomMark;

      result.title = 'Unhandled main server response';
      result.message =
        'Unhandled main server response. Please contact with technical support';
      result.code = strCode;
      result.mark = strMark;
      result.kind = 1; //Unhandled response feedback

      //Add the button to send logs by email
      /*  result.feedback.buttons.push({
        text: "Send logs by email",
        onPress: async () => {
          if (!strUserName) {
            const {
              secure: { user },
            } = getState();

            strUserName =
              user.session && user.session.sysUser
              user.session.sysUser.Name
                : null;
          }

          await sendLogsEmail(
            strUserName,
            result.title + "\nCode:" + strCode + "\nMark:" + strMark
          );
        }, //To see the feedback when the button is pressed
      });*/

      if (options.notAddCloseButton === false) {
        result.feedback.buttons.push({
          text: 'Close',
          onPress: () => {}, //To see the feedback when the button is pressed
        });
      }
    } catch (error) {
      //
    }

    return result;
  }

  static parseJSON(strJSONToParse) {
    let result = null; //Safe empty object

    try {
      result = JSON.parse(strJSONToParse);
    } catch (error) {
      //
    }

    return result;
  }
}
