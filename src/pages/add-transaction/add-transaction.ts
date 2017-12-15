import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { DatacoinProvider, cryptoCurrency } from '../../providers/datacoin/datacoin';
import { HomePage } from '../home/home';

/**
 * Generated class for the AddTransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-transaction',
  templateUrl: 'add-transaction.html',
})
export class AddTransactionPage {
  addTransactionForm: FormGroup;
  myDate: String = new Date().toISOString();
  crypto: cryptoCurrency;
  // status: any = 'Buy';
  static: any
  price: number;
  quantity: any;

  errorQuantity: string = '';
  errorTradePrice: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public builder: FormBuilder,
    public viewCtrl: ViewController,
    public provider: DatacoinProvider,
    public angularfire: AngularFireDatabase) {
    this.crypto = this.navParams.data;
    console.dir(crypto)
    this.addTransactionForm = this.builder.group({
      'status': ['Buy', Validators.required],
      'tradePrice': [, Validators.required],
      'quantity': [, Validators.required],
      'date': [, Validators.required],
      'note': ['']
    });

    this.provider.loadStatistics().subscribe(data => {
      this.static = Object.keys(data).map(key => data[key]);
    },
      error => { console.log("error: " + error); },
      () => { console.dir(this.static) });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTransactionPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  chooseStatus() {
    this.errorQuantity = '';
    this.errorTradePrice = '';
    if (this.addTransactionForm.value.status == 'Watch') {
      this.addTransactionForm.value.quantity = 0;
    }
  }

  chooseDate() {
    console.log('chooseDate' + this.static.length)
    for (let i = 0; i < this.static.length; i++) {
      if (this.static[i].secondary_currency == this.crypto.secondary_currency) {
        let arrayPrice = this.static[i].priceofday;
        console.log(this.static[i].secondary_currency)
        console.dir(this.static[i].priceofday);
        for (let j = 0; j < arrayPrice.length; j++) {
          console.log(arrayPrice[j].date + ' = ' + this.myDate.substr(0, 10))
          if (arrayPrice[j].date == this.myDate.substr(0, 10)) {
            console.log(arrayPrice[j].date + ' / ' + arrayPrice[j].price);
            let coin = { primary_currency: 'THB', last_price: (+arrayPrice[j].price) * 34 }
            this.price = this.provider.convertMoney(coin, this.crypto.primary_currency);
            break;
          } else {
            this.price = this.crypto.last_price
          }
        }
      }
    }
  }

  validate(): any {
    if (this.addTransactionForm.valid) {
      return true;
    }

    let controlQuantity = this.addTransactionForm.controls['quantity'];
    if (controlQuantity.invalid) {
      if (controlQuantity.errors['required']) {
        this.errorQuantity = '*Please provide a quantity';
      }
    }

    let controlTradePrice = this.addTransactionForm.controls['tradePrice'];
    if (controlTradePrice.invalid) {
      if (controlTradePrice.errors['required']) {
        this.errorTradePrice = '*Please provide a tradePrice';
      }
    }

    return false;
  }

  saveTransaction() {
    this.errorQuantity = '';
    console.log(this.addTransactionForm.value.quantity)
    if (this.validate()) {
      if ((+this.addTransactionForm.value.quantity) > 0) {
        let trasactionDetail = this.addTransactionForm.value;
        this.viewCtrl.dismiss();
        let calculate = this.addTransactionForm.value.tradePrice * this.addTransactionForm.value.quantity;
        let price;

        // decimalFormat
        if (calculate < 1) {
          price = (calculate).toFixed(8);
        } else {
          price = (calculate).toFixed(2);
        }

        // no note in transaction
        if (this.addTransactionForm.value.note == undefined) {
          this.addTransactionForm.value.note = ''
        }

        //calculate total
        let totalQuantity = this.addTransactionForm.value.quantity;
        let totalPrice = price;
        totalPrice = +totalPrice
        if (totalQuantity.indexOf('.') == -1) {
          totalQuantity = (+totalQuantity)
        } else {
          totalQuantity = (+totalQuantity)
          if (totalQuantity >= 1) {
            totalQuantity = (+totalQuantity).toFixed(2)
            console.log('totalQuantity >= 1 : ' + totalQuantity)
          } else {
            totalQuantity = (+totalQuantity).toFixed(8)
            console.log('totalQuantity < 1 : ' + totalQuantity)
          }

        }
        console.log('totalQuantity:' + totalQuantity)

        // object of transaction
        price = +price;
        let dataAddTransaction = {
          status: this.addTransactionForm.value.status,
          tradePrice: this.addTransactionForm.value.tradePrice,
          quantity: this.addTransactionForm.value.quantity,
          total: price,
          date: ('' + this.addTransactionForm.value.date).substr(0, 10),
          note: this.addTransactionForm.value.note
        };

        // object of Coin
        let coins = {
          coin: { change: this.crypto.change, last_price: this.crypto.last_price, nameCrypto: this.crypto.nameCrypto, orderbook: this.crypto.orderbook, pairing_id: this.crypto.pairing_id, primary_currency: this.crypto.primary_currency, secondary_currency: this.crypto.secondary_currency, volume_24hours: this.crypto.volume_24hours },
          totalQuantity: totalQuantity,
          totalPrice: totalPrice
        }

        // แปลงค่าเงินให้เป็นเงินไทย
        if (this.crypto.primary_currency == "BTC") {
          let rateBtc = this.provider.rateBtc;
          coins.totalPrice = coins.totalPrice * rateBtc;
        } else if (this.crypto.primary_currency == "ETH") {
          let rateEth = this.provider.rateEth;
          coins.totalPrice = coins.totalPrice * rateEth;
        } else if (this.crypto.primary_currency == "USD") {
          coins.totalPrice = coins.totalPrice * 34;
        } else if (this.crypto.primary_currency == "THB") {
          coins.totalPrice = coins.totalPrice;
          console.log('THB' + coins.totalPrice)
        }

        let myCoins = this.provider.getMycoins(); //เก็บเหรียญทั้งหมดของตัวเอง เป็น array
        let already: boolean = false;
        let coinAlready: any;

        // check เหรียญที่เพิ่ม transition ว่ามีอยู่แล้วหรือป่าว
        for (let i = 0; i < myCoins.length; i++) {
          console.log(`${myCoins[i].coin.pairing_id} == ${coins.coin.pairing_id}`)
          if (myCoins[i].coin.pairing_id == coins.coin.pairing_id &&
            myCoins[i].coin.secondary_currency == coins.coin.secondary_currency &&
            myCoins[i].coin.primary_currency == coins.coin.primary_currency) {
            already = true;
            coinAlready = myCoins[i];
            break;
          }
        }

        if (already == true) {  // มีเหรียญอยู่แล้ว add transaction
          let totalQuantity;
          let totalPrice;
          // เชคว่า status เป็นแบบไหนเพื่อทำการคำนวน total
          if (dataAddTransaction.status == 'Buy') {
            totalQuantity = ((+coinAlready.totalQuantity) + (+coins.totalQuantity));
            totalPrice = ((+coinAlready.totalPrice) + (+coins.totalPrice))
          } else if (dataAddTransaction.status == 'Sell') {
            totalQuantity = ((+coinAlready.totalQuantity) - (+coins.totalQuantity));
            totalPrice = ((+coinAlready.totalPrice) - (+coins.totalPrice))
          } else if (dataAddTransaction.status == 'Watch') {
            totalQuantity = (+coinAlready.totalQuantity);
            totalPrice = (+coinAlready.totalPrice);
          }


          this.provider.coinsKey = coinAlready.$key
          this.provider.addTransactionAlreadyCoin(dataAddTransaction)    //add transtion
          this.provider.updateAmountHolding(coinAlready, totalQuantity, totalPrice);  //update totalPrice & totalQuantity
        } else {  // เหรียญใหม่
          // เชคว่า status เป็นแบบไหนเพื่อทำการคำนวน total
          if (dataAddTransaction.status == 'Watch') {
            coins.totalPrice = 0
            coins.totalQuantity = 0
          } else if (dataAddTransaction.status == 'Sell') {
            coins.totalPrice = 0 - coins.totalPrice
            coins.totalQuantity = coins.totalQuantity
          }
          console.log('Add new coin')
          console.dir(coins)
          this.provider.addMycoins(coins);        // add new coin
          myCoins = this.provider.getMycoins();
          this.provider.coinsKey = myCoins[myCoins.length - 1].$key
          this.provider.addTransactionAlreadyCoin(dataAddTransaction); // add transition in new Coin
        }
      } else if ((+this.addTransactionForm.value.quantity) == 0) {
        this.errorQuantity = '*Please fill a quantity more than 0'
      } else if ((+this.addTransactionForm.value.quantity) <= 0) {
        this.errorQuantity = '*Please fill a quantity more than 0'
      }

    }
  }

  keyUp(param) {
    console.log(param)
    if (param == 'quantity') {
      this.errorQuantity = '';
    } else if (param == 'price') {
      this.errorTradePrice = '';
    }
  }

}
