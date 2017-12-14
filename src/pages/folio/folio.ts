import { Component, ViewChild } from '@angular/core';
import { NavController, Content, ItemSliding } from 'ionic-angular';
import { DatacoinProvider, cryptoCurrency, crypto } from '../../providers/datacoin/datacoin';
import { EditTransactionPage } from '../edit-transaction/edit-transaction';
import { DetailsPage } from '../details/details';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-folio',
  templateUrl: 'folio.html'
})
export class FolioPage {
  @ViewChild(Content) content: Content
  cryptoNumbers: crypto[];
  cryptoTotal: cryptoCurrency[] = [];
  rateBtc: any = 0;
  myCoinsList: any[] = [];
  cryptoRecent: any[] = [];
  cryptoCurrency: cryptoCurrency[] = [];


  myfolio: any;

  myCoins: any[];
  constructor(public navCtrl: NavController,
    public provider: DatacoinProvider,
    public alertCtrl: AlertController
  ) {
    let intervel = setInterval(() => {        // fetch data BXCoin API
      let cryptoTotal: cryptoCurrency[] = []
      if (cryptoTotal.length == 0) {
        cryptoTotal = this.provider.getBxCoin();
        console.log('cryptoTotaly')
        console.dir(cryptoTotal)
        clearInterval(intervel);
        this.content.resize();
        this.myCoinsList = this.provider.getMycoins();
        for (let i = 0; i < cryptoTotal.length; i++) {
          if (cryptoTotal[i].primary_currency == "THB") {
            this.cryptoCurrency.push(cryptoTotal[i]);
          }
        }
        for (let i = 0; i < this.myCoinsList.length; i++) {
          for (let j = 0; j < this.cryptoCurrency.length; j++) {
            if (this.cryptoCurrency[j].pairing_id == this.myCoinsList[i].coin.pairing_id) {
              this.cryptoRecent.push({
                cryptoCurrency: this.cryptoCurrency[j],
                myCoins: this.myCoinsList[i]
              })
            }
          }
        }
        for (let i = 0; i < this.cryptoRecent.length; i++) {
          console.log(this.cryptoRecent[i].myCoins.totalPrice + 'type :' + typeof this.cryptoRecent[i].myCoins.totalPrice)
          this.cryptoRecent[i].myCoins.totalPrice = this.provider.decimalFormat(this.cryptoRecent[i].myCoins.totalPrice);
          this.cryptoRecent[i].myCoins.totalQuantity = this.provider.decimalFormat(this.cryptoRecent[i].myCoins.totalQuantity);
        }
      }
      console.log('this.cryptoCurrency')
      console.dir(this.cryptoCurrency)
      console.log('this.myCoinsList')
      console.dir(this.myCoinsList)
      console.log('this.cryptoRecent')
      console.dir(this.cryptoRecent)

    }, 300);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FolioPage');
  }

  openDetailsPage(crypto) {
    this.navCtrl.push(DetailsPage, crypto)
    this.provider.coinsKey = crypto.myCoins.$key;
    console.dir(crypto)
  }

  ngOnInit() {
    this.provider.getUserLogin().then(data => {
      this.content.resize();
    })
  }

  removeFavorite(slidingItem: ItemSliding, crypto: any) {
    let confirm = this.alertCtrl.create({
      title: 'Remove Coin',
      message: 'Are you sure you want to remove this coin? Any holdings associated with this coin will also be removed.',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.provider.removedMyCoins(crypto.myCoins.$key);
            let index = this.cryptoRecent.indexOf(crypto);
            this.cryptoRecent.splice(index, 1);

          }
        }
      ]
    });
    confirm.present();
    slidingItem.close();
  }

}
