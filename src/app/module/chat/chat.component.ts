import { Component, OnInit } from '@angular/core';
import {SocketClientService} from '../../service/socket-client.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  private socket;
  constructor(private io: SocketClientService) {

  }

  ngOnInit() {
    this.socket = this.io.getSocket();
    this.socket.emit('hello', '2fois');

  }

}
