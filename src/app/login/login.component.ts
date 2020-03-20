import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:string;
  password:string;

  constructor(private router:Router) { }

  ngOnInit() {
    document.body.classList.add('bg-login');

  }

  login(){
      localStorage.setItem('userID',this.email);
      localStorage.setItem('pass',this.password);
      this.router.navigate(['portal']);



  }

}
