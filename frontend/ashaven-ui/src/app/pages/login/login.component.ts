import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
// import { LenisService } from '../../services/lenis.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  loginModel = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    // private lenisService: LenisService
  ) {}

  ngAfterViewInit() {
    // this.lenisService.init();
    // this.lenisService.onScroll((scroll) => {
    //   //console.log('Scroll position:', scroll);
    // });
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .login(this.loginModel.email, this.loginModel.password)
      .subscribe({
        next: (res) => {
          this.router.navigate(['dashboard']);
          console.log('Login successful:', res);
        },
        error: (err) => {
          this.errorMessage =
            err.status === 401
              ? 'Invalid email or password'
              : 'An error occurred. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
