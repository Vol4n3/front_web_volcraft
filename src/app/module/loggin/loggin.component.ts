import {Component, OnInit} from '@angular/core';
import {SocketClientService} from '../../service/socket-client.service';

@Component({
  selector: 'app-loggin',
  templateUrl: './loggin.component.html',
  styleUrls: ['./loggin.component.scss']
})
export class LogginComponent implements OnInit {

  private socket;
  public isRegister: boolean;
  public isConfirm: boolean;
  public isCorrectLength: boolean;
  constructor(private io: SocketClientService) {

  }

  public submit(form: HTMLFormElement) {
    if (this.isRegister) {
      if (this.isConfirm) {
        this.register(form);
      }
    } else {
      this.login(form);
    }
    return false;
  }
  public checklength(form: HTMLFormElement) {
    this.isCorrectLength = form['pseudo'].value.length > 3;
  }
  public confirmPassword(form: HTMLFormElement) {
    if (this.isRegister) {
      this.isConfirm = form['password'].value === form['pass_confirm'].value;
    }
    console.log(this.isConfirm);
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
    this.socket.on('system', (data) => {
        console.log(data);
        if (data.msg === 'login_fail') {
          this.isRegister = true;
        }
      }
    );
  }
}
