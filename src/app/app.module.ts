import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { LoginComponent } from './login/login.component';
import { ChatService } from './services/chat.service';
import { AuthGuard } from './guards/auth.guard';
import { SentimentAnalysisComponent } from './sentiment-analysis/sentiment-analysis.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent,
    LoginComponent,
    SentimentAnalysisComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ChatService, AuthGuard,SentimentAnalysisComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
