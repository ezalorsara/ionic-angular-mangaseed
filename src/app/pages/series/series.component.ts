import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AmplifyService }  from 'aws-amplify-angular';
import Amplify, { Storage as AwsStorage, API as AwsAPI} from 'aws-amplify';
import { ToastController } from '@ionic/angular';


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
    public toastController: ToastController
  ) 
  {
    
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

  async submitSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Add New Series Successfully!.',
      duration: 3000,
      position: 'top',
      header: 'Message:'
    });
    toast.present();
  }

  async doAddSeries(){
    this.isLoadingSubmit = true;
 
    const timestamp = Date.now()
    if(this.addSeriesForm.valid){
      try {
        const coverImageKey:string = timestamp+this.addSeriesForm.controls.title.value.split(' ').join('-');
        await AwsStorage.put(coverImageKey, this.coverImage, {contentType: this.coverImage.type, level: "public" });
  
        let postParam = {
          title: this.addSeriesForm.controls.title.value,
          description: this.addSeriesForm.controls.description.value,
          language: this.addSeriesForm.controls.language.value,
          authorsName: this.addSeriesForm.controls.authors.value,
          artistsName: this.addSeriesForm.controls.artists.value,
          coverImage: coverImageKey,
          isFeatured: this.mFeatured,
          status : this.mStatus,
          tags: this.addSeriesForm.controls.tags.value,
          published: this.mPublished
        }

        AwsAPI.post("MYAPI", "private/series", {
          body : postParam
        }).then(_data=>{
          this.isLoadingSubmit = false;
          
          this.addSeriesForm.reset();
          this.mPublished = "";
          this.mFeatured = "";
          this.mStatus = "";
          this.addSeriesForm.controls.isFeatured.reset();
          this.addSeriesForm.controls.status.reset();
          this.addSeriesForm.controls.published.reset();
       
          this.submitSuccessToast();
        }).catch(err=>{
          console.log('Error!');
          console.log(err);
          this.isLoadingSubmit = false;
          this.addSeriesForm.reset();
          this.submitSuccessToast();
        });
        
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
