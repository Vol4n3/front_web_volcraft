import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketClientService {
  public socket;

  constructor() {
  }

  init() {
    this.socket = io('http://localhost:8088');
  }

  getSocket() {
    return this.socket;
  }

}
