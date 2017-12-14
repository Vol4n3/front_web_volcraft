import {Component, Input, OnInit} from '@angular/core';
import {XhrService} from '../../service/xhr.service';
import {DateService} from '../../service/date.service';

@Component({
  selector: 'app-hover-preview',
  templateUrl: './hover-preview.component.html',
  styleUrls: ['./hover-preview.component.scss']
})
export class HoverPreviewComponent implements OnInit {
  @Input() public show;
  private _profileId: string;
  public pseudo: string;
  public birthday: string;
  public description: string;
  public image: string;
  public group: string;
  public motd: string;

  constructor() {

  }

  @Input()
  set profileId(id: string) {
    if (id && id !== this._profileId) {
      XhrService.send({
        method: 'GET',
        url: '/api/profile/' + id,
        success: (resp) => {
          this.image = resp.target.response.image;
          this.pseudo = resp.target.response.pseudo;
          this.description = resp.target.response.description;
          this.birthday = resp.target.response.birthday;
          this.motd = resp.target.response.motd;
        },
        error: () => {
          this.image = 'https://steamuserimages-a.akamaihd.net/ugc/577831783504492376/3DCBE26B735F00BB85DADB1271A57D2267600453/?interpolation=lanczos-none&output-format=jpeg&output-quality=95&fit=inside%7C637%3A358&composite-to=*,*%7C637%3A358&background-color=black';
          this.pseudo = 'John doe';
          this.description = 'c\'est le mec qui viens de l\'inconnue';
          this.birthday = '1985-06-02';
          this.motd = 'L\'inconnu';
        }
      });
      this._profileId = id;
    }
  }

  get profileId() {
    return this._profileId;
  }

  public getAge(): string {
    if (this.birthday) {
      return DateService.getYearString(new Date(this.birthday));
    }
  }

  ngOnInit() {
  }

}
