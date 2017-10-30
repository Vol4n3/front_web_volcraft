import { Component, OnInit } from '@angular/core';
import {SocketClientService} from '../../service/socket-client.service';

@Component({
  selector: 'app-loggin',
  templateUrl: './loggin.component.html',
  styleUrls: ['./loggin.component.scss']
})
export class LogginComponent implements OnInit {

  private socket;
  constructor(private io: SocketClientService) {

  }

  ngOnInit() {
    this.socket = this.io.getSocket();
    this.socket.emit('hello', 'login');

  }


}
