import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contactus, Project } from '../../../models/model';
import { ContactusService } from '../../../services/contactus.service';
import { ProjectService } from '../../../services/project.service';


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit {
  totalInquiries = 0;
  projects: Project[] = [];
  inquiriesError: string | null = null;
  projectsError: string | null = null;

  constructor(
    private contactusService: ContactusService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadInquiries();
    this.loadProjects();
  }

  loadInquiries(): void {
    let page = 1;
    const pageSize = 100; // Large pageSize to minimize requests
    let allContacts: Contactus[] = [];

    const fetchPage = () => {
      this.contactusService.getAll(page, pageSize).subscribe({
        next: (contacts: Contactus[]) => {
          allContacts = [...allContacts, ...contacts];
          if (contacts.length === pageSize) {
            page++;
            fetchPage();
          } else {
            this.totalInquiries = allContacts.length;
            this.inquiriesError = null;
          }
        },
        error: (error: Error) => {
          this.inquiriesError = error.message;
          this.totalInquiries = 0;
        },
      });
    };
    fetchPage();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        this.projectsError = null;
      },
      error: (error: Error) => {
        this.projectsError = error.message;
        this.projectService.showError(error.message);
        this.projects = [];
      },
    });
  }
}
