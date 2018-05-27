import { Component, ViewChild } from "@angular/core";
import {
  Platform,
  Events,
  NavController,
  AlertController
} from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { LoadingServicesProvider } from "../providers/loading-services/loading-services";
import { AuthServicesProvider } from "../providers/auth-services/auth-services";
import { Storage } from "@ionic/storage";
import { ToasterServicesProvider } from "../providers/toaster-services/toaster-services";
import { Diagnostic } from "@ionic-native/diagnostic";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { LocatoinTrackerProvider } from "./../providers/locatoin-tracker/locatoin-tracker";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild("myNav") nav: NavController;

  rootPage: any = "LoginPage";
  userData: any;
  constructor(
    platform: Platform,
    public Toaster: ToasterServicesProvider,
    public locationAccuracy: LocationAccuracy,
    public diagnostic: Diagnostic,
    private alertCtrl: AlertController,
    public events: Events,
    public loading: LoadingServicesProvider,
    public storage: Storage,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public AuthServices: AuthServicesProvider,
    private locationTracker: LocatoinTrackerProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      this.locationTracker.startTracking();
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      events.subscribe("user:loggedin", user => {
        if (user.uid) {
          this.AuthServices.getUserData(user.uid).subscribe(data => {
            this.userData = data;
          });
        }
      });
    });
  }

  setPage(page) {
    this.nav.setRoot(page);
  }

  logOut() {
    this.AuthServices.signOut()
      .then(result => {
        this.storage.remove("user").then(() => {
          this.nav.push("LoginPage");
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}
