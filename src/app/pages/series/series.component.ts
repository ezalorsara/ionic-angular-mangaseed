import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AmplifyService }  from 'aws-amplify-angular';
import Amplify, { Storage as AwsStorage, Auth as AwsAuth , API as AwsAPI} from 'aws-amplify';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import config  from '../../../config';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
})
export class SeriesComponent implements OnInit {

  addSeriesForm:FormGroup;
  coverImage:any;
  isLoadingSubmit:boolean = false;
  mPublished:string = "";
  mFeatured:string = "";
  mStatus:string = "";

   constructor(
    private fb:FormBuilder,
    private amplifyService:AmplifyService,
    private cd: ChangeDetectorRef,
    private http: HttpClient
  ) 
  {

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

    this.addSeriesForm = fb.group({
      cover: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      language: new FormControl(null, Validators.required),
      authors: new FormControl(null, Validators.required),
      artists: new FormControl(null, Validators.required),
      isFeatured: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
      tags: new FormControl(null, Validators.required),
      published: new FormControl(null, Validators.required)
    });
    
  }

  ngOnInit() {}

  async doAddSeries(){
    this.isLoadingSubmit = true;
    if(this.addSeriesForm.valid){
      try {
        const attachment:any = this.addSeriesForm.controls.cover ? await AwsStorage.put(this.coverImage.name, this.coverImage, {contentType: this.coverImage.type }) : "";
        let postParam = {
          title: this.addSeriesForm.controls.title.value,
          description: this.addSeriesForm.controls.description.value,
          language: this.addSeriesForm.controls.language.value,
          authorsName: this.addSeriesForm.controls.authors.value,
          artistsName: this.addSeriesForm.controls.artists.value,
          coverImage: attachment.key,
          isFeatured: this.mFeatured,
          status : this.mStatus,
          tags: this.addSeriesForm.controls.tags.value,
          published: this.mPublished
        }

        const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Accept' : 'application/json'
          })
        };

        AwsAPI.post("MYAPI", "private/series", {
          body : postParam
        }).then(data=>{
          console.log("Result: ");
          console.log(data);
          this.isLoadingSubmit = false;
        }).catch(err=>{
          console.log('Error!');
          console.log(err);
          this.isLoadingSubmit = false;
        });

        // this.http.post(config.apiUrl+"private/series", postParam, httpOptions)
        // .subscribe(data => {
          
        // }, error => {
          
        // });
    }catch(e){
      console.log("Error: ");
      console.log(e);
    }
  }else{
    this.isLoadingSubmit = false;
  }

  }

  onFileChange(event) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.coverImage = file;
        console.log(this.coverImage);
        // this.addSeriesForm.patchValue({
        //   cover: reader.result
        // });
        // console.log(reader.result);
        // // need to run CD since file load runs outside of zone
        // this.cd.markForCheck();
      };
    }
  }

}
