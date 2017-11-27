import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketClientService {
  public socket;

  constructor() {
  }

  init() {
    const origin: string = window.location.origin;
    let socketUrl: string;
    if (window.location.port) {
      socketUrl = origin.replace(window.location.port, '8088');
    } else {
      socketUrl = origin + ':8088';
    }
    this.socket = io(socketUrl);
  }

  getSocket() {
    return this.socket;
  }

}
