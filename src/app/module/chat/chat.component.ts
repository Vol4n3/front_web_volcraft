import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketClientService} from '../../service/socket-client.service';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

declare let $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesList') messagesList: ElementRef;

  public messages = [
    {
      pseudo: 'Vol4n3',
      txt: 'test"qsd"',
      img: 'http://www.aiphone.fr/images/mobile/icone_compte.png',
      date: '2017',
      datetime: '2017-12-25'
    },
    {
      pseudo: 'OtherPeople',
      txt: 'test',
      img: 'https://www.ecosources.info/images/energie_batiment/eolienne_axe_vertical_Darri.jpg',
      date: '2017',
      datetime: '2017-12-25'
    }
  ];
  private socket;

  constructor(private io: SocketClientService) {

  }

  private scrollMessagesList() {
    const list = this.messagesList.nativeElement;
    if (list.scrollTop >= list.scrollHeight - list.clientHeight * 2) {
      $(list).animate({
        scrollTop: list.scrollHeight - list.clientHeight
      }, 200);
    }
  }

  public trackByMessage(index: number, message): number {
    return message.date;
  }

  ngOnInit() {
    this.socket = this.io.getSocket();
    this.scrollMessagesList();
    setInterval(() => {
      this.messages.push({
        pseudo: 'Vol4n3',
        txt: '<script>console.log("test");</script> [h1]hqus[/h1]S',
        img: 'http://www.aiphone.fr/images/mobile/icone_compte.png',
        date: '2017',
        datetime: '2017-12-25'
      });
      this.messages = this.messages.slice();
      setTimeout(() => {
        this.scrollMessagesList();
      }, 100);
    }, 10000);
  }

}
