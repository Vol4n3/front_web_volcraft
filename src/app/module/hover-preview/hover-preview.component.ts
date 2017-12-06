import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-hover-preview',
  templateUrl: './hover-preview.component.html',
  styleUrls: ['./hover-preview.component.scss']
})
export class HoverPreviewComponent implements OnInit {
  @Input() show: boolean;
  constructor() {

  }

  ngOnInit() {
  }

}
