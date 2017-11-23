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
}
