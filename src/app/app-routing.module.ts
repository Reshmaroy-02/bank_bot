import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:"login", component:LoginComponent},
  {path:"", component:ChatWindowComponent, canActivate:[AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
