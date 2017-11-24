import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChatComponent } from './module/chat/chat.component';
import { LoginComponent } from './module/login/login.component';
import {ParserHtmlPipe} from './filter/parser-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    ParserHtmlPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  ngOnInit() {

  }
}
