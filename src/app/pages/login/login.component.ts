import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AmplifyService }  from 'aws-amplify-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;

  constructor(
    private fb:FormBuilder,
    private amplifyService:AmplifyService
  ) 
  {
    this.loginForm = fb.group({
      name: ["", Validators.required]
    });
  }

  ngOnInit() {}

  login(form){

    this.amplifyService.auth().login()

    // this.authService.login(form.value).subscribe((res)=>{
    //   this.router.navigateByUrl('home');
    // });
  }

}
