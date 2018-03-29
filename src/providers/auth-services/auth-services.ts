import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the AuthServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServicesProvider {

  authState: any = null;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });
  }

  public getAuthStatus() {
    return this.authState;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  // get currentUser(): any {
  //   return this.authenticated ? this.authState : null;
  // }

  public currentUserObservable(): any {
    return this.afAuth.authState
  }

  // get currentUserId(): string {
  //   return this.authenticated ? this.authState.uid : '';
  // }

  updateUserData(user, otherDetail) {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
    let path = `users/${user.uid}`; // Endpoint on firebase
    let data = {
      email: user.email,
      name: otherDetail.first_name,
      emergency_email: otherDetail.emergency_email
    }
    return this.db.object(path).update(data).catch(error => console.log(error));
  }

  saveTimers(uid, notificationObject, coordinates) {
    let path = `users/${uid}/timers`; // Endpoint on firebase
    var data = {
      name: notificationObject.name,
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
      timestamp: coordinates.timestamp
    }
    console.log(data);
    return this.db.object(path).update(data).catch(error => console.log(error));
  }

  getUserData(uid) {
    return this.db.object(`users/${uid}`).valueChanges();
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.afAuth.auth.signOut();
  }

  sendEmailVerification() {
    this.afAuth.authState.subscribe(user => {
      user.sendEmailVerification()
        .then(() => {
          console.log('email sent');
        })
    });
  }

  sendPassword(email) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => {
        console.log('email sent');
      })
  }
}
