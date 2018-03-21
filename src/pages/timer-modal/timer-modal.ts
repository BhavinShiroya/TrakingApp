import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';

/**
 * Generated class for the TimerModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timer-modal',
  templateUrl: 'timer-modal.html',
})
export class TimerModalPage {

  timerData = {
    date: '',
  };

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
    var now = moment();
    this.timerData.date = moment(now.format(), moment.ISO_8601).format();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimerModalPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  setReminder() {
    this.viewCtrl.dismiss(this.timerData.date);
  }
}
