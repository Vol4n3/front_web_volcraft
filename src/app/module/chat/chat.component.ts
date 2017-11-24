import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketClientService} from '../../service/socket-client.service';
import {DateService} from '../../service/date.service';

declare let $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesList') messagesList: ElementRef;
  @ViewChild('editor') editor: ElementRef;

  public messages: any[] = [];
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

  public dateFormat(date: string): string {
    return DateService.getFormatString(new Date(date));
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

  private buildMessages(message) {
    const msgs = [];
    let tempText = '';
    for (let i = 0; i < message.length; i++) {
      const currentMsg = message[i];
      const n_1Msg = message[i - 1];
      if (i !== 0) {
        if (currentMsg.pseudo === n_1Msg.pseudo) {
          tempText += '[br]';
          tempText += currentMsg.text;
        } else {
          message[i - 1].text = tempText;
          msgs.push(message[i - 1]);
          tempText += '[br]';
          tempText = currentMsg.text;
        }
      } else {
        tempText = currentMsg.text;
      }
    }
    const lastMsg = message[message.length - 1];
    const bLastMsg = message[message.length - 2];
    if (message.length > 1) {
      if (lastMsg.pseudo === bLastMsg.pseudo) {
        message[message.length - 1].text = tempText;
      }
      msgs.push(message[message.length - 1]);
    } else {
      msgs.push(message[message.length - 1]);
    }

    this.messages = msgs;
  }

  ngOnInit() {
    this.socket = this.io.getSocket();

    this.socket.on('chat_history', (data) => {
      if (data.messages && data.messages.length > 0) {
        this.buildMessages(data.messages);
        this.scrollMessagesList();
      }
    });
    this.socket.on('chanel_message', (data) => {
      const addMessage = this.messages.concat(data.message);
      this.buildMessages(addMessage);
      this.scrollMessagesList();
    });
  }

}
