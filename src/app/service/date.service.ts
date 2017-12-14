import {Injectable} from '@angular/core';

@Injectable()
export class DateService {

  constructor() {
  }

  static getFormatString(date: Date): string {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  }

  static getYearString(date: Date): string {
    const now: number = new Date().getTime();
    const time: number = date.getTime();
    const diffTime = now - time;
    return Math.ceil((diffTime / (1000 * 3600 * 24 * 365)) - 1).toString() + ' ans';
  }

  static getTimeAgo(date: Date): string {
    const now: number = new Date().getTime();
    const time: number = date.getTime();
    const diffTime = now - time;
    if (diffTime > 1000 * 3600 * 24) {
      return Math.ceil(diffTime / (1000 * 3600 * 24)).toString() + ' jours';
    } else if (diffTime > 1000 * 3600) {
      return Math.ceil(diffTime / (1000 * 3600)).toString() + ' heures';
    } else if (diffTime > 1000 * 60) {
      return Math.ceil(diffTime / (1000 * 60)).toString() + ' minutes';
    } else {
      return 'quelques intants';
    }
  }
}
