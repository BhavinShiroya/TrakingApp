import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the LoadingServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingServicesProvider {
  loading;
  constructor(public loadingCtrl: LoadingController) {
    console.log('Hello LoadingServicesProvider Provider');
  }

  show() {
    this.loading = this.loadingCtrl.create({
      duration: 10000
    });
    this.loading.present();
  }

  hide() {
    try {
      this.loading.dismiss();
    } catch (error) { }
  }

  autoHide(time) {
    this.loading = this.loadingCtrl.create({
      duration: time
    });
    this.loading.present();
  }
}
