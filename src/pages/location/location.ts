import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoadingServicesProvider } from "./../../providers/loading-services/loading-services";
import {LocatoinTrackerProvider} from './../../providers/locatoin-tracker/locatoin-tracker';

/**
 * Generated class for the LocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-location",
  templateUrl: "location.html"
})
export class LocationPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LocatoinTrackerProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LocationPage");
  }
  start() {
    this.loading.startTracking();
  }

  stop() {
    this.loading.stopTracking();
  }
}
