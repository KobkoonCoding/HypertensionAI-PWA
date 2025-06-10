import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // <-- ADD THIS IMPORT

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  imports: [
    IonicModule,     // ✅ brings in all ion-* components
    RouterLink,
    CommonModule
  ]
})
export class ContactPage {}
