import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonContent} from '@ionic/angular/standalone';
import {HeaderComponent} from 'src/app/shared/components/header/header.component';
import {LoginComponent} from "../../components/login/login.component";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, CommonModule, LoginComponent,],
})
export class AuthPage implements OnInit {


  constructor() {
  }

  ngOnInit() {
  }
}
