import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-projects-index',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects-index.component.html',
  styleUrls: ['./projects-index.component.css'],
})
export class ProjectsIndexComponent implements OnInit {
  projects: Project[] = [];
  apiBaseUrl = environment.baseUrl;

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit() {
    this.fetchProjects();
  }

  fetchProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data.map((project) => ({
          ...project,
          description: project.description || '', // Default to empty string if null/undefined
        }));
      },
      error: (error) => {
        this.projectService.showError(
          'Failed to fetch Projects: ' + (error.message || 'Unknown error')
        );
        console.error(error);
      },
    });
  }

  deleteProject(id: string) {
    this.projectService.deleteProject(id).subscribe({
      next: (response) => {
        this.projectService.showSuccess(
          response || 'Project deleted successfully'
        );
        this.fetchProjects();
      },
      error: (error) => {
        this.projectService.showError(
          `Failed to delete Project: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }

  toggleProjectActive(id: string, value: boolean) {
    this.projectService.toggleProjectActive(id, value).subscribe({
      next: (response) => {
        this.projectService.showSuccess(
          response ||
            `Project ${value ? 'activated' : 'deactivated'} successfully`
        );
        this.fetchProjects();
      },
      error: (error) => {
        this.projectService.showError(
          `Failed to ${value ? 'activate' : 'deactivate'} Project: ${
            error.message || 'Unknown error'
          }`
        );
        console.error(error);
      },
    });
  }
}


