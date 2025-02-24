import {Component, inject, OnInit} from '@angular/core';
import {IonButton, IonContent, IonIcon} from "@ionic/angular/standalone";
import {CustomInputComponent} from "../../shared/components/custom-input/custom-input.component";
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FirebaseService} from "../../services/firebase.service";
import {UtilsService} from "../../services/utils.service";
import {addIcons} from "ionicons";
import {
  alertOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosed,
  mailOutline,
  personAddOutline,
  personOutline
} from "ionicons/icons";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-sign-up-component',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [
    IonContent,
    CustomInputComponent,
    IonButton,
    NgIf,
    ReactiveFormsModule,
    IonIcon
  ]
})
export class SignUpComponent {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    uid: new FormControl('')
  });

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  constructor() {
    addIcons({mailOutline, lockClosed, alertOutline, eyeOutline, eyeOffOutline, personOutline, personAddOutline});
  }

  async submit() {
    if (this.signUpForm.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();
      this.firebaseService
        .signUp(this.signUpForm.value as User)
        .then(async (res) => {
          console.log("Entra");
          this.firebaseService.updateUser(this.signUpForm.value.name!)
          let uid = res.user!.uid;
          this.signUpForm.controls.uid.setValue(uid);
          this.setUserInfo(uid);
        })
        .catch((error) => {
          this.utilsService.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async setUserInfo(uid: string) {
    if (this.signUpForm.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();

      let path = `users/${uid}`;
      delete this.signUpForm.value.password;

      this.firebaseService
        .setDocument(path, this.signUpForm.value)
        .then((res) => {
          this.utilsService.saveInLocalStorage('user', this.signUpForm.value);
          this.signUpForm.reset();
          this.utilsService.routerLink('/home');
        })
        .catch((error) => {
          this.utilsService.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

}
