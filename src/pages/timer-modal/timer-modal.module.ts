import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerModalPage } from './timer-modal';

@NgModule({
  declarations: [
    TimerModalPage,
  ],
  imports: [
    IonicPageModule.forChild(TimerModalPage),
  ],
})
export class TimerModalPageModule {}
