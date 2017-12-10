import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Platform } from 'ionic-angular';
/*
  Generated class for the DatacoinProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatacoinProvider {
  pathFirebase = '/users';
  userData: FirebaseListObservable<any[]> = this.angularfire.list(this.pathFirebase);
  myCoinsData: FirebaseListObservable<any[]>;
  transactionData: FirebaseListObservable<any[]>;
  chatsData: FirebaseListObservable<any[]> = this.angularfire.list('/chats');

  userLogin: any = '';
  userKey: any = '';
  coinsKey: any;
  mycoinsPath: any;
  transactionPath: any;
  fingerprint:boolean;
  fingerprintPassIntime:boolean = false;

  //BX Attribute
  private apiUrl = "/api";
  rateBtc: any = 0;
  rateEth: any = 0;
  rateUsd: any = 34;
  rateBtcPerUsd: any = 0;
  rateEthPerUsd: any = 0;
  cryptoWithName: any[] = []
  cryptoCurrency: any[] = [];
  getNameCoinsBX: any[];


  constructor(public http: Http,
    public storage: Storage,
    public angularfire: AngularFireDatabase) {
    console.log('Hello DatacoinProvider Provider');
    
    this.mixNameCoins();
    
    // this.setUserLogin('')
    // this.setDataTutorial(false)
    // this.setFingerprint(false)
    this.storage.ready().then(() => {
      this.storage.get('userLogin').then((data) => {
        console.log('userLogin Provider')
        console.dir(data);
        if (data) {
          this.userLogin = data.user;
          this.userKey = data.key;
        }
      });
    });

    // this.storage.ready().then(() => {
    //   this.storage.get('Fingerprint').then((data) => {
    //     console.log('Fingerprint Provider')
    //     console.dir(data);
    //     if (data) {
    //       this.fingerprint = data;
    //       console.log('fingerprint = ' + this.fingerprint)
    //     }
    //   });
    // });

  }

  //Finger
  getFingerprint(): Promise<any> {
    return this.storage.get('Fingerprint')
  }
  setFingerprint(boolean) {
    this.storage.set('Fingerprint', boolean)
    console.log('Fingerprint Storage' + boolean)
  }


  //Tutorial
  getDataTutorial() {
    return this.storage.get('tutorial')
  }
  setDataTutorial(boolean) {
    this.storage.set('tutorial', boolean)
  }

  // User
  registerUser(data) {
    this.userData.push(data)
  }
  getUserLogin(): Promise<any> {
    return this.storage.get('userLogin')
  }
  setUserLogin(user) {
    console.dir(user)
    this.storage.set('userLogin', user);
    if (user != '' || user != undefined) {
      this.userKey = user.key
      console.log('Set Username :' + this.userLogin.username + 'KEY: ' + this.userKey)
    } else {
      this.userLogin = ''
      this.userKey = ''
    }
  }
  getAllUSer() {
    let userList: any[];
    this.userData.subscribe(data => {
      userList = data
    })
    return userList;
  }


  // Transition & Coins
  getMycoinsPath() { //myCoin ของ User ตามที่ login
    this.mycoinsPath = this.pathFirebase + '/' + this.userKey + '/myCoins';
    return this.mycoinsPath;
  }
  getMycoins() { //myCoin ของ User ตามที่ login
    let myCoins;
    this.myCoinsData = this.angularfire.list(this.getMycoinsPath())
    this.myCoinsData.subscribe(data => {
      myCoins = data;
    })
    return myCoins;
  }
  addMycoins(coin) {
    this.myCoinsData = this.angularfire.list(this.getMycoinsPath())
    this.myCoinsData.push(coin)
  }
  getOneCoinInMycoins() {
    let myCoins;
    console.log(this.getMycoinsPath() + '/' + this.coinsKey)
    this.myCoinsData = this.angularfire.list(this.getMycoinsPath() + '/' + this.coinsKey)
    this.myCoinsData.subscribe(data => {
      myCoins = data;
    })
    return myCoins;
  }

  updateAmountHolding(coin, totalQuantity, totalPrice) {
    console.log('Update')
    this.myCoinsData = this.angularfire.list(this.mycoinsPath);
    this.myCoinsData.update(coin.$key, { totalQuantity: totalQuantity, totalPrice: totalPrice })
  }

  addTransactionAlreadyCoin(transaction) {
    console.log()
    this.transactionData = this.angularfire.list(this.getTransactionPath());
    this.transactionData.push(transaction);
  }

  getTransactionPath() {
    return this.getMycoinsPath() + '/' + this.coinsKey + '/transaction'
  }

  getTransactionOfCoin() {
    let transaction;
    this.transactionData = this.angularfire.list(this.getTransactionPath())
    this.transactionData.subscribe(data => {
      transaction = data;
    })
    return transaction;
  }

  removedMyCoins(coin) {
    this.myCoinsData.remove(coin);
  }

  updateTransaction(key, newTransaction) {
    console.log('Key :' + key)
    console.dir(newTransaction)
    this.transactionData.update(key, {
      date: newTransaction.date, note: newTransaction.note,
      quantity: newTransaction.quantity, status: newTransaction.status,
      total: newTransaction.total, tradePrice: newTransaction.tradePrice
    });
  }

  removedTransaction(key) {
    this.transactionData.remove(key)
  }


  // Chat
  getChatData() {
    let chats = [];
    this.chatsData.subscribe(data => {
      chats = data;
    })
    return chats;
  }

  removedChat(chat) {
    this.chatsData.remove(chat.$key);
  }

  addChats(message) {
    this.chatsData.push(message);
  }


  //API
  loadBX(): Observable<crypto[]> {
    // return this.http.get(this.apiUrl)
    return this.http.get('bx.in.th.json')
      .map(response => {
        return response.json()
      });
  }

  getBxCoin() {
    console.log('getBxCoin : ' + this.cryptoCurrency.length)
    return this.cryptoCurrency;
  }

  loadStatistics(): Observable<tempStatisticsCoins[]> {
    return this.http.get('staticCoinPriceperday.json')
      .map(response => {
        return response.json();
      });
  }

  loadNews(): Observable<newsData[]> {
    return this.http.get('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcointelegraph.com%2Frss&api_key=ss1px1umuunducpxqlhspjeyh18k9hfweenrq8ds')
      .map(response => {
        return response.json();
      });
  }


  // BX Coins
  mixNameCoins() {
    let cryptoNumbers;
    this.loadBX().subscribe(data => {
      cryptoNumbers = Object.keys(data).map(key => data[key]);
      console.log('mixNameCoins')
      console.dir(data);
    },
      error => { console.log("error: " + error); },
      () => {
        for (let i = 0; i < cryptoNumbers.length; i++) {
          this.cryptoWithName[i] = {
            pairing_id: cryptoNumbers[i].pairing_id,
            primary_currency: cryptoNumbers[i].primary_currency,
            secondary_currency: cryptoNumbers[i].secondary_currency,
            change: cryptoNumbers[i].change,
            last_price: cryptoNumbers[i].last_price,
            volume_24hours: cryptoNumbers[i].volume_24hours,
            nameCrypto: NAME[i],
            orderbook: cryptoNumbers[i].orderbook
          }
        }

        for (let i = 0; i < this.cryptoWithName.length; i++) {
          if (this.cryptoWithName[i].secondary_currency == 'BTC') {
            this.rateBtc = this.cryptoWithName[i].last_price;
          }
          if (this.cryptoWithName[i].secondary_currency == 'ETH' && this.cryptoWithName[i].primary_currency == 'THB') {
            this.rateEth = this.cryptoWithName[i].last_price;
          }
        }
        this.loopOfConvert('THB');
        this.loopOfConvert('BTC');
        this.loopOfConvert('ETH');
        this.loopOfConvert('USD');
      })
  }

  loopOfConvert(type) {
    for (let i = 0; i < this.cryptoWithName.length; i++) {
      this.pushCrytoTotal(type, i);
    }
  }

  pushCrytoTotal(type: any, index: number) {
    this.cryptoCurrency.push({
      pairing_id: this.cryptoWithName[index].pairing_id,
      primary_currency: type,
      secondary_currency: this.cryptoWithName[index].secondary_currency,
      change: this.cryptoWithName[index].change,
      last_price: this.convertMoney(this.cryptoWithName[index], type),
      volume_24hours: this.cryptoWithName[index].volume_24hours,
      nameCrypto: this.cryptoWithName[index].nameCrypto,
      orderbook: this.cryptoWithName[index].orderbook
    })
  }

  convertMoney(coin, type) {
    let price = 0;
    let priceDecimal;
    if (coin.primary_currency == 'THB') { // แปลงจากเงินบาท
      console.log(`${coin.primary_currency} >> ${type}`)
      if (type == 'THB') {
        price = coin.last_price;
      } else if (type == 'BTC') {
        price = (coin.last_price / this.rateBtc);
      } else if (type == 'ETH') {
        price = (coin.last_price / this.rateEth);
      } else if (type == 'USD') {
        price = (coin.last_price / this.rateUsd);
      }
    } else if (coin.primary_currency == 'BTC') { // แปลงจากเงิน BTC
      if (type == 'THB') {
        price = (coin.last_price * this.rateBtc);
      } else if (type == 'BTC') {
        price = coin.last_price;
      } else if (type == 'ETH') {
        price = ((coin.last_price * this.rateBtc) / this.rateEth);
      } else if (type == 'USD') {
        price = ((coin.last_price * this.rateBtc) / this.rateUsd);
      }
    }

    // Decimal Format
    if (price < 1) {
      priceDecimal = price.toFixed(8);
    } else {
      priceDecimal = price.toFixed(2);
    }
    return priceDecimal;
  }

  getName() {
    this.loadBX().subscribe(data => {
      this.getNameCoinsBX = Object.keys(data).map(key => data[key]);
      console.dir(this.getNameCoinsBX)
    },
      error => { console.log("error: " + error); },
    );
    return this.getNameCoinsBX
  }

  decimalFormat(param) {
    param = '' + param
    console.log('decimal ' + param + ' type :' + typeof param)
    if (param.indexOf('.') == -1) {
      param = (+param).toFixed(0)
      console.log('toFixed(0) ' + param)
    } else {
      param = +param
      if (-1 < param && param < 1) {
        param = param.toFixed(8);
        console.log('toFixed(8) ' + param)
      } else {
        param = param.toFixed(2);
        console.log('toFixed(2) ' + param)
      }
    }
    return param
  }



}


export class tempStatisticsCoins {
  coins: tempStatisticsCoinsDetail[];
}
export class tempStatisticsCoinsDetail {
  pairing_id: any;
  secondary_currency: any;
  priceofday: detailOfDate[];
}

export class detailOfDate {
  date: any;
  price: any;
}

export class tempbookorderBidBox {
  box: tempbookorderBidItem[];
}

export class tempbookorderAsksBox {
  box: tempbookorderBidItem[];
}

export class tempbookorder {
  bids: tempbookorderBidItem[];
  asks: tempbookorderAsksItem[];
}

export class tempbookorderBidItem {
  Item: tempbookorderBid[];
}

export class tempbookorderAsksItem {
  Item: tempbookorderAsks[];
}

export class Bids {
  total: any
  volume: any
  highbid: any
}

export class tempbookorderBid {
  price: any[];
  amount: any[];
}

export class tempbookorderAsks {
  price: any[];
  amount: any[];
}

export class newsData {
  status: any;
  feed: feeds[];
  items: newsDataDetail[];
}

export class feeds {
  url: any;
  title: any;
  link: any;
  author: any;
  description: any;
  image: any;
}

export class newsDataDetail {
  title: any;
  pubDate: any;
  link: any;
  guid: any;
  author: any;
  thumbnail: any;
  description: any;
  content: any;
  enclosure: enclosure[];
  categories: categories[];
}

export class enclosure {
  link: any;
}

export class categories {
  0: any;
  1: any;
  2: any;
  3: any;
}

export class crypto {
  pairing_id: any
  primary_currency: any
  secondary_currency: any
  change: number
  last_price: string
  volume_24hours: any
  orderbook: orderbook;
}

export class orderbook {
  bids: { total: any, volume: any, highbid: any }
  asks: { total: any, volume: any, highbid: any }
}

export class cryptoCurrency {
  pairing_id: any;
  primary_currency: any;
  secondary_currency: any;
  change: any;
  last_price: any;
  volume_24hours: any
  nameCrypto: any;
  orderbook: orderbook;
}

export const NAME: any[] = ["Bitcoin", "Litecoin", "Namecoin", "Dogcoin",
  "Peercoin", "Feathercoin", "Primecoin", "Zcash",
  "HyperStake", "Pandacoin", "Cryptonite", "Paycoin",
  "Quark", "Ethereum", "Ethereum", "Dash", "Augur", "Gnosis",
  "Ripple", "OmiseGo", "BitcoinCash", "Everex", "Zcoin"];
