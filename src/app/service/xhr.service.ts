import {Injectable} from '@angular/core';

interface XhrConfig {
  url: string;
  method: string;
  success: any;
  query?: object;
  body?: object;
  error?: any;
}

@Injectable()
export class XhrService {

  constructor() {
  }

  static send(config: XhrConfig) {
    const xhr = new XMLHttpRequest();
    let uri = config.url;
    if (config.query) {
      uri += '?';
      let isFirst = true;
      for (const key in config.query) {
        if (config.query.hasOwnProperty(key)) {
          if (isFirst) {
            isFirst = false;
          } else {
            uri += '&';
          }
          uri += key + '=' + config.query[key];
        }
      }
    }
    xhr.open(config.method, uri);
    xhr.responseType = 'json';
    xhr.addEventListener('load', (load: any) => {
      if (load.target.status < 300) {
        config.success(load);
      } else {
        config.error(load);
      }
    }, false);
    xhr.addEventListener('error', config.error, false);
    xhr.addEventListener('abort', config.error, false);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(config.body));
  }
}
