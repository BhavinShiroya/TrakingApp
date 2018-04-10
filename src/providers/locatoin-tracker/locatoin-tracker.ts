import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse
} from "@ionic-native/background-geolocation";
import {
  Geolocation,
  GeolocationOptions,
  Geoposition
} from "@ionic-native/geolocation";
import "rxjs/add/operator/filter";
import { Storage } from "@ionic/storage";
import { AuthServicesProvider } from "../../providers/auth-services/auth-services";
/*
  Generated class for the LocatoinTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocatoinTrackerProvider {
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  constructor(
    private geolocation: Geolocation,
    private backgroundGeolocation: BackgroundGeolocation,
    public zone: NgZone,
    private storage: Storage,
    private AuthServices: AuthServicesProvider
  ) {
    console.log("Hello LocatoinTrackerProvider Provider");
  }

  pushLocation(notificationObject) {
    console.log(
      "Sending user location for " + notificationObject.name + " which is",
      this.lat,
      this.lng,
      " on " + new Date()
    );
    this.storage.get("user").then(data => {
      this.AuthServices.saveTimers(JSON.parse(data).uid, notificationObject, {
        longitude: this.lng,
        latitude: this.lat
      }).then(data => {
        console.log("Function to get position:save time");
      });
    });
  }

  printBackground() {
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 1,
      distanceFilter: 1,
      debug: false,
      interval: 1000
    };

    this.backgroundGeolocation.configure(config).subscribe(
      location => {
        // console.log(
        //   "BackgroundGeolocation:  " +
        //     location.latitude +
        //     "," +
        //     location.longitude
        // );

        // Run update inside of Angular's zone

        this.zone.run(() => {
          this.lat = location.latitude;
          this.lng = location.longitude;
        });
        // this.backgroundGeolocation.finish();
      },
      err => {
        console.log(err);
      }
    );

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();

    // Foreground Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation
      .watchPosition(options)
      .filter((p: any) => p.code === undefined)
      .subscribe((position: Geoposition) => {
        // console.log(position);

        // Run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        });
      });
  }

  startTracking(): void {
    
    this.printBackground();
  }
  stopTracking(): void {
    // console.log("stopped");
    this.backgroundGeolocation.stop();
    this.watch.unsubscribe();
  }
}
