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
  parent = this;
  series = []; 
  loaderItems = [0,1,2,3,4,5,6,7,8,9]; // default 10 items
  searchSeries = []; 
  searchLoaderItems = [0,1,2]; // default 10 items
  mSort = "date_asc"; // pre-select order
  searching:boolean = false;
  searchTimer = undefined;
  queryText="";


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

  doSearch(event){

    this.queryText = event.target.value.toLowerCase();

    if(this.searchTimer != undefined){
      clearTimeout(this.searchTimer);
    }
    
    if(this.queryText.length >= 3){
      this.searching = true;
      this.searchSeries = [];
      this.searchLoaderItems = [0,1,2]; // reset loader
      this.searchTimer = setTimeout(()=>{
        this.getSeriesSearchList((data, empty)=>{
          this.loadItemAndImageInSearch(data.data);
      
          if(empty){
            this.searchSeries = [];
            this.searching = false;
          }

        }, this.queryText+"&limit=3"); // limit to 3 results
      }, 1000);
    }else{
      this.searchSeries = [];
      this.searching = false;
    }

  }

  doSort(_event){
    
    this.series = []; 
    this.loaderItems = [0,1,2,3,4,5,6,7,8,9];

    let sortQuery = "";
    switch(this.mSort){
      case 'date_asc':
        sortQuery = '?order=asc';
      break;
      case 'date_desc':
        sortQuery = '?order=desc';
      break;
      case 'title_asc':
        sortQuery = '?order=asc&orderby=title';
      break;
      case 'title_desc':
         sortQuery = '?order=desc&orderby=title';
      break;
    }

    this.getSeriesList(data=>{
      this.loadItemAndImage(data.data);
    }, sortQuery);


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

  loadItemAndImageInSearch(data=[]){
    if(data.length > 0){
      AwsStorage.get(data[0].coverImage).then(url=>{
        data[0].coverImageUrl = url;
        this.searchSeries.push(data[0]);
        data.shift();
        this.searchLoaderItems.shift();
        this.loadItemAndImageInSearch(data);
      }).catch(err=>{
        console.log("Error!");
        console.log(err);
      });
    }else{
      this.searchLoaderItems = [];
      this.searching = false;
    }
  }


  async getSeriesList(cb, sortQuery=""){
  
    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept' : 'application/json'
      })
    };

    this.http.get(config.apiUrl + "public/series"+sortQuery, httpOptions).subscribe(data=>{
      cb(data);
    }, err=>{
      console.log(err);
      cb(false);
    });

  }

  async getSeriesSearchList(cb, searchQuery=""){
  
    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept' : 'application/json'
      })
    };

    this.http.get(config.apiUrl + "public/search?query="+searchQuery, httpOptions).subscribe(data=>{
      let result:any = data;
      let empty:boolean = result.data.length === 0?true:false;
      cb(data, empty);
    }, err=>{
      console.log(err);
      cb(false);
    });

  }

}
