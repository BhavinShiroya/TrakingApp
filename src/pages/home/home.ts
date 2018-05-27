import { TimerServiceProvider } from "./../../providers/timer-service/timer-service";
import { Component, Input, NgZone } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Platform
} from "ionic-angular";

import "rxjs/add/operator/filter";
import { LocatoinTrackerProvider } from "./../../providers/locatoin-tracker/locatoin-tracker";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { LoadingServicesProvider } from "./../../providers/loading-services/loading-services";
import {
  Geolocation,
  GeolocationOptions,
  Geoposition
} from "@ionic-native/geolocation";
import { ToasterServicesProvider } from "./../../providers/toaster-services/toaster-services";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { AuthServicesProvider } from "../../providers/auth-services/auth-services";
import { DatePicker } from "@ionic-native/date-picker";
import { Storage } from "@ionic/storage";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { Diagnostic } from "@ionic-native/diagnostic";
// import { BackgroundMode } from "@ionic-native/background-mode";
import { BackgroundGeolocation } from "@ionic-native/background-geolocation";
// import { BackgroundMode } from "@ionic-native/background-mode";
import * as moment from "moment";
import { Subscription } from "rxjs/Subscription";

@IonicPage({
  name: "home-page"
})
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  @Input() timeInSeconds: number;
  myDate: any;
  setTime: any;
  hoursString = "";
  minutesString = "";
  secondsString = "";
  daysString = "";
  showTime = "";
  currentPos: Geoposition;
  location: any;
  isGPSOn = false;
  timerArray: Array<any> = [];
  timerTime: any;
  warningTime: any;
  extraTimer: Array<any> = [];
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  constructor(
    public navCtrl: NavController,
    // public bg: BackgroundMode,
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
    public localNotifications: LocalNotifications,
    private backgroundGeolocation: BackgroundGeolocation,
    // private backgroundMode: BackgroundMode,
    private locationTracker: LocatoinTrackerProvider
  ) {
    this.platform.ready().then(() => {
      this.checkGPS();
      //this.locationTracker.startTracking();
      //this.backgroundMode.enable();

      this.localNotifications.on("trigger", notification => {
        console.log(notification);
      });
    });
  }

  ionViewDidEnter() {
    this.storage.get("timer").then(data => {
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
    this.diagnostic
      .isLocationEnabled()
      .then(isAvailable => {
        if (isAvailable) {
          // this.Toaster.showToast('location set successfully');
          this.isGPSOn = true;
          //this.locationTracker.startTracking();
        } else {
          this.isGPSOn = false;
          this.enableLocation();
        }
      })
      .catch(e => {
        // this.isGPSOn = false;
        // alert('erro');
        // this.Toaster.showToast('Error in Location get...');
      });
  }

  enableLocation() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy
          .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
          .then(
            () => {
              this.isGPSOn = true;
              this.Toaster.showToast("Location set Successfully");
            },
            error => {
              this.Toaster.showToast("Error in Location");
              this.isGPSOn = false;
            }
          );
      }
    });
  }

  addTimer() {
    const profileModal = this.modalCtrl.create("TimerModalPage");
    profileModal.onDidDismiss(data => {
      if (data) {
        var currentDate = moment();
        var setDateObject = moment(data.date);
        var endTimeObj = moment(data.date).add(30, "seconds");

        if (moment.duration(setDateObject.diff(currentDate)).seconds() > 0) {
          var dateObject = {
            name: data.name,
            setTime: setDateObject,
            endTime: endTimeObj,
            days: moment.duration(setDateObject.diff(currentDate)).days(),
            hours: moment.duration(setDateObject.diff(currentDate)).hours(),
            minutes: moment.duration(setDateObject.diff(currentDate)).minutes(),
            seconds: moment.duration(setDateObject.diff(currentDate)).seconds(),
            showTime:
              moment.duration(setDateObject.diff(currentDate)).days() +
              ":" +
              moment.duration(setDateObject.diff(currentDate)).hours() +
              ":" +
              moment.duration(setDateObject.diff(currentDate)).minutes() +
              ":" +
              moment.duration(setDateObject.diff(currentDate)).seconds()
          };
          // dateObject.endTime = dateObject.endTime.add(30, "seconds");
          console.log(dateObject);
          this.timerArray.push(dateObject);
          this.storage.set("timer", JSON.stringify(this.timerArray));
          this.timerTick();
          this.scheduleNotification(dateObject);
        } else {
          this.Toaster.showToast("Please Select above then current date.");
        }
      }
    });
    profileModal.present();
  }

  scheduleNotification(object) {
    this.localNotifications.schedule({
      id: object.setTime,
      title: "Attention",
      text: object.name,
      data: { mydata: "My hidden message this is" },
      at: new Date(object.setTime)
    });
  }

  onScroll(event) {}
  // initTimer() {
  //   if (!this.timeInSeconds) { this.timeInSeconds = 0; }
  // }

  timerTick() {
    this.timerTime = setTimeout(() => {
      if (this.timerArray.length === 0) {
        clearInterval(this.timerTime);
      } else {
        for (var i = 0; i < this.timerArray.length; i++) {
          var currentDate = moment().format();
          if (
            moment(this.timerArray[i].setTime).diff(currentDate, "seconds") > 0
          ) {
            this.timerArray[i].days = moment
              .duration(moment(this.timerArray[i].setTime).diff(currentDate))
              .days();
            this.timerArray[i].hours = moment
              .duration(moment(this.timerArray[i].setTime).diff(currentDate))
              .hours();
            this.timerArray[i].minutes = moment
              .duration(moment(this.timerArray[i].setTime).diff(currentDate))
              .minutes();
            this.timerArray[i].seconds = moment
              .duration(moment(this.timerArray[i].setTime).diff(currentDate))
              .seconds();
            this.timerArray[i].showTime =
              this.timerArray[i].days +
              ":" +
              this.timerArray[i].hours +
              ":" +
              this.timerArray[i].minutes +
              ":" +
              this.timerArray[i].seconds;
            this.storage.set("timer", JSON.stringify(this.timerArray));
          } else {
            if (!this.timerArray[i].timeOut) {
              console.log(
                "Notification time for " +
                  this.timerArray[i].name +
                  " is " +
                  new Date()
              );
              //this.sendNotification(this.timerArray[i]);
            }
            this.timerArray[i].timeOut = true;
            // console.log(
            //   "notifying user for ",
            //   this.timerArray[i] + " on " + new Date()
            // );
            // this.timerArray.splice(i, 1);
            // this.storage.set("timer", JSON.stringify(this.timerArray));
          }

          if (
            moment(this.timerArray[i].endTime).diff(currentDate, "seconds") < 1
          ) {
            this.locationTracker.pushLocation(this.timerArray[i]);
            this.extraTimer.push(this.timerArray[i]);
            this.timerArray.splice(i, 1);
            this.storage.set("timer", JSON.stringify(this.timerArray));
          }
        }
        this.timerTick();
      }
    }, 1000);
  }

  deleteTimer(index) {
    this.timerArray.splice(index, 1);
    this.storage.set("timer", JSON.stringify(this.timerArray));
  }
  sendNotification(object) {
    // this.locationTracker.stopTracking();
    this.localNotifications.schedule({
      id: object.setTime,
      title: "Attention",
      text: object.name,
      data: { mydata: "My hidden message this is" },
      at: new Date()
    });
    // this.localNotifications.is
    // this.addWarnTimer(object);
  }
}
