import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ItemSliding, ModalController, MenuController, Content } from 'ionic-angular';
import { DatacoinProvider, cryptoCurrency, crypto } from '../../providers/datacoin/datacoin';
import { CoinsDetailPage } from '../coins-detail/coins-detail';
import { AddTransactionPage } from '../add-transaction/add-transaction';
// import { MyApp } from '../../app/app.component';
// import { EditTransactionPage } from '../edit-transaction/edit-transaction';
// import { Screenshot } from '@ionic-native/screenshot';
import { HeaderPage } from '../header/header';
import { FolioPage } from '../folio/folio';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage'
// import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Content) content: Content
  segment = 'THB';
  user: any;
  cryptoTotal: cryptoCurrency[] = [];
  coins: cryptoCurrency[] = [];
  filteredCrypto: Array<any> = [];
  screen: any;
  state: boolean = false;
  isfiltered: boolean;
  searchText: any
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    // private faio: FingerprintAIO,
    public provider: DatacoinProvider,
    public modalCtrl: ModalController,
    // private screenshot: Screenshot,
    public menuControl: MenuController,
    public storage: Storage,) {

    // this.storage.ready().then(() => {
    //   this.storage.get('userLogin').then((data) => {
    //     console.log('userLogin Provider')
    //     console.dir(data);
    //     if (data) {
    //       this.user = data
    //     }
    //   });
    // });

    this.provider.getUserLogin().then(data =>{
      console.dir(data)
      if (data) {
          this.user = data
          this.content.resize();
      }
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  search(event) {
    console.dir(this.coins)
    if (event.target.value) {
      console.log(event.target.value)
      if (event.target.value.length > 0) {
        let filteredJson = this.coins.filter(row => {
          if (row.secondary_currency.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1) {
            return true;
          } else {
            return false;
          }
        });
        this.isfiltered = true;
        this.filteredCrypto = filteredJson;
        console.log(this.filteredCrypto)
      } else {
        this.isfiltered = false;
      }
    } else {
      this.isfiltered = false;
    }
    console.log('searchText ' + this.searchText)
  }
  // select segment
  changeMarket(type) {
    this.searchText = ''
    this.isfiltered = false;
    this.content.scrollToTop(300);
    this.segment = type;
    if (this.cryptoTotal.length > -1) {
      let filtered = this.cryptoTotal.filter(row => {
        if (row.primary_currency == type) {
          return true;
        } else {
          return false;
        }
      });
      this.coins = filtered;
    } else {
      console.log('No data');
    }
    console.log('this.coins')
    console.dir(this.coins);
  }

  goToAddTransaction(slidingItem: ItemSliding, crypto: any): void {
    let modal = this.modalCtrl.create(AddTransactionPage, crypto);
    if (this.user != '') {
      modal.present();
    } else {
      this.navCtrl.push(LoginPage); // go to login for user not login
    }
    slidingItem.close();
  }

  ngOnInit() {
  //   this.provider.getUserLogin().then(data => {
  //     this.user = data;
  //     this.content.resize();
  //     console.log('ngOnInit')
  //     console.dir(this.user)
  //   })

    let intervel = setInterval(() => {        // fetch data BXCoin API
      if (this.cryptoTotal.length == 0) {
        this.cryptoTotal = this.provider.getBxCoin();
        console.log('this.cryptoTotal')
        console.dir(this.cryptoTotal)
        clearInterval(intervel);
        this.changeMarket(this.segment);
        console.log('this.cryptoTotal ' + this.cryptoTotal.length)
        for (let i = 0; i < this.cryptoTotal.length; i++) {
          if (this.cryptoTotal[i].primary_currency == 'USD' && this.cryptoTotal[i].secondary_currency == "BTC") {
            console.log('rateBtcPerUsd')
            this.provider.rateBtcPerUsd = this.cryptoTotal[i].last_price;
          }
          if (this.cryptoTotal[i].primary_currency == 'USD' && this.cryptoTotal[i].secondary_currency == "ETH") {
            console.log('rateEthPerUsd')
            this.provider.rateEthPerUsd = this.cryptoTotal[i].last_price;
          }
        }
      }
    }, 300);


  }

  goToDetail(crypto) {
    this.navCtrl.push(CoinsDetailPage, { crypto: crypto, type: 'home' });
  }

  goToMyCoins() {
    let statusStorage;
    // this.provider.getFingerprint().then(data => {
    //   statusStorage = data;
    //   console.log('statusStorage ' + statusStorage)
    //   if (statusStorage) {
    //     this.faio.show({
    //       clientId: 'Coinfolio-Demo',
    //       localizedFallbackTitle: 'Use Pin',
    //       localizedReason: 'Please authenticate'
    //     })
    //       .then((result: any) => {
    //         this.navCtrl.setRoot(FolioPage);
    //       })
    //       .catch((error: any) => {
    //         console.log('err: ', error);
    //       });
    //   } else {
    //     this.navCtrl.setRoot(FolioPage);
    //   }
    // })

    this.navCtrl.setRoot(FolioPage);

  }

  // reset() {
  //   var self = this;
  //   setTimeout(function () {
  //     self.state = false;
  //   }, 1000);
  // }

  // screenShot() {
  //   this.screenshot.save('jpg', 80).then(res => {
  //     this.screen = res.filePath;
  //     this.state = true;
  //     this.reset();
  //   });
  // }


}
