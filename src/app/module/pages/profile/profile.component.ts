import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {XhrService} from '../../../service/xhr.service';
import {Router} from '@angular/router';

declare let $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('formProfile') formProfile: ElementRef;
  private isSubmited;

  constructor(private router: Router) {

  }

  public submit(form: HTMLFormElement) {
    if (this.isSubmited) {
      return false;
    }
    this.isSubmited = true;
    const birthday = form['birthday'].value;
    XhrService.send({
      url: 'http://localhost:8088/api/profile',
      method: 'PUT',
      query: {token: localStorage.getItem('token')},
      body: {
        pseudo: form['pseudo'].value,
        image: form['image'].value,
        birthday: new Date(birthday),
        motd: form['motd'].value,
        description: form['description'].value
      },
      success: () => {
        $(form['validation']).addClass('btn-success');
        form['validation'].value = 'Success';
        setTimeout(() => {
          this.router.navigateByUrl('/home');
        }, 1000);
      },
      error: () => {
        $(form['validation']).addClass('btn-error');
        form['validation'].value = 'Erreur retry ?';
        this.isSubmited = false;

      }
    });
    return false;
  }

  private updateField(fields) {
    const form = this.formProfile.nativeElement;
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        if (form[key]) {
          form[key].value = fields[key];
        }
      }
    }
  }

  ngOnInit() {
    XhrService.send({
      url: 'http://localhost:8088/api/profile',
      method: 'GET',
      query: {token: localStorage.getItem('token')},
      success: (load: any) => {
        const response = load.target.response;
        this.updateField(response);
      }
    });
  }
}
