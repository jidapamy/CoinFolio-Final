import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DatacoinProvider } from '../../providers/datacoin/datacoin';
import { RegisterPage } from '../register/register';
import { MyApp } from '../../app/app.component';



// import firebase from 'firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  errorUsername: string = '';
  errorPassword: string = '';
  invalid: boolean;
  activeMenu: string;
  allUsers: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public angularfire: AngularFireDatabase,
    public alertCtrl: AlertController,
    public provider: DatacoinProvider,
    public menuControl: MenuController) {
    this.menuControl.swipeEnable(false);            // set Menu not active
    this.provider.userData.subscribe(data => {
      this.allUsers = data
    })

    this.loginForm = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  validate(): boolean {
    this.errorUsername = '';
    this.errorPassword = '';

    if (this.loginForm.valid) {
      return true;
    }
    let controlUsername = this.loginForm.controls['username'];
    let controlPassword = this.loginForm.controls['password'];

    if (controlUsername.invalid) {
      if (controlUsername.errors['required']) {
        this.errorUsername = '*Username is a required field';
      }
    }

    if (controlPassword.invalid) {
      if (controlPassword.errors['required']) {
        this.errorPassword = '*Password is a required field';
      }
    }

    return false;
  }


  logIn(): void {
    if (this.validate()) {
      console.log(this.loginForm.value);
      this.invalid = false;
      let alertComplete = this.alertCtrl.create({
        title: 'Login Succesful',
        subTitle: 'Your have been logged in! We hope your enjoy your time with CoinFolio'
      });

      // check user 
      for (let i = 0; i < this.allUsers.length; i++) {
        if (this.allUsers[i].username.toLowerCase() == this.loginForm.value.username.toLowerCase() && this.allUsers[i].password == this.loginForm.value.password) {
          this.invalid = false;
          this.provider.setUserLogin({ user: this.allUsers[i], key: this.allUsers[i].$key });
          setTimeout(() => {
            alertComplete.present().then(() => {
              setTimeout(() => {
                alertComplete.dismiss();
                this.changeLoginMenuControl();  // change status in Menu
                this.navCtrl.push(MyApp)
              }, 1700);
            }).catch(() => {
              alertComplete.dismiss();
            });
          }, 0);
          break;
        } else {
          console.log('invalid')
          this.invalid = true
        }
      }
    }
  }
  afterKeyUsername() {
    this.errorUsername = '';
  }
  afterKeyPassword() {
    this.errorPassword = '';
  }
  register() {
    this.navCtrl.push(RegisterPage);
  }

  changeLoginMenuControl() {
    this.activeMenu = "login"
    this.menuControl.enable(true, this.activeMenu)
    this.menuControl.enable(false, 'notLogin');
  }
  goBack() {
    this.navCtrl.pop()
  }
}
