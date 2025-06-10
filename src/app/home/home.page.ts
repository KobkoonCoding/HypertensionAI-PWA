import { Component, OnInit } from '@angular/core'; // Import OnInit
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Storage } from '@ionic/storage-angular'; // <-- NEW: Import Storage

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [IonicModule, RouterModule, CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
// NEW: Implement OnInit for lifecycle hook
export class HomePage implements OnInit {
  private _storage: Storage | null = null; // NEW: Private variable to hold the storage instance
  public myNotes: string[] = [];           // NEW: Example: An array to hold notes for display

  // NEW: Inject the Storage service in the constructor
  constructor(private storage: Storage) {}

  // NEW: Implement ngOnInit to initialize storage and load data
  async ngOnInit() {
    await this.initStorage(); // Initialize storage first
    await this.loadNotes();   // Then load any existing notes
  }

  // NEW: Method to initialize the storage
  async initStorage() {
    // This must be called once. For standalone components, doing it here is fine.
    const storage = await this.storage.create();
    this._storage = storage;
    console.log('Ionic Storage initialized.');
  }

  // NEW: Example: Function to add and save a note
  async addNote(noteText: string) {
    if (!this._storage) {
      console.error('Storage not initialized!');
      return;
    }

    let currentNotes = await this.loadNotes(); // Get current notes (or empty array if none)
    if (!currentNotes) {
        currentNotes = [];
    }
    currentNotes.push(noteText); // Add the new note to the array
    await this._storage.set('my_app_notes', currentNotes); // Save the updated array
    this.myNotes = currentNotes; // Update the component's display property
    console.log('Note added and saved:', noteText);
  }

  // NEW: Example: Function to load all notes
  async loadNotes(): Promise<string[]> {
    if (!this._storage) {
      console.error('Storage not initialized!');
      return [];
    }
    const data = await this._storage.get('my_app_notes'); // Get data for 'my_app_notes' key
    this.myNotes = data || []; // Set component's display property (default to empty array if no data)
    console.log('Loaded notes:', this.myNotes);
    return this.myNotes;
  }

  // NEW: Example: Function to clear all stored notes for this key
  async clearNotes() {
    if (!this._storage) {
      console.error('Storage not initialized!');
      return;
    }
    await this._storage.remove('my_app_notes'); // Removes data for this specific key
    this.myNotes = []; // Clear the display property
    console.log('All notes cleared.');
  }
}