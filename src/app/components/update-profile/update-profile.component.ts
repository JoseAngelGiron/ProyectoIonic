import {Component, inject, Input, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UtilsService} from "../../services/utils.service";
import {SupabaseService} from "../../services/supabase.service";
import {FirebaseService} from "../../services/firebase.service";
import {HeaderComponent} from "../../shared/components/header/header.component";
import {IonAvatar, IonButton, IonContent, IonIcon} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {CustomInputComponent} from "../../shared/components/custom-input/custom-input.component";
import {addIcons} from "ionicons";
import {imageOutline, mailOutline, personOutline} from "ionicons/icons";

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
  imports: [
    HeaderComponent,
    IonContent,
    FormsModule,
    ReactiveFormsModule,
    IonAvatar,
    NgIf,
    IonIcon,
    IonButton,
    CustomInputComponent
  ]
})
export class UpdateProfileComponent implements OnInit {
  @Input() user: User | null = null;
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  supabaseService = inject(SupabaseService);

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    image: new FormControl('', [Validators.required]),
  });

  constructor() {
  }

  ngOnInit() {
    addIcons({imageOutline, personOutline, mailOutline});
    if (this.user) {
      this.form.patchValue(this.user);
    }
  }

  async takeImage() {
    const dataUrl = (
      await this.utilsService.takePicture('Imagen de perfil')
    ).dataUrl;
    if (dataUrl) {
      this.form.controls.image.setValue(dataUrl);
    }
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();

      const path: string = `users/${this.user!.uid}`;
      if (this.form.value.image != this.user!.image) {
        const imageDataUrl = this.form.value.image;
        const imagePath = this.supabaseService.getFilePath(this.user!.image)
        const imageUrl = await this.supabaseService.uploadImage(
          imagePath!,
          imageDataUrl!
        );
        this.form.controls.image.setValue(imageUrl);
      }
      delete this.form.value.uid;

      this.firebaseService.updateDocument(path, this.form.value).then(async () => {
        await this.utilsService.dismissModal({success: true});
        await this.utilsService.presentToast({
          message: 'Usuario actualizado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-outline'
        });
      }).catch((err) => {
        this.utilsService.presentToast({
          message: err.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        })
      }).finally(() => {
        loading.dismiss();
      });
    }
  }
}
