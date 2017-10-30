import {Component} from '@angular/core';
import {SocketClientService} from './service/socket-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SocketClientService]
})
export class AppComponent {
  title = 'La communauté';

  constructor(private io: SocketClientService) {
    this.io.init();
    this.io.socket.emit('hello', 'hello');
  }
}
