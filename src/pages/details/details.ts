import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DatacoinProvider, tempStatisticsCoinsDetail, tempbookorderBidItem, tempbookorderBid, tempbookorder, cryptoCurrency } from '../../providers/datacoin/datacoin';
import Highcharts from 'highcharts/highstock';
import * as HighCharts from 'highcharts';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Screenshot } from '@ionic-native/screenshot';
import { HomePage } from '../home/home';
import { FolioPage } from '../folio/folio';
import { Content } from 'ionic-angular';
import { EditTransactionPage } from '../edit-transaction/edit-transaction';
import { AddTransactionPage } from '../add-transaction/add-transaction';
import { CoinsDetailPage } from '../coins-detail/coins-detail';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Platform, ActionSheetController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  @ViewChild(Content) content: Content
  cryptoTotal: cryptoCurrency[] = []
  crypto: any;
  priceperday: any;
  priceOfDay: any[] = [];

  dateTimes: string;

  screen: any;
  state: boolean = false;

  transactionList: transaction[] = [];
  thisCoins: any;
  result: any;
  marketValue: any;

  constructor(
    public actionsheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private socialSharing: SocialSharing,
    public platform: Platform,
    private screenshot: Screenshot,
    public navCtrl: NavController,
    public navParams: NavParams,
    public provider: DatacoinProvider,
    public angularfire: AngularFireDatabase,
    public modalCtrl: ModalController) {
    this.crypto = this.navParams.data;
    console.log('this.crypto')
    console.dir(this.crypto);
    console.log('Result ' + this.result)

    console.dir(this.crypto);
    this.ModifyData();
  }

  goTOEditTransactionPage(transaction) {
    this.openModal(EditTransactionPage, { transaction: transaction, coin: this.crypto.myCoins });
  }

  goTOAddTransationPage() {
    console.log(this.crypto.cryptoCurrency)
    this.openModal(AddTransactionPage, this.crypto.cryptoCurrency);
  }
  goToHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  openModal(page, param) {
    let modal = this.modalCtrl.create(page, param);
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data)
      let myCoins = this.provider.getMycoins();
      console.dir(myCoins)
      for (let i = 0; i < myCoins.length; i++) {
        if (myCoins[i].$key == this.provider.coinsKey) {
          console.log(this.provider.coinsKey + ' = ' + myCoins[i].$key)
          console.log(this.crypto.myCoins.totalPrice + ' = ' + myCoins[i].totalPrice)
          this.crypto.myCoins.totalPrice = this.provider.decimalFormat(myCoins[i].totalPrice)
          this.crypto.myCoins.totalQuantity = this.provider.decimalFormat(myCoins[i].totalQuantity);
        }
      }
      this.ModifyData();
    })

  }
  ModifyData() {
    this.marketValue = this.provider.decimalFormat((this.crypto.myCoins.totalQuantity * this.crypto.cryptoCurrency.last_price));
    this.result = this.marketValue - this.crypto.myCoins.totalPrice
    this.result = '' + this.result
    if (this.result.indexOf('.') == -1) {
      this.result = +this.result
      this.result = this.result.toFixed(0)
    } else {
      this.result = +this.result
      if (this.result < -100 || this.result > 1) {
        this.result = this.result.toFixed(2)
      } else if (this.result == 0) {
        this.result = this.result.toFixed(0)
      } else {
        this.result = this.result.toFixed(8)
      }
    }

    this.transactionList.length = 0;
    let transationParam = this.provider.getTransactionOfCoin();
    for (let i = 0; i < transationParam.length; i++) {
      if (transationParam[i].status != 'Watch') {
        this.transactionList.unshift(transationParam[i])
      }
    }
    console.log('transactionList');
    console.dir(this.transactionList)
  }

  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Screenshot',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Save to Gallery',
          role: 'destructive',
          icon: 'albums',
          handler: () => {
            setTimeout(() => {
              this.screenShot();
            }, 900);
          }
        },
        {
          text: 'Share With Facebook',
          icon: 'share',
          handler: () => {
            setTimeout(() => {
              this.screenShotURIShareWithFacebook();;
            }, 900);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: 'close',
          handler: () => {
            setTimeout(() => {
              console.log('Cancel clicked');
            }, 900);
            
          }
        }
      ]
    });
    actionSheet.present();
  }
  reset() {
    var self = this;
    setTimeout(function () {
      self.state = false;
    }, 1000);
  }

  screenShotURIShareWithFacebook() {
    this.screenshot.URI(80).then(res => {
      this.screen = res.URI;
      let photo = this.screen;
      this.state = true;
      this.socialSharing.shareViaFacebook('By CoinFolio', res.URI, res.URI);
      this.reset();
    });
  }

  screenShotURIShareWithEmail() {
    this.screenshot.save('jpg', 80).then(res => {
      this.screen = res.filePath;
      this.state = true;
      this.reset();
      this.socialSharing.shareViaEmail('By CoinFolio', 'SceenShot', ['support40@coinfolio.com'], null, null, res.filePath);
    });

    
  }
  screenShot() {
    this.screenshot.save('jpg', 80).then(res => {
      this.screen = res.filePath;
      this.state = true;
      this.reset();
      
    });
    let alert = this.alertCtrl.create({
      
      subTitle: '   Save Photo Success!!',
    });

    alert.present().then(() => {
      setTimeout(() => {
        alert.dismiss();

      }, 800);
    }).catch(() => {
      alert.dismiss();
    });
  }
  gotoGraph(){
    this.navCtrl.push(CoinsDetailPage, {crypto : this.crypto,type:'detail'})
  }


  ionViewDidLoad() {
    console.log("ionViewDidLoad")
  }
  
  goToFolio() {
    this.navCtrl.setRoot(FolioPage);
  }

}


export class transaction {
  status: any;
  tradePrice: any;
  quantity: any;
  total: any;
  date: any;
  note: any;
}