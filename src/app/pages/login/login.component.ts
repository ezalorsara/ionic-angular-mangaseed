import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;

  constructor(fb:FormBuilder) {
    this.loginForm = fb.group({
      name: ["", Validators.required]
    });
  }

  ngOnInit() {}

  login(form){
    // this.authService.login(form.value).subscribe((res)=>{
    //   this.router.navigateByUrl('home');
    // });
  }

}
