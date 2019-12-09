import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import config from '../../../../config';
import Amplify, { Storage as AwsStorage, API as AwsAPI} from 'aws-amplify';

@Component({
  selector: 'app-series-list',
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.scss'],
})
export class SeriesListComponent implements OnInit {

  series = []; 
  loaderItems = [0,1,2,3,4,5,6,7,8,9]; // default 10 items
  
  constructor(
    private http:HttpClient
  ) 
  {
    
  }

  ngOnInit() 
  {

    this.getSeriesList(data=>{
      this.loadItemAndImage(data.data);
    });
    
  }

  loadItemAndImage(data=[]){
    if(data.length > 0){
      AwsStorage.get(data[0].coverImage).then(url=>{
        data[0].coverImageUrl = url;
        this.series.push(data[0]);
        data.shift();
        this.loaderItems.shift();
        this.loadItemAndImage(data);
      }).catch(err=>{
        console.log("Error!");
        console.log(err);
      });
    }else{
      this.loaderItems = [];
      
    }
    
  
  }

  async getSeriesList(cb){
  
    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept' : 'application/json'
      })
    };

    this.http.get(config.apiUrl + "public/series", httpOptions).subscribe(data=>{
      cb(data);
    }, err=>{
      console.log(err);
      cb(false);
    });

  }

}
