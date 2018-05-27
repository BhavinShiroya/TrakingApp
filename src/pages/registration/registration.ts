import { LoadingServicesProvider } from './../../providers/loading-services/loading-services';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
import { ToasterServicesProvider } from '../../providers/toaster-services/toaster-services';

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {
  formData = {
    first_name: '',
    email: '',
    password: '',
    confirm_password: '',
    emergency_email: '',
  };

  errorMessage = '';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public AuthServices: AuthServicesProvider,
    public Toaster: ToasterServicesProvider,
    public loading: LoadingServicesProvider
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
  }

  signUp() {
    this.loading.show();
    let signUpDetail = {
      name: this.formData.first_name,
      email: this.formData.email,
      password: this.formData.password,
      manager_email: this.formData.emergency_email,
      phone: "123"
    };
    this.AuthServices.emailSignUp(signUpDetail).subscribe((result: any) => {
      // this.AuthServices.sendEmailVerification();
      // this.AuthServices.updateUserData(result, this.formData);
      this.Toaster.showToast('Registration Successfully!');
      this.navCtrl.setRoot('LoginPage');
      this.loading.hide();
    }, (error) => {
      this.loading.hide();
      this.Toaster.showToast(error.message);
    });
  }

}