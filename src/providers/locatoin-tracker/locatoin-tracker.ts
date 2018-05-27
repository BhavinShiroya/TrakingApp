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
  public locations = [];
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
      desiredAccuracy: 10,
      stationaryRadius: 5,
      distanceFilter: 10,
      debug: true,
      interval: 1000,
      url: 'http://52.66.98.74/api/post-lat-long',
      params: {
        lat: '13',
        long: '33',
        time: new Date()
      },
      param:{
        lat: '13',
        long: '33',
        time: new Date()
      }
    };
    this.backgroundGeolocation.changePace(true).then((location) => {
      console.log("-------Change Pace------------", location);
      this.storage.get("user").then(data => {
        this.AuthServices.saveTimers(
          JSON.parse(data).uid,
          { name: "test - pace", time: new Date() },
          {
            longitude: this.lng,
            latitude: this.lat
          }
        ).then(data => {
          console.log("Function to get position:save time");
        });
      });
    })
    this.backgroundGeolocation.onStationary().then((location) => {
      console.log("-------On Stationary------------", location);
      this.storage.get("user").then(data => {
        this.AuthServices.saveTimers(
          JSON.parse(data).uid,
          { name: "test - stationary", time: new Date() },
          {
            longitude: this.lng,
            latitude: this.lat
          }
        ).then(data => {
          console.log("Function to get position:save time");
        });
      });
    });
    this.backgroundGeolocation
      .configure(config)
      .subscribe((location: BackgroundGeolocationResponse) => {
        // console.log(
        //   "BackgroundGeolocation:  " +
        //     location.latitude +
        //     "," +
        //     location.longitude
        // );

        // Run update inside of Angular's zone
        this.backgroundGeolocation.changePace(true).then((location) => {
          console.log("-------Change Pace------------", location);
          this.storage.get("user").then(data => {
            this.AuthServices.saveTimers(
              JSON.parse(data).uid,
              { name: "test - pace", time: new Date() },
              {
                longitude: this.lng,
                latitude: this.lat
              }
            ).then(data => {
              console.log("Function to get position:save time");
            });
          });
        })
        this.backgroundGeolocation.onStationary().then((location) => {
          console.log("-------On Stationary------------", location);
          this.storage.get("user").then(data => {
            this.AuthServices.saveTimers(
              JSON.parse(data).uid,
              { name: "test - stationary", time: new Date() },
              {
                longitude: this.lng,
                latitude: this.lat
              }
            ).then(data => {
              console.log("Function to get position:save time");
            });
          });
        });
        console.log(location);
        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        // this.backgroundGeolocation.finish(); // FOR IOS ONLY
        this.storage.get("user").then(data => {
          this.AuthServices.saveTimers(
            JSON.parse(data).uid,
            { name: "test" + new Date().toISOString(), time: new Date() },
            {
              longitude: this.lng,
              latitude: this.lat
            }
          ).then(data => {
            console.log("Function to get position:save time");
          });
        });
        this.zone.run(() => {
          this.lat = location.latitude;
          this.lng = location.longitude;
          // this.locations.push(location);
        });
        this.backgroundGeolocation.finish();
      });

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
