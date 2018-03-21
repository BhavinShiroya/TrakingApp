import { TimerServiceProvider } from './../../providers/timer-service/timer-service';
import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { LoadingServicesProvider } from './../../providers/loading-services/loading-services';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { ToasterServicesProvider } from './../../providers/toaster-services/toaster-services';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
import { DatePicker } from '@ionic-native/date-picker';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import * as moment from 'moment';

@IonicPage({
  name: 'home-page'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @Input() timeInSeconds: number;
  myDate: any;
  setTime: any;
  hoursString = '';
  minutesString = '';
  secondsString = '';
  daysString = '';
  showTime = '';
  currentPos: Geoposition;
  location: any;
  isGPSOn = false;
  timerArray: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private datePicker: DatePicker,
    public modalCtrl: ModalController,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    public loading: LoadingServicesProvider,
    public timer: TimerServiceProvider,
    public storage: Storage,
    private androidPermissions: AndroidPermissions,
    public diagnostic: Diagnostic,
    public AuthServices: AuthServicesProvider,
    public Toaster: ToasterServicesProvider,
    public localNotifications: LocalNotifications) {
    this.platform.ready().then(() => {
      this.checkGPS();
    });
  }

  ionViewDidEnter() {
    // this.storage.get('user').then((data) => {
    //   console.log(JSON.parse(data).uid);
    //   // this.AuthServices.saveTimers(pos, JSON.parse(data).uid).then((data) => {
    //   //   this.Toaster.showToast('saved Successully.');
    //   // });
    // });
    //as
    this.storage.get('timer').then((data) => {
      this.timerArray = JSON.parse(data);
      if (!this.timerArray || this.timerArray.length === 0) {
        this.timerArray = [];
      }
      if (this.timerArray.length > 0) {
        this.timerTick();
      }
    });
  }

  checkGPS() {
    this.diagnostic.isLocationEnabled().then((isAvailable) => {
      if (!isAvailable) {
        this.isGPSOn = false;
        this.enableLocation();
      } else {
        this.Toaster.showToast('location set successfully');
        this.isGPSOn = true;
        this.getUserPosition();
      }
    })
      .catch((e) => {
        this.isGPSOn = false;
        alert('erro');
        this.Toaster.showToast('Error in Location get...');
      });
  }

  enableLocation() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => { this.isGPSOn = true; this.Toaster.showToast('Location set Successfully'); },
          error => {
            this.Toaster.showToast('Error in Location')
            this.isGPSOn = false;
          }
        );
      }
    });
  }

  getUserPosition() {
    var options = {
      maximumAge: 3000,
      timeout: 1000,
      enableHighAccuracy: true
    };

    this.geolocation.getCurrentPosition(options).then((pos: Geoposition) => {
      this.currentPos = pos;
      console.log(this.currentPos);
      alert(this.currentPos.coords.latitude);
      alert(this.currentPos.coords.longitude);
      this.storage.get('user').then((data) => {
        this.AuthServices.saveTimers(JSON.parse(data).uid, pos).then((data) => {
          this.Toaster.showToast('saved Successully.');
        });
      });
    }, (err: PositionError) => {
      console.log("error : " + err.message);
      alert(err.message);
    });
  }

  addTimer() {
    const profileModal = this.modalCtrl.create('TimerModalPage');
    profileModal.onDidDismiss(data => {
      if (data) {
        var currentDate = moment();
        var setDateObject = moment(data);
        if (moment.duration(setDateObject.diff(currentDate)).seconds() > 0) {
          var dateObject = {
            'setTime': setDateObject,
            'days': moment.duration(setDateObject.diff(currentDate)).days(),
            'hours': moment.duration(setDateObject.diff(currentDate)).hours(),
            'minutes': moment.duration(setDateObject.diff(currentDate)).minutes(),
            'seconds': moment.duration(setDateObject.diff(currentDate)).seconds(),
            'showTime': moment.duration(setDateObject.diff(currentDate)).days() + ':' + moment.duration(setDateObject.diff(currentDate)).hours() + ':' + moment.duration(setDateObject.diff(currentDate)).minutes() + ':' + moment.duration(setDateObject.diff(currentDate)).seconds(),
          };
          this.timerArray.push(dateObject);
          this.storage.set('timer', JSON.stringify(this.timerArray));
          this.timerTick();
        } else {
          this.Toaster.showToast('Please Select above then current date.');
        }
      }
    });
    profileModal.present();
  }

  onScroll(event) {

  }
  // initTimer() {
  //   if (!this.timeInSeconds) { this.timeInSeconds = 0; }
  // }

  timerTick() {
    var timer = setTimeout(() => {
      console.log(this.timerArray.length);
      if (this.timerArray.length === 0) {
        clearInterval(timer);
      } else {
        for (var i = 0; i < this.timerArray.length; i++) {
          var currentDate = moment().format();
          if (moment(this.timerArray[i].setTime).diff(currentDate, 'seconds') > 0) {
            this.timerArray[i].days = moment.duration(moment(this.timerArray[i].setTime).diff(currentDate)).days();
            this.timerArray[i].hours = moment.duration(moment(this.timerArray[i].setTime).diff(currentDate)).hours();
            this.timerArray[i].minutes = moment.duration(moment(this.timerArray[i].setTime).diff(currentDate)).minutes();
            this.timerArray[i].seconds = moment.duration(moment(this.timerArray[i].setTime).diff(currentDate)).seconds();
            this.timerArray[i].showTime = this.timerArray[i].days + ':' + this.timerArray[i].hours + ':' + this.timerArray[i].minutes + ':' + this.timerArray[i].seconds;
            this.storage.set('timer', JSON.stringify(this.timerArray));
          } else {
            this.sendNotification(this.timerArray[i]);
            this.timerArray.splice(i, 1);
            this.storage.set('timer', JSON.stringify(this.timerArray));
          }
        }
        this.timerTick();
      }
    }, 1000);
  }

  deleteTimer(index) {
    this.timerArray.splice(index, 1);
    this.storage.set('timer', JSON.stringify(this.timerArray));
  }

  sendNotification(object) {
    this.localNotifications.schedule({
      id: object.setTime,
      title: 'Attention',
      text: 'timer close',
      data: { mydata: 'My hidden message this is' }
    });
    this.getUserPosition();
  }
}
