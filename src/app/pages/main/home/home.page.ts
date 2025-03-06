import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  IonAvatar,
  IonBadge,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {
  add,
  addCircleOutline,
  bodyOutline,
  createOutline,
  informationCircleOutline,
  trashOutline
} from 'ionicons/icons';
import {FirebaseService} from 'src/app/services/firebase.service';
import {UtilsService} from 'src/app/services/utils.service';
import {AddUpdateCardComponent} from 'src/app/shared/components/add-update-card/add-update-card.component';
import {HeaderComponent} from 'src/app/shared/components/header/header.component';
import {User} from "../../../models/user.model";
import {Card} from "../../../models/card.model";
import {NgForOf, NgIf} from "@angular/common";
import {SupabaseService} from "../../../services/supabase.service";
import {Subscription} from "rxjs";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonIcon, IonFab, HeaderComponent, IonContent, IonList, IonItem, IonLabel, IonItemSliding, IonAvatar, IonChip, IonItemOptions, IonItemOption, NgForOf, NgIf, IonSkeletonText, IonSearchbar, FormsModule, IonHeader, IonToolbar, IonTitle, IonBadge],
})
export class HomePage implements OnInit, OnDestroy {
  firebaseService = inject(FirebaseService);
  supabaseService = inject(SupabaseService);
  utilsService = inject(UtilsService);
  cards: Card[] = [];
  filteredCards: Card[] = [];
  loading: boolean = false;
  searchText: string = '';
  cardsSubscription?: Subscription;

  constructor() {
    addIcons({add, bodyOutline, createOutline, trashOutline, informationCircleOutline, addCircleOutline});
  }

  ngOnInit() {
    console.log("Método de home page iniciado");
  }

  getCards() {
    this.loading = true;
    const user: User = this.utilsService.getLocalStoredUser()!;
    const path: string = `users/${user.uid}/cards`;

    if (this.cardsSubscription) {
      this.cardsSubscription.unsubscribe();
    }
    this.cardsSubscription = this.firebaseService.getCollectionData(path).subscribe({
      next: (res: Card[]) => {
        this.cards = res;
        this.filterCards();  // Filtrar las cartas al obtenerlas
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener los datos: ', err);
        this.loading = false;
      }
    });
  }

  filterCards() {
    if (!this.searchText.trim()) {
      this.filteredCards = [...this.cards];
    } else {
      this.filteredCards = this.cards.filter(card =>
        card.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }


  async addUpdateCard(card?: Card) {
    let success = await this.utilsService.presentModal({
      component: AddUpdateCardComponent,
      cssClass: 'add-update-modal',
      componentProps: {card}
    });

    if (success) {
      this.getCards();
    }
  }

  ngOnDestroy() {
    if (this.cardsSubscription) {
      this.cardsSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.getCards();
  }

  async deleteCard(card: Card) {
    const loading = await this.utilsService.loading();
    await loading.present();
    const user: User = this.utilsService.getLocalStoredUser()!;
    const path: string = `users/${user.uid}/cards/${card!.id}`;

    const imagePath = this.supabaseService.getFilePath(card!.photo)
    await this.supabaseService.deleteFile(imagePath!);
    this.firebaseService
      .deleteDocument(path)
      .then(async (res) => {
        this.cards = this.cards.filter(listedCard => listedCard.id !== card.id)
        this.utilsService.presentToast({
          message: 'Carta borrada exitosamente',
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
          icon: 'alert-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async confirmDeleteCard(card: Card) {
    this.utilsService.presentAlert({
      header: 'Eliminar carta',
      message: '¿Está seguro de que desea eliminar la carta?',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
        },
        {
          text: 'Sí',
          handler: () => {
            this.deleteCard(card);
          },
        },
      ],
    });
  }
}
