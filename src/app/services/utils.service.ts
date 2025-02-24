import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  ToastController,
  ToastOptions,
  ModalController,
  ModalOptions,
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  router = inject(Router);
  modalController = inject(ModalController);

  loading() {
    return this.loadingController.create({ spinner: 'crescent' });
  }

  async presentToast(toastOptions?: ToastOptions | undefined) {
    const toast = await this.toastController.create(toastOptions);
    toast.present();
  }

  urlTree(url: string) {
    return this.router.parseUrl(url);
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }
  // ionic g c shared/components/add-update-card
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : value;
  }

  async presentModal(modalOptions: ModalOptions) {
    const modal = await this.modalController.create(modalOptions);

    await modal.present();

    const { data } = await modal.onWillDismiss();

    return data ?? null;
  }

  dismissModal(data?: any) {
    return this.modalController.dismiss(data);
  }

  constructor() {}
}
