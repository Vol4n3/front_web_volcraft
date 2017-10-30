import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChatComponent } from './module/chat/chat.component';
import { LogginComponent } from './module/loggin/loggin.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LogginComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
