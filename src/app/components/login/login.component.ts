import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {CustomInputComponent} from "../../shared/components/custom-input/custom-input.component";
import {IonButton, IonContent, IonIcon} from "@ionic/angular/standalone";
import {FirebaseService} from "../../services/firebase.service";
import {addIcons} from "ionicons";
import {
  alertOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosed,
  logInOutline,
  mailOutline,
  personAddOutline
} from "ionicons/icons";
import {UtilsService} from "../../services/utils.service";
import {User} from "../../models/user.model";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    CustomInputComponent,
    IonContent,
    IonButton,
    IonIcon,
    RouterLink
  ]
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  constructor() {
    addIcons({mailOutline, lockClosed, alertOutline, eyeOutline, eyeOffOutline,logInOutline,personAddOutline, })
  }

  async submit() {
    const loading = await this.utilsService.loading();
    await loading.present();

    this.firebaseService.signIn(this.loginForm.value as User).then(user => {
      console.log(user);
    }).catch(error => {
      this.utilsService.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-outline',
      })
    }).finally(() => {
      loading.dismiss();
    })
  }
}
