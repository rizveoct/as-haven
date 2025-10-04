import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [ProjectFormComponent, CommonModule, RouterModule],
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css'],
})
export class ProjectCreateComponent {
  constructor(private router: Router) {}

  onProjectSaved() {
    this.router.navigate(['/dashboard/projects']);
  }
}
