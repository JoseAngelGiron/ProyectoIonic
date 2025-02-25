import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';

import {addIcons} from 'ionicons';
import {
  alertCircleOutline,
  checkmarkOutline,
  imageOutline,
  lockClosedOutline,
  mailOutline,
  personAddOutline,
  personOutline,
  bodyOutline
} from 'ionicons/icons';

import {FirebaseService} from 'src/app/services/firebase.service';
import {User} from 'src/app/models/user.model';
import {UtilsService} from 'src/app/services/utils.service';
import {CustomInputComponent} from "../custom-input/custom-input.component";
import {HeaderComponent} from "../header/header.component";
import {IonAvatar, IonButton, IonContent, IonIcon} from "@ionic/angular/standalone";
import {SupabaseService} from "../../../services/supabase.service";
import {Card} from "../../../models/card.model";

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
  @Input() card: Card | null = null;
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  supabaseService = inject(SupabaseService);

  user = {} as User;

  form = new FormGroup({
    photo: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    skill: new FormControl('', [Validators.required, Validators.minLength(4)]),
    attack: new FormControl('', [Validators.required, Validators.minLength(4)]),
    type: new FormControl('', [Validators.required, Validators.minLength(4)]),
    weakness: new FormControl('', [Validators.required, Validators.minLength(4)]),
    id: new FormControl(''),
  });

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      personAddOutline,
      personOutline,
      alertCircleOutline,
      imageOutline,
      checkmarkOutline,
      bodyOutline
    });
  }

  ngOnInit() {
    this.user = this.utilsService.getFromLocalStorage('user');
    if (this.card) {
      console.log(this.card)
      this.form.setValue(this.card)
      console.log(this.form.value)
    }
  }

  async takeImage() {
    const dataUrl = (
      await this.utilsService.takePicture('Imagen de la miniatura')
    ).dataUrl;
    if (dataUrl) {
      this.form.controls.photo.setValue(dataUrl);
    }
  }

  async submit() {
    if (this.form.valid) {
      if (this.card) {
        this.updateCard();
      } else {
        this.createCard();
      }
    }
  }

  async createCard() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const path: string = `users/${this.user.uid}/cards`;
    const imageDataUrl = this.form.value.photo;
    const imagePath = `${this.user.uid}/${Date.now()}`;
    const imageUrl = await this.supabaseService.uploadImage(
      imagePath,
      imageDataUrl!
    );
    this.form.controls.photo.setValue(imageUrl);
    delete this.form.value.id;

    this.firebaseService
      .addDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsService.dismissModal({success: true});
        this.utilsService.presentToast({
          message: 'Carta añadida exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-outline',
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

  async updateCard() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const path: string = `users/${this.user.uid}/cards/${this.card!.id}`;
    if (this.form.value.photo != this.card!.photo) {
      const imageDataUrl = this.form.value.photo;
      const imagePath = this.supabaseService.getFilePath(this.card!.photo)
      const imageUrl = await this.supabaseService.uploadImage(
        imagePath!,
        imageDataUrl!
      );
      this.form.controls.photo.setValue(imageUrl);
    }
    delete this.form.value.id;

    this.firebaseService
      .updateDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsService.dismissModal({success: true});
        this.utilsService.presentToast({
          message: 'Carta editada exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-outline',
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

