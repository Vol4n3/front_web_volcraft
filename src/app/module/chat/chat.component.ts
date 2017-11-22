import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketClientService} from '../../service/socket-client.service';

declare let $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesList') messagesList: ElementRef;
  @ViewChild('editor') editor: ElementRef;

  public messages = [
    {
      pseudo: 'system',
      text: '[h3]No message[/h3]',
      img: 'http://www.aiphone.fr/images/mobile/icone_compte.png',
      date: '2017',
      datetime: '2017-12-25'
    },
  ];
  private socket;

  constructor(private io: SocketClientService) {

  }

  public submitChat(el?: HTMLElement, event?: KeyboardEvent) {
    if (event && event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      this.socket.emit('chat_message', {
        text: el.textContent,
        channel: 'default'
      });
      el.textContent = '';
    }
  }

  private scrollMessagesList() {
    setTimeout(() => {
      const list: any = this.messagesList.nativeElement;
      if (list.scrollTop >= list.scrollHeight - list.clientHeight * 2) {
        $(list).animate({
          scrollTop: list.scrollHeight - list.clientHeight
        }, 200);
      }
    }, 100);
  }

  ngOnInit() {
    this.socket = this.io.getSocket();

    this.socket.on('chat_history', (data) => {
      this.messages = data;
    });
    this.socket.on('chanel_message', (data) => {
      this.messages.push(data.msg);
      this.scrollMessagesList();
    });
  }

}
