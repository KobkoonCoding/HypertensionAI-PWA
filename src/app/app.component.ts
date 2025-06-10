import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonicModule,     // ✅ Provides all <ion-*> components
    CommonModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
