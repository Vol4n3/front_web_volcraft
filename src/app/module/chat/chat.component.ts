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
  @ViewChild('chatWindow') chatWindow: ElementRef;
  @ViewChild('hoverPreview') hoverProfile: ElementRef;

  public showHoverProfile: boolean;
  public messages: any[] = [];
  public isMinimize: boolean;
  public profileHoverId: String;
  public connected = 0;
  private socket;

  constructor(private io: SocketClientService) {
  }

  public hover(id: string): void {
    this.profileHoverId = id;
    this.showHoverProfile = true;
  }

  public hideHover(): void {
    this.showHoverProfile = false;
  }

  public startResize(event) {
    if (event.which === 1) {
      event.preventDefault();
      const w: number = window.innerWidth;
      const h: number = window.innerHeight;
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
        window.removeEventListener('mouseleave', stopMove);
        this.checkForResetChatPosition(w, h);
      };
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', stopMove);
      window.addEventListener('mouseleave', stopMove);
    }
  }

  public startMove(event) {
    if (event.which === 1) {
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
        window.removeEventListener('mouseleave', stopMove);
        this.checkForResetChatPosition(w, h);
      };
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', stopMove);
      window.addEventListener('mouseleave', stopMove);
    }
  }

  public checkForResetChatPosition(width: number, height: number) {
    const rectChat: ClientRect = this.chatWindow.nativeElement.getBoundingClientRect();
    const heightHeader: number = $('#mainHeader').height();
    if (rectChat.height > (window.innerHeight - heightHeader)) {
      this.chatWindow.nativeElement.style.height = window.innerHeight - heightHeader + 'px';
    }
    if (rectChat.width > window.innerWidth) {
      this.chatWindow.nativeElement.style.width = window.innerWidth + 'px';
    }
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

    setTimeout(() => {
      this.saveWindowPosition();
    }, 500);
  }

  private saveWindowPosition() {
    localStorage.setItem('chat_minimize', (this.isMinimize) ? '1' : '0');
    if (!this.isMinimize) {
      const rectChat: ClientRect = this.chatWindow.nativeElement.getBoundingClientRect();
      localStorage.setItem('chat_pos', JSON.stringify(rectChat));
    }
  }

  private restoreWindowPosition() {
    if (localStorage.getItem('chat_minimize') === '1') {
      this.minimize();
    } else {
      const rectChat: ClientRect = JSON.parse(localStorage.getItem('chat_pos'));
      if (rectChat) {
        this.chatWindow.nativeElement.style.top = rectChat.top + 'px';
        this.chatWindow.nativeElement.style.left = rectChat.left + 'px';
        this.chatWindow.nativeElement.style.height = rectChat.height + 'px';
        this.chatWindow.nativeElement.style.width = rectChat.width + 'px';
      }
    }
    this.checkForResetChatPosition(window.innerWidth, window.innerHeight);
  }

  public minimize() {
    this.chatWindow.nativeElement.style.height = '38px';
    this.chatWindow.nativeElement.style.width = '200px';
    this.isMinimize = true;
    localStorage.setItem('chat_minimize', '1');
    this.chatWindow.nativeElement.style.top = window.innerHeight - 38 + 'px';
    this.chatWindow.nativeElement.style.left = '0px';
    this.chatWindow.nativeElement.style.position = 'fixed';
  }

  public maximize() {
    this.isMinimize = false;
    this.chatWindow.nativeElement.style.position = 'absolute';
    localStorage.setItem('chat_minimize', '0');
    this.restoreWindowPosition();
    this.scrollBottom();
  }

  public submitChat(el: HTMLElement, event: any) {
    if (event && event.keyCode === 13 || event.type === 'click') {
      event.preventDefault();
      event.stopPropagation();
      this.socket.emit('chat_message', {
        text: el.textContent,
        channel: 'default'
      });
      el.textContent = '';
    }
  }

  public timeAgo(date: string): string {
    return DateService.getTimeAgo(new Date(date));
  }

  private scrollBottom() {
    setTimeout(() => {
      if (this.messagesList) {
        const list: any = this.messagesList.nativeElement;
        $(list).animate({
          scrollTop: list.scrollHeight - list.clientHeight
        }, 200);
      }
    }, 200);
  }

  private scrollMessagesList() {
    setTimeout(() => {
      if (this.messagesList) {
        const list: any = this.messagesList.nativeElement;
        if (list.scrollTop >= list.scrollHeight - list.clientHeight * 2) {
          $(list).animate({
            scrollTop: list.scrollHeight - list.clientHeight
          }, 200);
        }
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

  public moveHover(ev: any) {
    if (this.hoverProfile) {
      const rect = this.hoverProfile.nativeElement.getBoundingClientRect();
      this.hoverProfile.nativeElement.style.top = ev.clientY - rect.height - 10 + 'px';
      this.hoverProfile.nativeElement.style.left = ev.clientX - rect.width / 2 + 'px';
    }
  }

  ngOnInit() {
    this.socket = this.io.getSocket();
    this.socket.on('sys_chat', (data) => {
      if (data.type === "error") {
        this.messages.push({
          profile: "",
          pseudo: "system",
          text: "Tu dois te connecter pour participer au chat",
          datetime: data.date,
          img: "https://steamuserimages-a.akamaihd.net/ugc/577831783504492376/3DCBE26B735F00BB85DADB1271A57D2267600453/?interpolation=lanczos-none&output-format=jpeg&output-quality=95&fit=inside%7C637%3A358&composite-to=*,*%7C637%3A358&background-color=black"
        });
      }
    });
    this.socket.on('connected', (data) => {
      if (data) {
        this.connected = data.length;
      } else {
        this.connected = 0;
      }
    });
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
    this.scrollBottom();
    window.addEventListener('resize', () => {
      this.checkForResetChatPosition(window.innerWidth, window.innerHeight);
    });
  }
}
