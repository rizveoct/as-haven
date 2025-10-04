import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../models/model';



@Component({
  selector: 'app-team-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.css'],
})
export class TeamModalComponent  {
  @Input() selectedTeamMember: Team | null = null;
  @Output() toggle = new EventEmitter<void>();
  @Output() imageError = new EventEmitter<Event>();



  onToggle() {
    this.toggle.emit();
  }

  onImageError(event: Event) {
    this.imageError.emit(event);
  }
}
