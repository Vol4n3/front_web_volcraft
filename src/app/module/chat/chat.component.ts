import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketClientService} from '../../service/socket-client.service';
import {DateService} from '../../service/date.service';

declare let $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('messagesList') messagesList: ElementRef;
  @ViewChild('editor') editor: ElementRef;
  @ViewChild('chatWindow') chatWindow: ElementRef;

  public messages: any[] = [];
  private socket;

  constructor(private io: SocketClientService) {

  }

  public startResize(event) {
    event.preventDefault();
    const w: number = window.innerWidth;
    const h: number = window.innerHeight;
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    const rO: ClientRect = this.chatWindow.nativeElement.getBoundingClientRect();
    const move = (ev: MouseEvent) => {
      const newWidth: number = ev.clientX - rO.left;
      const newHeight: number = ev.clientY - rO.top;
      this.chatWindow.nativeElement.style.width = newWidth + 'px';
      this.chatWindow.nativeElement.style.height = newHeight + 'px';
    };
    const stopMove = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stopMove);
      this.checkForResetChatPosition(w, h);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stopMove);
  }

  public startMove(event) {
    event.preventDefault();
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    const w: number = window.innerWidth;
    const h: number = window.innerHeight;
    const move = (ev: MouseEvent) => {
      const x: number = ev.clientX - offsetX;
      const y: number = ev.clientY - offsetY;
      this.chatWindow.nativeElement.style.left = x + 'px';
      this.chatWindow.nativeElement.style.top = y + 'px';
    };
    const stopMove = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stopMove);
      this.checkForResetChatPosition(w, h);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stopMove);
  }

  public checkForResetChatPosition(width: number, height: number) {
    const rectChat: ClientRect = this.chatWindow.nativeElement.getBoundingClientRect();
    const heightHeader: Number = $('#mainHeader').height();

    if (rectChat.left < 0) {
      this.chatWindow.nativeElement.style.left = 0 + 'px';
    }
    if (rectChat.top < heightHeader) {
      this.chatWindow.nativeElement.style.top = heightHeader + 'px';
    }
    if (rectChat.top + rectChat.height > height) {
      this.chatWindow.nativeElement.style.top = (height - rectChat.height) + 'px';
    }
    if (rectChat.left + rectChat.width > width) {
      this.chatWindow.nativeElement.style.left = (width - rectChat.width) + 'px';
    }
    this.saveWindowPosition();
  }

  private saveWindowPosition() {
    const rectChat: ClientRect = this.chatWindow.nativeElement.getBoundingClientRect();
    localStorage.setItem('chat_pos', JSON.stringify(rectChat));
  }

  private restoreWindowPosition() {
    const rectChat: ClientRect = JSON.parse(localStorage.getItem('chat_pos'));
    if (rectChat) {
      this.chatWindow.nativeElement.style.top = rectChat.top + 'px';
      this.chatWindow.nativeElement.style.left = rectChat.left + 'px';
      this.chatWindow.nativeElement.style.height = rectChat.height + 'px';
      this.chatWindow.nativeElement.style.width = rectChat.width + 'px';
      console.log(rectChat);
    }
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
    }, 200);
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
    this.scrollMessagesList();
  }

  ngOnInit() {
    this.socket = this.io.getSocket();

    this.socket.on('chat_history', (data) => {
      if (data.messages && data.messages.length > 0) {
        this.buildMessages(data.messages);
      }
    });
    this.socket.on('chanel_message', (data) => {
      const addMessage = this.messages.concat(data.message);
      this.buildMessages(addMessage);
    });
    this.restoreWindowPosition();
  }

  ngAfterViewInit() {

  }
}
