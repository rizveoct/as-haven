import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-social',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-social.component.html',
  styleUrls: ['./floating-social.component.css'],
})
export class FloatingSocialComponent {
  isOpen = false;
  isSpinning = false;

  toggleSocialIcons(): void {
    this.isSpinning = true;
    setTimeout(() => {
      this.isOpen = !this.isOpen;
      this.isSpinning = false;
    }, 300); // wait for spin before toggling
  }
}
