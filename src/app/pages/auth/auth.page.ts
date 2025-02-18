import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { addIcons } from 'ionicons';
import {
  lockClosedOutline,
  mailOutline,
  personAddOutline,
  logInOutline,
} from 'ionicons/icons';
import { IonButton } from '@ionic/angular/standalone';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { RouterLink } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    HeaderComponent,
    IonContent,
    CommonModule,
    FormsModule,
    CustomInputComponent,
    ReactiveFormsModule,
    IonButton,
    LogoComponent,
    RouterLink,
  ],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseService = inject(FirebaseService);


  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      personAddOutline,
      logInOutline,
    });
  }

  ngOnInit() {}

  submit() {
    this.firebaseService.signIn(this.form.value as User).then(res =>
      console.log(res)
    );
  }
}
