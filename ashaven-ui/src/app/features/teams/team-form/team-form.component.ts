import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Team } from '../../../models/model';
import { TeamService } from '../../../services/team.service';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css'],
})
export class TeamFormComponent implements OnInit {
  private defaultTeam: Team = {
    id: '',
    name: '',
    designation: '',
    description: '',
    facebook: '',
    twiter: '',
    linkthen: '',
    image: '',
    isActive: true,
    order: 0,
  };
  _team: Team = this.defaultTeam;

  @Input() set team(value: Team | null) {
    this._team = value ? { ...value } : { ...this.defaultTeam };
  }
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  selectedFile: File | null = null;

  ngOnInit() {
    if (!this._team) {
      this._team = { ...this.defaultTeam };
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  saveTeam() {
    const formData = new FormData();
    formData.append('name', this._team.name || '');
    formData.append('designation', this._team.designation || '');
    formData.append('description', this._team.description || '');
    formData.append('facebook', this._team.facebook || '');
    formData.append('twiter', this._team.twiter || ''); // Match API's 'twiter' field
    formData.append('linkedIn', this._team.linkthen || '');
    formData.append('order', this._team.order.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.mode === 'edit') {
      formData.append('id', this._team.id || '');
    }

    const serviceMethod =
      this.mode === 'create'
        ? this.teamService.createTeam(formData)
        : this.teamService.editTeam(formData);
    serviceMethod.subscribe({
      next: (response) => {
        this.teamService.showSuccess(
          response ||
            `Team ${
              this.mode === 'create' ? 'created' : 'updated'
            } successfully`
        );
        this.saved.emit();
      },
      error: (error) => {
        this.teamService.showError(
          `Failed to ${this.mode === 'create' ? 'create' : 'update'} team: ${
            error.message || 'Unknown error'
          }`
        );
        console.error(error);
      },
    });
  }

  constructor(private teamService: TeamService) {}
}
