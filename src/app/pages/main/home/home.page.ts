import { Component, inject, OnInit } from '@angular/core';
import { IonButton, IonContent, IonFab, IonIcon, IonFabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateCardComponent } from 'src/app/shared/components/add-update-card/add-update-card.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonIcon, IonFab, IonButton, HeaderComponent, IonContent],
})
export class HomePage implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  constructor() { addIcons({add});}

  ngOnInit() {
    console.log("Metodo de home page iniciado");
  }

  async signOut() {
    this.firebaseService.signOut().then(() => {
      this.utilsService.routerLink('/auth');
    });
  }

  addUpdateCard() {
    this.utilsService.presentModal({ component: AddUpdateCardComponent, cssClass: "add-update-modal"})
  }
}
