import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  email: string = '';
  currentYear: number = new Date().getFullYear();

  subscribe() {
    if (this.email) {
      console.log('Subscribed with email:', this.email); // Placeholder for subscription logic
      this.email = ''; // Reset input
    }
  }
}
