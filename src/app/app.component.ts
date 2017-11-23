import {Component, ElementRef, ViewChild} from '@angular/core';
import {SocketClientService} from './service/socket-client.service';
import {DateService} from './service/date.service';
import {LoginComponent} from './module/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SocketClientService, DateService]
})
export class AppComponent {
  @ViewChild('mainHeader') mainHeader: ElementRef;
  @ViewChild(LoginComponent) appLogin: LoginComponent;
  title = 'CoMuTy / Volcraft';

  constructor(private io: SocketClientService) {
    this.io.init();

  }

  public hideLogin(event: MouseEvent) {
    if (event.clientY > this.mainHeader.nativeElement.clientHeight) {
        this.appLogin.closeForm();
    }
  }
}
