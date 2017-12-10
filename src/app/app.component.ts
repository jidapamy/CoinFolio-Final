import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';


import { HomePage } from '../pages/home/home';
import { ChatPage } from '../pages/chat/chat';
import { NewsPage } from '../pages/news/news';
import { SettingPage } from '../pages/setting/setting';
import { FolioPage } from '../pages/folio/folio';
import { LoginPage } from '../pages/login/login';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { DatacoinProvider } from '../providers/datacoin/datacoin';
import { Content } from 'ionic-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  // rootPage: any = FolioPage;
  // rootPage: any = TutorialPage;
  activeMenu: string;
  username: any = '';
  test: any = '';
  test2: any = '';
  @ViewChild(Content) content: Content

  pagesForLogin: Array<{ icon: string; title: string, component: any }>;
  pages: Array<{ icon: string; title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    private faio: FingerprintAIO,
    public splashScreen: SplashScreen,
    public provider: DatacoinProvider,
    public storage: Storage,
    public menuControl: MenuController,
    public modalCtrl: ModalController
  ) {
    this.initializeApp();
    this.changeLogoutMenuControl()

    this.provider.getUserLogin().then((data) => {
      if (data != '') {
        this.username = data.user.username;
        this.content.resize();
        console.log('Menu Constructor: ' + this.username)
        if (this.username == undefined || this.username == '') {
          console.log('undefined Menu Constructor: ' + this.username)
          // this.activeMenu = "notLogin"
          this.menuControl.enable(true, "notLogin")
          this.menuControl.enable(false, 'login');
        } else {
          console.log('Menu Constructor: ' + this.username)
          this.menuControl.enable(true, "login")
          this.menuControl.enable(false, 'notLogin');
        }
      }

    })



    // used for an example of ngFor and navigation
    this.pagesForLogin = [
      { icon: 'home', title: 'Home', component: HomePage },
      { icon: 'star', title: 'My Folio', component: FolioPage },
      { icon: 'information-circle', title: 'News', component: NewsPage },
      { icon: 'chatbubbles', title: 'Talks', component: ChatPage },
      { icon: 'settings', title: 'Settings', component: SettingPage }
    ];

    this.pages = [
      { icon: 'home', title: 'Home', component: HomePage },
      { icon: 'information-circle', title: 'News', component: NewsPage },
      { icon: 'chatbubbles', title: 'Talks', component: ChatPage },
    ];

    if (this.username == '') {
      this.test = 'null';
    } else {
      this.test = this.username;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyApp');
    // this.username = this.provider.getUsername();
    // console.log('Username: '+this.username);
    // if (this.username == '') {
    //   this.test2 = 'null';
    // } else {
    //   this.test2 = this.username;
    // }
    // console.log('Test: ' + this.test);

  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('OKKK')
      this.content.resize();

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    let statusFingerprint;
    this.provider.getFingerprint().then(data => {
      statusFingerprint = data;
      console.log('statusFingerprint ' + statusFingerprint);
      if (page.component == FolioPage) {
        if (statusFingerprint) {
          this.faio.show({
            clientId: 'Figer',
            clientSecret: 'password',
            localizedFallbackTitle: 'Use Pin',
            localizedReason: 'Please authenticate'
          }).then((result: any) => {
            this.nav.setRoot(page.component);
          }).catch((error: any) => {
            console.log('err: ', error);
          });
        } else {
          this.nav.setRoot(page.component);
        }
      } else {
        this.nav.setRoot(page.component);
      }
    })
    // this.nav.setRoot(page.component);

  }

  logout() {
    this.provider.setUserLogin('');
    this.username = '';
    this.nav.setRoot(HomePage);
    this.content.resize();
    this.changeLogoutMenuControl();
  }

  login() {
    this.nav.push(LoginPage);


  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.content.resize();
    console.log('ionViewWillEnter : ' + this.username)
  }


  // doRefresh(refresher) {
  //   console.log("5555555");
  //   setTimeout(() => {
  //     this.content.resize();
  //     refresher.complete();
  //     console.log('refresher')
  //     console.log('USername refresh: '+this.username)
  //   }, 500);
  // }

  changeLogoutMenuControl() {
    this.activeMenu = "notLogin"
    this.menuControl.enable(true, this.activeMenu)
    this.menuControl.enable(false, 'login');
  }
  changeLoginMenuControl() {
    this.activeMenu = "login"
    this.menuControl.enable(true, this.activeMenu)
    this.menuControl.enable(false, 'notLogin');
  }

  ngAfterViewInit() {
    let statusStorage;
    this.provider.getDataTutorial().then(data => {
      statusStorage = data;
      console.log('statusStorage ' + statusStorage)
      if (!statusStorage) {
        let modal = this.modalCtrl.create(TutorialPage);
        modal.present();
      } else {
        let modal = this.modalCtrl.create(HomePage);
      }
    })
  }

}
