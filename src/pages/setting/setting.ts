import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, AlertController, Content } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatacoinProvider } from '../../providers/datacoin/datacoin';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { PrivacyPage } from '../privacy/privacy';
import { TutorialPage } from '../tutorial/tutorial';
import { EmailComposer } from '@ionic-native/email-composer';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  @ViewChild(Content) content: Content
  checkedFiger: boolean;
  statusToggle: boolean;

  constructor(public provider: DatacoinProvider,private faio: FingerprintAIO,private EmailComposer:EmailComposer,public navCtrl: NavController, public navParams: NavParams){
    this.provider.getFingerprint().then(data => {
      this.statusToggle = data;
      this.content.resize();
    })
  }
  goToFeedback() {
    let email = {
      to: 'admin@coinsfolio.com',
      cc: 'support@coinsfolio.com',
     
      
      subject: 'Suggestions for Blockfolio ios',
      body: 'Thank you for Suggestions',
      isHtml: true
    };
    this.EmailComposer.open(email);
  }
  goToPrivacy() {
    this.navCtrl.push(PrivacyPage);

  }
  goToTutorail() {
    this.navCtrl.push(TutorialPage);

  } 
  checkToggle(){
    this.statusToggle = !this.statusToggle;
    this.provider.setFingerprint(this.statusToggle);
  }
}




