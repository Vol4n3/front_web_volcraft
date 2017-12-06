import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ChatComponent} from './module/chat/chat.component';
import {LoginComponent} from './module/login/login.component';
import {ParserHtmlPipe} from './filter/parser-html.pipe';
import {ProfileComponent} from './module/pages/profile/profile.component';
import {HomeComponent} from './module/pages/home/home.component';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './module/pages/not-found/not-found.component';
import {HoverPreviewComponent} from './module/hover-preview/hover-preview.component';

const appRoutes: Routes = [
  {
    path: 'profile', component: ProfileComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    ParserHtmlPipe,
    ProfileComponent,
    HomeComponent,
    NotFoundComponent,
    HoverPreviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  ngOnInit() {

  }
}
