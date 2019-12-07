import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AmplifyService }  from 'aws-amplify-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Add Series',
      url: '/series',
      icon: 'add'
    },
    {
      title: 'Series List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Authors/Artist',
      url: '/creator',
      icon: 'create'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings'
    }

  ];

  signedIn: boolean = false;
  user: any;
  greeting: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private amplifyService: AmplifyService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      this.amplifyService.authStateChange$
          .subscribe(authState => {
              this.signedIn = authState.state === 'signedIn';
              if (!authState.user) {
                  this.user = null;
              } else {
                  this.user = authState.user;
                  console.log(this.user);
                  this.greeting = "Hello HI " + this.user.username;
              }
      });

    });
  }
}
