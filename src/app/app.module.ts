import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
// import {BackgroundGeolocatio} from '@ionic-native'
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { environment } from "../environments/environment";
import { IonicStorageModule } from "@ionic/storage";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { Diagnostic } from "@ionic-native/diagnostic";
// import { BackgroundMode } from "@ionic-native/background-mode";
import { MyApp } from "./app.component";
import { AuthServicesProvider } from "../providers/auth-services/auth-services";
import { ToasterServicesProvider } from "../providers/toaster-services/toaster-services";
import { LoadingServicesProvider } from "../providers/loading-services/loading-services";
import { Geolocation } from "@ionic-native/geolocation";
import { DatePicker } from "@ionic-native/date-picker";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
// import { BackgroundMode } from '@ionic-native/background-mode';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse
} from "@ionic-native/background-geolocation";
import { TimerServiceProvider } from "../providers/timer-service/timer-service";
import { LocatoinTrackerProvider } from "../providers/locatoin-tracker/locatoin-tracker";
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    LocationAccuracy,
    Diagnostic,
    DatePicker,
    // BackgroundMode,
    BackgroundGeolocation,
    LocalNotifications,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthServicesProvider,
    AndroidPermissions,
    ToasterServicesProvider,
    LoadingServicesProvider,
    TimerServiceProvider,
    LocatoinTrackerProvider,
    ApiServiceProvider
  ]
})
export class AppModule {}
