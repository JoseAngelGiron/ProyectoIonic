import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonContent} from '@ionic/angular/standalone';
import {HeaderComponent} from "../../../shared/components/header/header.component";
import {SignUpComponent} from "../../../components/sign-up/sign-up.component";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, HeaderComponent, SignUpComponent]
})
export class SignUpPage implements OnInit {

  constructor() {
  }

  ngOnInit(): void {}

}
