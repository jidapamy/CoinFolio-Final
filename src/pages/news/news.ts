import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import xml2js from 'xml2js';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
// import { DatacoinProvider , objectCoinMarKetCap} from '../../providers/datacoin/datacoin';
import { DatacoinProvider, newsData, newsDataDetail } from '../../providers/datacoin/datacoin';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  news: any = '';
  // status: any;
  // feed: feeds[];
  items: newsDataDetail[] = [];
  // data: newsDataDetail[];
  isSelect: boolean;

  title: any;
  pubDate: any;
  link: any;
  description: any;

  url: string;
  constructor(public http: Http,
    public navCtrl: NavController,
    public provider: DatacoinProvider,
    private inAppBrowser: InAppBrowser,
  ) {

    this.provider.loadNews().subscribe(data => {
      this.news = data;
      console.dir(this.news)
    },
      error => { console.log("error: " + error); },
      () => {
        for (let i = 0; i < this.news.items.length; i++) {
          this.items.push({
            title: this.news.items[i].title,
            pubDate: this.news.items[i].pubDate,
            link: this.news.items[i].link,
            guid: this.news.items[i].guid,
            author: this.news.items[i].author,
            thumbnail: this.news.items[i].thumbnail,
            description: this.news.items[i].description,
            content: this.news.items[i].content,
            enclosure: this.news.items[i].enclosure.link,
            categories: this.news.items[i].categories
          })

          console.log('item' + i + ' ' + this.news.items[i].title);
        }
        console.log('item' + this.items.length);
        console.log('item 3:' + this.items[3].title);



      })
    // }, 1000);
    this.isSelect = false;
    this.isSelect = false;
  }



  openWebpage(item) {
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }

    // Opening a URL and returning an InAppBrowserObject
    const browser = this.inAppBrowser.create(item.link, '_self', options);

    // Inject scripts, css and more with browser.X
  }
  doRefresh(refresher) {
    setTimeout(() => {
      console.log('Async operation has ended');
      this.items.length = 0;
      for (let i = 0; i < this.news.items.length; i++) {
        this.items.push({
          title: this.news.items[i].title,
          pubDate: this.news.items[i].pubDate,
          link: this.news.items[i].link,
          guid: this.news.items[i].guid,
          author: this.news.items[i].author,
          thumbnail: this.news.items[i].thumbnail,
          description: this.news.items[i].description,
          content: this.news.items[i].content,
          enclosure: this.news.items[i].enclosure.link,
          categories: this.news.items[i].categories
        })
        console.log('item' + i + ' ' + this.news.items[i].title);
      }
      refresher.complete();
      console.log(`length: ${this.items.length}`)
    }, 500);
  }

  test() {
    console.log('item' + this.news.items[0].title);
  }
}