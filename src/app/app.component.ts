/*
* === Reddit Feed version 0.4 ===
*  This app was created using Angular CLI and based on this tutorial: https://medium.com/@hin556/building-a-simple-reddit-client-web-by-angular2-and-rxjs-part-1-e119891427e5#.vn57l0n7c
*  This app was created by: Leonardo Ardila Osorio - @LeoDiBlack on Github/Steam/Twitter
*  MIT License
*/


import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import { Http } from '@angular/http';
import {ImageReddit} from './models/reddit_feed_9gag.models'; /*Import 9gag model for posts*/
import {NewsReddit} from './models/reddit_feed_news.models'; /*Import News model for posts*/
import 'rxjs/add/operator/map';

/*Model for testObject*/
export interface TestObject {
  name:string;
  value:number;
}

/*Imports the reddit component to load selected posts*/
@Component({
  selector: 'app-root',
  templateUrl: './components/reddit_feed.html',
  styleUrls: ['./components/reddit_feed.css']
})

/*Main class for the application*/
export class AppComponent {

  objArray:TestObject[];
  selectedObject:TestObject; /* Array that contains data for reddit selector*/
  selectedView: string = ''; /* Var that contains the actual view for the reddit feed */

  private _reddits$: Observable<Array<any>>; /*Array that contains all the data obtained from the http get*/
  private _redditDataUrl: string = 'https://www.reddit.com/r/news.json'; /*Var that handles the json*/

  constructor(private http: Http) {
    this.objArray = [{name: '9gag', value: 1}, {name: 'News', value: 1}];
    this.selectedObject = this.objArray[1];
    this.selectedView = this.selectedObject.name;
   }

  ngOnInit() {
      this.feedCycle();
  }

  /* Function that handles the data request from reddit json */
  private feedCycle(){
    this._initFeed();
    this._logFeed();
  }

  /* Function that start the data request from reddit, from reddit news or reddit 9gag
  ** If the selectView is 9gag it gets the data and builds several objects using the 9gag model
  ** Same happens for News, it has a related model for its objects
   */
  private _initFeed() {
    if (this.selectedView === '9gag') {
      this._reddits$ = this.http.get(this._redditDataUrl)
      .map(response => response.json())
      .map(json => <Array<any>>json.data.children)
      .map(children => children.filter(d => (
        ['png', 'jpg'].indexOf(d.data.url.split('.').pop()) != -1
      )))
      .map(children => children.map(d => new ImageReddit(d.data.id, d.data.title, d.data.url, d.data.permalink, d.data.subreddit, d.data.subreddit_id)));
    } else { 
      this._reddits$ = this.http.get(this._redditDataUrl)
      .map(response => response.json())
      .map(json => <Array<any>>json.data.children)
      .map(children => children.map(d => new NewsReddit(d.data.id, d.data.author, d.data.title, d.data.permalink, d.data.subreddit, d.data.url, d.data.subreddit_id, d.data.score)));
    }   
  }

  /*Subscribes the data obtained in _initFeed to the _reddits$ array in order to do an ngFor*/
  private _logFeed() {
    this._reddits$.subscribe(data => console.debug('data', data)); //debug used for dev mode, in production should be deleted
  }

  /* Function that handles the data change in the reddit json selector*/
  updateSelectedValue(event:string): void{
    if (JSON.parse(event).name === '9gag') {
      this.selectedObject = JSON.parse(event);
      this._redditDataUrl = 'https://www.reddit.com/r/9gag.json';
      this.selectedView = this.selectedObject.name;
      this.feedCycle();

    } else { 
      this.selectedObject = JSON.parse(event);
      this._redditDataUrl = 'https://www.reddit.com/r/news.json';
      this.selectedView = this.selectedObject.name;
      this.feedCycle();
    }   
  }

  /* Function that handles the feed cycle, updates the feed in the main page*/
  reloadList(event) {
    this.feedCycle();
  }
}
