import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInfoMapComponent } from "./contact-info-map/contact-info-map.component";
import { FaqComponent } from "./faq/faq.component";
import { GetInTouchComponent } from "./get-in-touch/get-in-touch.component";
import { AnimationService } from '../../services/animation.service';
import { ContactHeroComponent } from './contact-hero/contact-hero.component';



@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ContactInfoMapComponent,
    ContactHeroComponent,
    FaqComponent,
    GetInTouchComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContactComponent implements AfterViewInit {
  constructor(private anim: AnimationService) {}
  
    ngAfterViewInit() {
      this.anim.animateOnScroll('.fade-up');
      this.anim.animateOnScroll('.zoom-in');
    }
}
