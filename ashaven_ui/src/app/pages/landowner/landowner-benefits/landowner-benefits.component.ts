import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-landowner-benefits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landowner-benefits.component.html',
  styleUrls: ['./landowner-benefits.component.css'],
})
export class LandownerBenefitsComponent implements OnInit {
  services = [
    { name: 'Architectural Design', icon: '🏛️' },
    { name: 'Structural Design', icon: '🏗️' },
    { name: 'Electrical Design', icon: '💡' },
    { name: 'Sanitary Design', icon: '🚰' },
    { name: 'Interior Design', icon: '🛋️' },
    { name: 'Digital Survey', icon: '📡' },
    { name: 'Soil Test', icon: '🧪' },
    { name: 'RDA Approval', icon: '✅' },
  ];

  ngOnInit(): void {
    AOS.init({ once: true, duration: 800 });
  }
}