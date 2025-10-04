import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ContactusService } from '../../../services/contactus.service';
import { Contactus } from '../../../models/model';


@Component({
  selector: 'app-contact-info-map',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-info-map.component.html',
  styleUrls: ['./contact-info-map.component.css'],
})
export class ContactInfoMapComponent implements OnInit {
  contactForm: FormGroup;
  isMapLoaded = false;
  submitMessage: string | null = null;
  isSubmitting = false;
  showPopup = false;

  constructor(
    private fb: FormBuilder,
    private contactusService: ContactusService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {}

  onMapLoad(): void {
    this.isMapLoaded = true;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = null;

    const contact: Contactus = this.contactForm.value;

    this.contactusService.create(contact).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitMessage = response; // e.g., "Form Successfully Submitted"
        this.contactForm.reset();
        this.showPopup = true;
        console.log('Form submitted successfully:', response);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitMessage = 'Error submitting form. Please try again.';
        console.error('Submission error:', err);
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  closePopup(): void {
    this.showPopup = false;
  }
}