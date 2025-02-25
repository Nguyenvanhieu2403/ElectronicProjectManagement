import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class ConvertTimezoneService {

  constructor() { }

  formatDateISO(utcDateString: Date) {
    var timezone = 'Asia/Bangkok';
    const utcDate = moment.utc(utcDateString);
    const localDate = utcDate.tz(timezone);
    return localDate.format('yyyy-MM-DD');
  }
  formatDateVN(utcDateString: Date) {
    var timezone = 'Asia/Bangkok';
    const utcDate = moment.utc(utcDateString);
    const localDate = utcDate.tz(timezone);
    return localDate.format('DD/MM/yyyy');
  }
  formatFullDateVN(utcDateString: Date) {
    var timezone = 'Asia/Bangkok';
    const utcDate = moment.utc(utcDateString);
    const localDate = utcDate.tz(timezone);
    return localDate.format('yyyy-MM-DD HH:mm:ss');
  }

  formatFullDateDotNet(utcDateString: Date) {
    var timezone = 'Asia/Bangkok';
    const utcDate = moment.utc(utcDateString);
    const localDate = utcDate.tz(timezone);
    return localDate.format('yyyy-MM-DDTHH:mm:ss');
  }

}
