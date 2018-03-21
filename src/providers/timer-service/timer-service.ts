import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class TimerServiceProvider {

  timerArray: Array<any> = [];
  constructor(public storage: Storage) {
    this.storage.set('timers', this.timerArray);
  }

  getTimer() {
    this.storage.get('timers').then((timer) => {
      return timer;
    });
  }

  setTimer(dateTime) {
    this.timerArray.push(dateTime);
  }
}
