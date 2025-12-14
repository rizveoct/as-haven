import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  AuthService,
  ChangeCredentialsModel,
} from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, tap, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mainContent') mainContent!: ElementRef;

  showProfileDropdown = false;
  showSidebar = false;
  showProfileModal = false;

  profileForm!: FormGroup;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      username: [localStorage.getItem('email') || '', Validators.required],
      password: [''],
      confirmPassword: [''],
    });
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  openProfileModal() {
    this.showProfileDropdown = false;
    this.showProfileModal = true;
    this.profileForm.patchValue({
      username: localStorage.getItem('email') || '',
      password: '',
      confirmPassword: '',
    });
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  saveProfile() {
    const username = this.profileForm.value.username;
    const password = this.profileForm.value.password;
    const confirmPassword = this.profileForm.value.confirmPassword;

    if (password && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const updateModel: ChangeCredentialsModel = {
      newUsername: username,
      newPassword: password || undefined,
    };

    this.authService
      .changeCredentials(updateModel)
      .pipe(
        tap(() => {
          if (username) localStorage.setItem('email', username);
          alert('Profile updated successfully!');
          this.closeProfileModal();
        })
      )
      .subscribe({
        error: (err) =>
          alert('Error updating profile: ' + err.error || err.message),
      });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  closeSidebar(event?: MouseEvent) {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.closest('aside') || target.closest('.fa-bars')) {
        return;
      }
    }
    this.showSidebar = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent<WheelEvent>(this.mainContent.nativeElement, 'wheel', {
        passive: true,
      })
        .pipe(
          throttleTime(16, undefined, { leading: true, trailing: true }),
          takeUntil(this.destroy$)
        )
        .subscribe((event) => {
          this.mainContent.nativeElement.scrollTop += event.deltaY;
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
