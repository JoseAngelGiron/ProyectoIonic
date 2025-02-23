import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { addIcons } from 'ionicons';
import {
  lockClosedOutline,
  mailOutline,
  personAddOutline,
  personOutline,
  alertCircleOutline,
} from 'ionicons/icons';

import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import {CustomInputComponent} from "../custom-input/custom-input.component";
import {HeaderComponent} from "../header/header.component";
import {IonButton, IonContent, IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'app-add-update-card',
  templateUrl: './add-update-card.component.html',
  styleUrls: ['./add-update-card.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
    HeaderComponent,
    IonContent,
    IonButton,
    IonIcon,
  ],
})

export class AddUpdateCardComponent implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    units: new FormControl('', [Validators.required, Validators.min(1)]),
    strength: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      personAddOutline,
      personOutline,
      alertCircleOutline,
    });
  }
  ngOnInit() {
    console.log("add-update-card")
  }


  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();
      this.firebaseService
        .signUp(this.form.value as User)
        .then(async (res) => {
          this.firebaseService.updateUser(this.form.value.name!);
          let uid = res.user!.uid;
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
