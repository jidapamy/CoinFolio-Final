import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Content, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DatacoinProvider } from '../../providers/datacoin/datacoin';
/**
 * Generated class for the EditTransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-transaction',
  templateUrl: 'edit-transaction.html',
})
export class EditTransactionPage {
  @ViewChild(Content) content: Content
  myDate:any;
  editTransactionForm: FormGroup;
  transaction: any;
  crypto: any;
  price:any;
  total: any;
  static: any;
  errorQuantity: string = '';
  errorTradePrice: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public builder: FormBuilder,
    public viewCtrl: ViewController,
    public provider: DatacoinProvider,
    public alertCtrl: AlertController) {
    console.log(this.navParams.data);
    this.transaction = this.navParams.get('transaction')
    this.crypto = this.navParams.get('coin')
    console.log(this.transaction);
    console.log(this.crypto);

    this.editTransactionForm = this.builder.group({
      'status': [this.transaction.status, Validators.required],
      'tradePrice': [this.transaction.tradePrice, Validators.required],
      'quantity': [this.transaction.quantity, Validators.required],
      'date': [this.transaction.date, Validators.required],
      'note': [this.transaction.note]
    });
    this.culculateTotal();
    this.price = this.transaction.tradePrice;
    this.myDate = this.transaction.date;
    this.provider.loadStatistics().subscribe(data => {
      this.static = Object.keys(data).map(key => data[key]);
    },
      error => { console.log("error: " + error); },
      () => { console.dir(this.static) });
  }

  chooseDate() {
    console.log('chooseDate' + this.static.length)
    for (let i = 0; i < this.static.length; i++) {
      if (this.static[i].secondary_currency == this.crypto.coin.secondary_currency) {
        let arrayPrice = this.static[i].priceofday;
        console.log(this.static[i].secondary_currency)
        console.dir(this.static[i].priceofday);
        for (let j = 0; j < arrayPrice.length; j++) {
          console.log(arrayPrice[j].date + ' = ' + this.editTransactionForm.value.date.substr(0, 10))
          if (arrayPrice[j].date == this.editTransactionForm.value.date.substr(0, 10)) {
            console.log(arrayPrice[j].date + ' / ' + arrayPrice[j].price);
            let coin = { primary_currency: 'THB', last_price: (+arrayPrice[j].price) * 34 }
            this.price = this.provider.convertMoney(coin, this.crypto.coin.primary_currency);
            break;
          } else {
            this.price = this.crypto.last_price
          }
        }
      }
    }
    this.culculateTotal();
  }

  culculateTotal(){
    this.total = (+this.editTransactionForm.value.tradePrice) * (+this.editTransactionForm.value.quantity)
    console.log(`tradePrice: ${this.editTransactionForm.value.tradePrice} * quantity: ${this.editTransactionForm.value.quantity}`)
    console.log(this.total +'type: '+typeof this.total)
  }

  goBack() {
    this.navCtrl.pop();
  }

  chooseStatus() {
    console.log(this.transaction.status)
    if (this.transaction.status == 'Watch') {
      this.editTransactionForm.value.quantity = 0;
      this.total = 0
    }
  }

  calPrice(event,param) {
    console.log(event.target.value)
    this.culculateTotal();
    this.keyUp(param);
  }

  removeTransaction() {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you wish to remove this transaction?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Agree clicked');
            this.updateHolding('remove')
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    confirm.present();
  }

  updateHolding(param) {
    let valueInform = this.editTransactionForm.value

    let quantityTotal = +this.crypto.totalQuantity
    let totalPrice = +this.crypto.totalPrice;

    let quantityNew = +valueInform.quantity;
    let quantityOld = +this.transaction.quantity;

    let tradePriceOld = +this.transaction.total;

    let statusNew = valueInform.status;
    let statusOld = this.transaction.status;

    console.log(`statusNew : ${statusNew} / statusOld : ${statusOld}`)
    if (param == 'remove') {
      if (statusOld == 'Buy') {
        quantityTotal = (quantityTotal - quantityOld)
        console.log(`${totalPrice} = (${totalPrice} - ${tradePriceOld}) + ${this.total}`)
        totalPrice = (totalPrice - tradePriceOld)
      } else if (statusOld == 'Sell') {
        quantityTotal = (quantityTotal + quantityOld)
        totalPrice = (totalPrice + tradePriceOld)
      }
      totalPrice = this.provider.decimalFormat(totalPrice);
      quantityTotal = this.provider.decimalFormat(quantityTotal);
      this.provider.removedTransaction(this.transaction.$key);
      this.provider.updateAmountHolding(this.crypto, quantityTotal, totalPrice);  //update totalPrice & totalQuantity
    } else {
      if (quantityNew > 0) {
        if (statusOld == 'Buy' && statusNew == 'Buy') {
          quantityTotal = (quantityTotal - quantityOld) + quantityNew
          console.log(`${totalPrice} = (${totalPrice} - ${tradePriceOld}) + ${this.total}`)
          totalPrice = (totalPrice - tradePriceOld) + this.total
        } else if (statusOld == 'Buy' && statusNew == 'Sell') {
          quantityTotal = (quantityTotal - quantityOld) - quantityNew
          totalPrice = (totalPrice - tradePriceOld) - this.total
        } else if (statusOld == 'Sell' && statusNew == 'Buy') {
          quantityTotal = (quantityTotal + quantityOld) + quantityNew
          totalPrice = (totalPrice + tradePriceOld) + this.total
        } else if (statusOld == 'Sell' && statusNew == 'Sell') {
          quantityTotal = (quantityTotal + quantityOld) - quantityNew
          totalPrice = (totalPrice + tradePriceOld) - this.total
        }
      } else {
        if (statusOld == 'Buy' && statusNew == 'Watch') {
          quantityTotal = (quantityTotal - quantityOld)
          console.log(`${totalPrice} = (${totalPrice} - ${tradePriceOld}) + ${this.total}`)
          totalPrice = (totalPrice - tradePriceOld)
        } else if (statusOld == 'Sell' && statusNew == 'Watch') {
          quantityTotal = (quantityTotal + quantityOld)
          totalPrice = (totalPrice + tradePriceOld)
        }
      }

      totalPrice = this.provider.decimalFormat(totalPrice);
      quantityTotal = this.provider.decimalFormat(quantityTotal);
      this.total = this.provider.decimalFormat(this.total)
      let dataAddTransaction = {
        status: this.editTransactionForm.value.status,
        tradePrice: this.editTransactionForm.value.tradePrice,
        quantity: this.editTransactionForm.value.quantity,
        total: this.total,
        date: ('' + this.editTransactionForm.value.date).substr(0, 10),
        note: this.editTransactionForm.value.note
      };
      console.dir(dataAddTransaction)

      this.provider.updateTransaction(this.transaction.$key, dataAddTransaction)    //add transtion
      this.provider.updateAmountHolding(this.crypto, quantityTotal, totalPrice);  //update totalPrice & totalQuantity
    }

  }


  validate(): any {
    if (this.editTransactionForm.valid) {
      return true;
    }
    let controlQuantity = this.editTransactionForm.controls['quantity'];
    if (controlQuantity.invalid) {
      if (controlQuantity.errors['required']) {
        this.errorQuantity = '*Please provide a quantity';
      }
    }

    let controlTradePrice = this.editTransactionForm.controls['tradePrice'];
    if (controlTradePrice.invalid) {
      if (controlTradePrice.errors['required']) {
        this.errorTradePrice = '*Please provide a tradePrice';
      }
    }
    return false;
  }

  editTransation() {
    console.log('mydate : '+this.myDate)
    console.dir(this.editTransactionForm.value)
    let valueInform = this.editTransactionForm.value

    if (this.validate()) {
      if (this.editTransactionForm.value.note == undefined) {
        this.editTransactionForm.value.note = ''
      }
      this.updateHolding('add')
      this.viewCtrl.dismiss();
    }
    // }
    console.log('success')
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
