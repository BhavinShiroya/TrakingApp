import { Component } from '@angular/core';
import { IonicPage, Events, NavController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ViewController, ModalController } from 'ionic-angular';
import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
import { ToasterServicesProvider } from '../../providers/toaster-services/toaster-services';
import { LoadingServicesProvider } from './../../providers/loading-services/loading-services';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = { email: '', password: '' };
  errorMessage = '';
  userData: any;
  constructor(
    public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public AuthServices: AuthServicesProvider,
    public Toaster: ToasterServicesProvider,
    public loading: LoadingServicesProvider,
    public storage: Storage,
    public events: Events,
    public alertCtrl: AlertController
  ) {
    this.storage.get('user').then((name) => {
      if (name) {
        this.navCtrl.setRoot('home-page');
      }
    });
  }

  ionViewDidLoad() {
  }

  openForgetPasswordPage() {
    let alert = this.alertCtrl.create({
      title: 'Forgot Password',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send Mail',
          handler: data => {
            this.AuthServices.sendPassword(data.email);
          }
        }
      ]
    });
    alert.present();
  }

  openSignUpPage() {
    this.navCtrl.push('RegistrationPage');
  }

  login() {
    this.loading.show();
    this.AuthServices.emailLogin(this.user.email, this.user.password).then((result) => {
      this.loading.hide();
      if (result.emailVerified) {
        this.storage.set('user', JSON.stringify(result));
        this.events.publish('user:loggedin', result);
        this.navCtrl.setRoot('home-page');
      } else {
        this.Toaster.showToast('mail send successfully.');
        this.AuthServices.sendEmailVerification();
      }
    }).catch((error) => {
      this.loading.hide();
      this.Toaster.showToast(error.message);
    });
  }
}
