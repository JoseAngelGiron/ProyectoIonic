import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonAvatar, IonButton, IonIcon, IonLabel, IonItem } from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { User } from 'src/app/models/user.model';
import { addIcons } from 'ionicons';
import { cameraOutline, personOutline } from 'ionicons/icons';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import {UpdateProfileComponent} from "../../../components/update-profile/update-profile.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonIcon, IonButton, IonAvatar, IonContent, CommonModule, FormsModule, HeaderComponent],
})
export class ProfilePage implements OnInit {
  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  supabaseService = inject(SupabaseService);
  constructor() {
    this.user = this.utilsService.getLocalStoredUser()!;
    addIcons({cameraOutline,personOutline});
  }

  user: User;

  ngOnInit() {}

  async takeImage() {
    const dataUrl = (await this.utilsService.takePicture('imagen de perfil'))
      .dataUrl;

    const loading = await this.utilsService.loading();
    await loading.present();

    const path: string = `users/${this.user.uid}`;
    if (this.user.image) {
      const oldImagePath = this.supabaseService.getFilePath(this.user.image)
      await this.supabaseService.deleteFile(oldImagePath!);
    }
    let imagePath = `${this.user.uid}/profile${Date.now()}`;
    const imageUrl = await this.supabaseService.uploadImage(
      imagePath,
      dataUrl!
    );
    this.user.image = imageUrl;
    this.firebaseService
      .updateDocument(path, { image: this.user.image })
      .then(async (res) => {
        this.utilsService.saveInLocalStorage('user', this.user);
        this.utilsService.presentToast({
          message: 'Imagen actualizada exitosamente',
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

  async updateUser(user: User) {
    await this.utilsService.presentModal({
      component: UpdateProfileComponent,
      cssClass: 'app-update-profile',
      componentProps: {user}
    });
  }
}
