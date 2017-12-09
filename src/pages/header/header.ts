import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatacoinProvider } from '../../providers/datacoin/datacoin';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the HeaderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
})
export class HeaderPage {
  usersData: FirebaseListObservable<any[]>;
  myCoinsData: FirebaseListObservable<any[]>;

  usersArray: any[];
  username: any;
  totalPrice: any = 0;
  test: any;

  userLogin: any;
  myCoins: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public provider: DatacoinProvider,
    public angularfire: AngularFireDatabase) {

    this.provider.getUserLogin().then(data => {
      console.log('Header : ')
      console.dir(data);
      if (data) {
        console.log('Header : ' + data)
        this.userLogin = data.user;
        this.username = this.userLogin.username
        this.myCoinsData = this.angularfire.list('/users/' + data.key + '/myCoins')
        this.myCoinsData.subscribe(data => {
          this.myCoins = data;
          this.totalPrice = 0;
          for (let i = 0; i < this.myCoins.length; i++) {
            let totalEachCoin = this.myCoins[i].totalPrice;
            this.totalPrice += totalEachCoin
          }
          this.totalPrice = (+this.totalPrice).toFixed(2);
        })
      }

    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HeaderPage');
  }

}
