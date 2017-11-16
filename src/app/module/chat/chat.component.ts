import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SocketClientService} from '../../service/socket-client.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public messages = [
    {
      pseudo: 'Vol4n3',
      txt: '<script>console.log("test");</script>[youtube=LCBRS_VMsxA]',
      img: 'http://www.aiphone.fr/images/mobile/icone_compte.png',
      date: '2017',
      datetime: '2017-12-25'
    },
    {
      pseudo: 'OtherPoeple',
      txt: 'test',
      img: 'https://www.ecosources.info/images/energie_batiment/eolienne_axe_vertical_Darri.jpg',
      date: '2017',
      datetime: '2017-12-25'
    }
  ];
  private socket;

  constructor(private io: SocketClientService) {
    setInterval(() => {
      this.messages.push({
        pseudo: 'Vol4n3',
        txt: '<script>console.log("test");</script> [h1]hqus[/h1]S',
        img: 'http://www.aiphone.fr/images/mobile/icone_compte.png',
        date: '2017',
        datetime: '2017-12-25'
      });
      this.messages = this.messages.slice();
    }, 10000);
  }

  trackByMessage(index: number, message): number {
    return message.date;
  }

  ngOnInit() {
    this.socket = this.io.getSocket();

  }

}
