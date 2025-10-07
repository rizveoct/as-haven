import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contactus } from '../../models/model';
import { ContactusService } from '../../services/contactus.service';


@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  contacts: Contactus[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0; // To be updated if API provides total count
  errorMessage: string | null = null;

  constructor(private contactusService: ContactusService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactusService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (data: Contactus[]) => {
        this.contacts = data;
        this.errorMessage = null;        
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.contacts = [];
      },
    });
  }

  changePage(delta: number): void {
    const newPage = this.currentPage + delta;
    if (newPage >= 1) {
      // Prevent going below page 1
      this.currentPage = newPage;
      this.loadContacts();
    }
  }
}
