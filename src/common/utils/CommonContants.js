export default class CommonConstants {
  static _DATE_TIME_LONG_FORMAT_ISO8601_Millis = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

  static _DATE_TIME_LONG_FORMAT_01 = 'YYYY-MM-DD HH:mm:ss.SSS ZZ';
  static _DATE_TIME_LONG_FORMAT_02 = 'YYYY-MM-DDTHH:mm:ss.SSS@ZZ';
  static _DATE_TIME_LONG_FORMAT_03 = 'YYYY-MM-DD HH:mm:ss ZZ';
  static _DATE_TIME_LONG_FORMAT_04 = 'YYYY-MM-DD HH:mm ZZ';
  static _DATE_TIME_LONG_FORMAT_05 = 'YYYY-MM-DDTHH:mm:ss';
  static _DATE_TIME_LONG_FORMAT_06 = 'YYYY-MM-DDTHH-mm-ss@ZZ';
  static _DATE_TIME_LONG_FORMAT_07 = 'YYYY-MM-DDTHH-mm-ss-SSS@ZZ';
  static _DATE_TIME_LONG_FORMAT_08 = 'YYYY-MM-DDTHH-mm-ssZZ';
  static _DATE_TIME_LONG_FORMAT_09 = 'YYYY-MM-DD HH:mm:ss';
  static _DATE_TIME_LONG_FORMAT_10 = 'YYYY-MM-DD';
  static _DATE_TIME_LONG_FORMAT_11 = 'YYYY-MM-DDTHH-mm-ss@Z';
  static _DATE_TIME_LONG_FORMAT_12 = 'YYYY-MM-DD-HH';
  static _DATE_TIME_LONG_FORMAT_13 = 'YYYY-MM-DD HH:mm:ss.SSS';
  static _DATE_TIME_LONG_FORMAT_14 = 'YYYY-MM-DD_HH-mm-ss-SSS';

  static _PREFIX_CRYPTED = 'crypted://';
  static _PREFIX_RSA = 'RSA://';

  static _CANCEL_MESSAGE = 'Timeout_Cancel';

  static _TIMEOUT_01 = 10000;
  static _TIMEOUT_CANCEL_01 = 9000;

  static _TIMEOUT_02 = 5000;
  static _TIMEOUT_CANCEL_02 = 4000;

  static _TIMEOUT_03 = 30000;
  static _TIMEOUT_CANCEL_03 = 29000;

  static _PATH_LOGIN = '/login';
  static _PATH_LOGOUT = '/logout';

  static _GOOGLE_MAP_API_KEY = '';
  static _GOOGLE_MAP_PLACE_BASE_URL =
    'https://maps.googleapis.com/maps/api/place';

  static _REQUEST_LOG_PREFIX = 'request#log#';
  static _APP_LOG_CONFIG_PREFIX = 'app#log#config';
  static _APP_LOG_PREFIX = 'app#log#';
  static _DELIVERY_PREFIX = 'delivery#';

  static _ROLLBAR_API_KEY =  '9367d35d8f674393816e65653aa4e9f1';

  static _JSON_VERSION_DISPATCHER_URL =
    'https://backendgateway.app/app/updates/kk-dispatcher/version.json';
  static _UPLOAD_FILE_URL =
    'https://backendgateway.app/app/logs/full/kk-dispatcher/upload.php';
}
