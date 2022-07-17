import {v4 as uuid} from 'uuid';

import moment from 'moment';


export default class LoggerManagerUtils {

  static getUUIDV4() {

    return uuid();

  }

  static getCurrentDateAndTime( strFormat ) {

    let result = null;

    try {

      if ( strFormat ) {

        result = moment().format( strFormat );

      }
      else {

        result = moment();

      }

    }
    catch ( error ) {

      //

    }

    return result;

  }

}
