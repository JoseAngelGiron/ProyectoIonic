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
  alertCircleOutline, imageOutline,
} from 'ionicons/icons';

import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import {CustomInputComponent} from "../custom-input/custom-input.component";
import {HeaderComponent} from "../header/header.component";
import {IonAvatar, IonButton, IonContent, IonIcon} from "@ionic/angular/standalone";
import {SupabaseService} from "../../../services/supabase.service";
import firebase from "firebase/compat";

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
    IonAvatar,
  ],
})

export class AddUpdateCardComponent implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  supabaseService = inject(SupabaseService);

  user = {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    units: new FormControl('', [Validators.required, Validators.min(1)]),
    strength: new FormControl('', [Validators.required, Validators.min(0)]),
    uid: new FormControl(''),
  });

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      personAddOutline,
      personOutline,
      alertCircleOutline,
      imageOutline
    });
  }
  ngOnInit() {
    console.log("add-update-card")
  }


  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();

      const path: string = `users/${this.user.uid}/miniatures`;
      const imageDataUrl = this.form.value.image;
      const imagePath = `${this.user.uid}/${Date.now()}`;
      const imageUrl = await this.supabaseService.uploadImage(
        imagePath,
        imageDataUrl!
      );
      this.form.controls.image.setValue(imageUrl);
      delete this.form.value.id;

      this.supabaseService
        this.firebaseService.addDocument(path, this.form.value)
        .then(async (res) => {
          this.utilsService.dismissModal({ success: true });
          this.utilsService.presentToast({
            message: 'Mininatura añadida exitosamente',
            duration: 1500,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });
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

  async takeImage() {
    const dataUrl = (
      await this.utilsService.takePicture('Imagen de la miniatura')
    ).dataUrl;
    if (dataUrl) {
      this.form.controls.image.setValue(dataUrl);
    }
  }
}
