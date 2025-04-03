import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { StompService } from './chat/stomp.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    StompService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 