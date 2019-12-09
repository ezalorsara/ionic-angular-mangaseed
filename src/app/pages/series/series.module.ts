import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SeriesComponent } from './series.component';
import { HttpClientModule } from '@angular/common/http';
import { SeriesListComponent } from './series-list/series-list.component';
import config  from '../../../config';
import Amplify from 'aws-amplify'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SeriesComponent
      },
      {
        path: 'list',
        component: SeriesListComponent
      }
    ])
  ],
  declarations: [SeriesComponent, SeriesListComponent]
})
export class SeriesPageModule {
  constructor(){

    Amplify.configure({
      Auth: {
          identityPoolId: config.Auth.identityPoolId, 
          region: config.Auth.region,
          userPoolId: config.Auth.userPoolId,
          userPoolWebClientId: config.Auth.userPoolWebClientId
      },
      API: {
        endpoints: [
          {
              name: "MYAPI",
              endpoint: config.apiUrl
          }
        ]
      },
      Storage: {
          AWSS3: {
            bucket: config.Storage.bucket,
            region: config.Storage.region,
            acl: config.Storage.acl,
            level: config.Storage.level
          }
      }
    });

  }
}
