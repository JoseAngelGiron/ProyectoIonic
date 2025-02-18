import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {CustomInputComponent} from "../../shared/components/custom-input/custom-input.component";
import {IonButton, IonContent} from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    CustomInputComponent,
    IonContent,
    IonButton
  ]
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required]),
  });

  constructor() {
  }

  onSubmit() {

  }

  protected readonly FormControl = FormControl;
}
