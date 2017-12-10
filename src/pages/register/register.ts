import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatacoinProvider } from '../../providers/datacoin/datacoin';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  signupForm: FormGroup;
  errorUsername: string = '';
  errorPassword: string = '';
  errorRepassword: string = '';
  errorEmailswap: string = '';
  errorEmail: string = '';
  usernameAlready: boolean;
  errorMsgRegis : string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public provider: DatacoinProvider) {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(8)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      rePassword: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  validate(): boolean {

    if (this.signupForm.valid) {
      return true;
    }
    let controlUsername = this.signupForm.controls['username'];
    let controlPassword = this.signupForm.controls['password'];
    let controlRepassword = this.signupForm.controls['rePassword'];
    let controlEmail = this.signupForm.controls['email'];

    if (controlUsername.invalid) {
      if (controlUsername.errors['required']) {
        this.errorUsername = '*Please provide a username.';
      } else if (controlUsername.errors['minlength']) {
        this.errorUsername = '*The username must have at least ' + controlUsername.errors['minlength'].requiredLength + ' characters.';
      } else if (controlUsername.errors['pattern']) {
        this.errorUsername = '*Only a-z, A-Z, 0-9 allowed in Username';
      }
    }

    if (controlPassword.invalid) {
      if (controlPassword.errors['required']) {
        this.errorPassword = '*Please provide a password.';
      } else if (controlPassword.errors['minlength']) {
        this.errorPassword = '*The password must have at least ' + controlPassword.errors['minlength'].requiredLength + ' characters.';
      }
    }

    if (controlRepassword.invalid) {
      if (controlRepassword.errors['required']) {
        this.errorRepassword = '*Please provide a password.';
      } else if (controlRepassword.errors['minlength']) {
        this.errorRepassword = '*The password must have at least ' + controlRepassword.errors['minlength'].requiredLength + ' characters.';
      }
    } else {
      if (controlPassword.value != controlRepassword.value) {
        console.log('controlRepassword : no match');
        this.errorRepassword = '* The password is not match!!';
      }
    }

    if (controlEmail.invalid) {
      if (controlEmail.errors['required']) {
        this.errorEmail = '* Please provide a email.';
      } else if (controlEmail.errors['pattern']) {
        this.errorEmail = '* The email must have "@" in your email.'
        this.errorEmailswap = 'Example : example123@gmail.com';
      }
    }

    return false;
  }


  signUp(): void {
    this.errorUsername = '';
    this.errorPassword = '';
    this.errorRepassword = '';
    this.errorEmail = '';
    this.errorEmailswap = '';
    if (this.validate()) {
      console.log(this.signupForm.value);
      let allUser = this.provider.getAllUSer();
      let newUser = {
        username: this.signupForm.value.username,
        password: this.signupForm.value.password,
        email: this.signupForm.value.email
      }
      for (let i = 0; i < allUser.length; i++) {
        if (newUser.username == allUser[i].username && newUser.email == allUser[i].email  ) {
          this.usernameAlready = true
          this.errorMsgRegis = 'This username and email already!'
          break;
        } else if (newUser.username == allUser[i].username) {
          this.usernameAlready = true
          this.errorMsgRegis = 'This username already!'
          break;
        } else if (newUser.email == allUser[i].email) {
          this.usernameAlready = true
          this.errorMsgRegis = 'This email already!'
          break;
        }else {
          this.usernameAlready = false
        }
      }

      if(!this.usernameAlready){
        this.provider.registerUser(newUser);
        let alertComplete = this.alertCtrl.create({
          title: 'Registration Succesful',
          subTitle: 'Your have successfully registered for CoinFolio. See you in CoinFolio'
        });

        alertComplete.present();
        setTimeout(() => {
          alertComplete.dismiss();
          this.navCtrl.pop()
        }, 1700);
      }
    }
  }

  afterKeyUsername() {
    this.errorUsername = '';
  }
  afterKeyPassword() {
    this.errorPassword = '';
  }
  afterKeyRepassword() {
    this.errorRepassword = '';
  }
  afterKeyEmail() {
    this.errorEmail = '';
  }

  goToLogin() {
    this.navCtrl.pop();

  }
}
