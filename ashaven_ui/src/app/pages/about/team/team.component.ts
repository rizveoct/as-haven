import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Team } from '../../../models/model';



@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent {
  @Input() teams: Team[] = [];
  @Output() toggle = new EventEmitter<Team | null>();

  onToggle(member: Team) {
    this.toggle.emit(member);
  }
}
