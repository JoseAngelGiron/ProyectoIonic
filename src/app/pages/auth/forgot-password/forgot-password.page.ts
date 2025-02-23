import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  alertCircleOutline,
  mailUnreadOutline,
  sendOutline
} from 'ionicons/icons';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import {CustomInputComponent} from "../../../shared/components/custom-input/custom-input.component";
import {LogoComponent} from "../../../shared/components/logo/logo.component";
import {HeaderComponent} from "../../../shared/components/header/header.component";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonIcon,
    IonButton,
    CustomInputComponent,
    LogoComponent,
    HeaderComponent,
  ],
})

export class ForgotPasswordPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  constructor() {
    addIcons({
      mailOutline,
      alertCircleOutline,
      mailUnreadOutline,
      sendOutline
    });
  }

  ngOnInit() {
    console.log("Página de contraseña olvidada")
  }

  async submit() {
    const loading = await this.utilsService.loading();
    await loading.present();
    this.firebaseService
      .sendRecoveryEmail(this.form.value.email!)
      .then((res) => {
        this.utilsService.presentToast({
          message: "Correo enviado en caso de existir la cuenta",
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'mail-unread-outline',
        });
        this.form.reset();
        this.utilsService.routerLink("/auth");
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
