import { Injectable } from "@angular/core";
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Injectable()
export class AuthGuard implements CanActivate{
  auth:any;
  verify:string;
    constructor(private chatService:ChatService,private router:Router){

    }

    canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean{
        //console.log((localStorage.getItem('user'))==='admin')
        this.chatService.verify().subscribe(response=>{
          localStorage.setItem('verify',"false");
          this.auth=response;
          for(var i=0;i<this.auth.length;i++){
            console.log(this.auth[i].email);
            console.log(this.auth[i].Password);
            console.log(localStorage.getItem('userID'));
            console.log(localStorage.getItem('pass'));
          if(localStorage.getItem('userID')!=null &&
          (localStorage.getItem('userID'))===this.auth[i].email &&
          (localStorage.getItem('pass'))===this.auth[i].Password){
            localStorage.setItem('verify',"yes");
          }
        }
        });
        if(localStorage.getItem('verify')=="yes"){
          localStorage.removeItem('verify');
          return true;
        }
        
            this.router.navigate(['/login']);
            return false;

    }
}
