import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LenisService } from '../../services/lenis.service';
import { SidePanelService } from '../../services/sidepanel.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
})
export class SidePanelComponent implements OnDestroy {
  constructor(
    public sidePanel: SidePanelService,
    // private lenisService: LenisService,
    private router: Router
  ) {}

  scrollToSection(sectionId: string) {
    // if (this.lenisService.lenis) {
    //   this.lenisService.lenis.scrollTo(`#${sectionId}`, { duration: 0.8 });
    // } else {
      document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
    
    this.sidePanel.close();
  }

  ngOnDestroy() {
    // No subscription to clean up
  }
}
