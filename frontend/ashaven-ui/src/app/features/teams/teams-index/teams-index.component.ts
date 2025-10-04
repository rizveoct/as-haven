import { Component, OnInit } from '@angular/core';
import { TeamFormComponent } from '../team-form/team-form.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Team } from '../../../models/model';
import { TeamService } from '../../../services/team.service';


@Component({
  selector: 'app-teams-index',
  standalone: true,
  imports: [TeamFormComponent, CommonModule],
  templateUrl: './teams-index.component.html',
  styleUrls: ['./teams-index.component.css'],
})
export class TeamsIndexComponent implements OnInit {
  teams: Team[] = [];
  showFormModal = false;
  selectedTeam: Team | null = null;
  apiBaseUrl = environment.baseUrl;
  formMode: 'create' | 'edit' = 'create';

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.fetchTeams();
  }

  fetchTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        console.log(data)
      },
      error: (error) => {
        this.teamService.showError(
          'Failed to fetch teams: ' + (error.message || 'Unknown error')
        );
        console.error(error);
      },
    });
  }

  openCreateModal() {
    this.selectedTeam = null;
    this.formMode = 'create';
    this.showFormModal = true;
  }

  openEditModal(team: Team) {
    this.selectedTeam = { ...team };
    this.formMode = 'edit';
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.selectedTeam = null;
  }

  onTeamSaved() {
    this.fetchTeams();
    this.closeFormModal();
  }

  toggleActiveStatus(id: string, isActive: boolean) {
    this.teamService.toggleActiveStatus(id, isActive).subscribe({
      next: (response) => {
        if (response === 'Data not found.') {
          this.teamService.showError(response);
        } else {
          this.teamService.showSuccess(
            response ||
              `Team ${isActive ? 'activated' : 'deactivated'} successfully`
          );
          this.fetchTeams();
        }
      },
      error: (error) => {
        this.teamService.showError(
          `Failed to ${isActive ? 'activate' : 'deactivate'} team: ${
            error.message || 'Unknown error'
          }`
        );
        console.error(error);
      },
    });
  }

  deleteTeam(id: string) {
    this.teamService.deleteTeam(id).subscribe({
      next: (response) => {
        this.teamService.showSuccess(response || 'Team deleted successfully');
        this.fetchTeams();
      },
      error: (error) => {
        this.teamService.showError(
          `Failed to delete team: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }
}
