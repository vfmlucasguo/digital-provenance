// @ai-generated-begin
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  emailError = '';
  submitted = false;

  onSubmit(): void {
    this.submitted = true;
    this.emailError = '';
    if (!this.email?.trim()) {
      this.emailError = 'Email is required';
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(this.email.trim())) {
      this.emailError = 'Please enter a valid email address';
      return;
    }
    // Placeholder: ready for future auth service integration
    console.log('Login submitted:', { email: this.email, password: '***' });
    if (typeof (window as unknown as { Toast?: unknown }).Toast !== 'undefined') {
      // Would show toast if available
    }
  }
}
// @ai-generated-end
