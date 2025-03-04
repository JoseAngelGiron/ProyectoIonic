import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SensorService } from 'src/app/services/sensor.service';
import { Position } from '@capacitor/geolocation';
import { Subscription } from 'rxjs';
import { Device, BatteryInfo } from '@capacitor/device'; // Importamos BatteryInfo

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.page.html',
  styleUrls: ['./sensors.page.scss'],
  standalone: true,
  imports: [
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ],
})
export class SensorsPage implements OnInit, OnDestroy {
  sensorService = inject(SensorService);

  private accelerometerDataSubscription: Subscription | null = null;
  private orientationDataSubscription: Subscription | null = null;
  private coordinatesSubscription: Subscription | null = null;
  private batteryInterval: any; // Intervalo para actualizar la batería

  accelerometerData: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  orientationData: { alpha: number; beta: number; gamma: number } = {
    alpha: 0,
    beta: 0,
    gamma: 0,
  };
  position: Position | null = null;

  batteryInfo: BatteryInfo = { batteryLevel: 0, isCharging: false }; // Aseguramos que tenga el tipo correcto

  constructor() {}

  async ngOnInit() {
    this.sensorService.startWatchingGPS();
    this.sensorService.startListeningToMotion();


    this.accelerometerDataSubscription = this.sensorService
      .getAccelerometerData()
      .subscribe((data) => {
        this.accelerometerData = data;
      });


    this.orientationDataSubscription = this.sensorService
      .getOrientationData()
      .subscribe((data) => {
        this.orientationData = data;
      });


    this.coordinatesSubscription = this.sensorService
      .getCurrentCoordinates()
      .subscribe((data) => {
        this.position = data;
      });


    this.getBatteryStatus();


    this.batteryInterval = setInterval(() => {
      this.getBatteryStatus();
    }, 10000);
  }

  async getBatteryStatus() {
    const batteryStatus = await Device.getBatteryInfo();
    this.batteryInfo = batteryStatus;
  }

  ngOnDestroy() {
    if (this.accelerometerDataSubscription) {
      this.accelerometerDataSubscription.unsubscribe();
    }
    if (this.orientationDataSubscription) {
      this.orientationDataSubscription.unsubscribe();
    }
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }

    this.sensorService.stopListeningToMotion();
    this.sensorService.stopWatchingGPS();


    if (this.batteryInterval) {
      clearInterval(this.batteryInterval);
    }
  }
}
