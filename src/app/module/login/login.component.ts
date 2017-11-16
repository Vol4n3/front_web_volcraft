import {Component, OnInit} from '@angular/core';
import {SocketClientService} from '../../service/socket-client.service';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('slide', [
      state('in', style({opacity: 1, transform: 'translateX(0)'})),
      transition('void => *', [
        style({opacity: 0, transform: 'translateX(-250px)'}),
        animate('0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)')
      ]),
      transition('* => void', [
        animate('0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)', keyframes([
          style({opacity: 1, transform: 'translateX(0px)'}),
          style({opacity: 0, transform: 'translateX(250px)'}),
        ]))
      ]),
    ]),
    trigger('error', [
      state('in', style({opacity: 1, transform: 'translateX(0)'})),
      transition('* => *', [
        animate('0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)', keyframes([
          style({transform: 'translateX(0px)'}),
          style({transform: 'translateX(50px)'}),
          style({transform: 'translateX(0px)'}),
        ]))
      ]),
    ]),
  ]
})
export class LoginComponent implements OnInit {

  private socket;
  public isRegister;
  public isLogin;
  public askLog;
  public isConfirm: boolean;
  public isCorrectLength: boolean;
  public toggleErrorAnimation = true;
  public logged = false;

  constructor(private io: SocketClientService) {

  }

  public submit(form: HTMLFormElement) {
    if (this.isRegister) {
      if (this.isConfirm) {
        this.register(form);
      }else {
        this.toggleErrorAnimation = !this.toggleErrorAnimation;
      }
    } else {
      this.login(form);
    }
    return false;
  }

  public toggleFormLogin() {
    if (this.isLogin) {
      this.askLog = false;
      this.isLogin = false;
    } else {
      this.askLog = true;
      this.isRegister = false;
      this.isLogin = true;
    }
  }

  public toggleFormRegister() {
    if (this.isRegister) {
      this.askLog = false;
      this.isRegister = false;
    } else {
      this.askLog = true;
      this.isLogin = false;
      this.isRegister = true;
    }
  }

  public checkLength(form: HTMLFormElement) {
    this.isCorrectLength = form['pseudo'].value.length > 3;
  }

  public logout(): void {
    this.socket.emit('logout');
  }

  public confirmPassword(form: HTMLFormElement) {
    if (this.isRegister) {
      this.isConfirm = form['password'].value === form['pass_confirm'].value;
    }
  }

  private register(form: HTMLFormElement) {
    this.socket.emit('register', {
      pseudo: form['pseudo'].value,
      password: form['password'].value,
      email: form['email'].value,
    });
  }

  private login(form: HTMLFormElement) {
    this.socket.emit('login',
      {
        pseudo: form['pseudo'].value,
        password: form['password'].value,
      });
  }

  ngOnInit() {
    this.socket = this.io.getSocket();
    this.socket.on('sys_login', (data) => {
        this.toggleErrorAnimation = (data.type === 'error') ? !this.toggleErrorAnimation : this.toggleErrorAnimation;
        switch (data.msg) {
          case 'login_fail':
            break;
          case 'login_success':
            localStorage.setItem('token', data.token);
            this.logged = true;
            break;
          case 'register_success':
            this.toggleFormLogin();
            break;
          case 'logout_success':
            this.logged = false;
            break;
          default:
        }
      }
    );
    this.socket.emit('session_login', {
      token: localStorage.getItem('token')
    });
  }
}
