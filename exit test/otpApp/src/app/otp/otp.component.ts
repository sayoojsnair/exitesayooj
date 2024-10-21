import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
})
export class OtpComponent {
  email: string = '';
  otp: string = '';
  isOtpSent: boolean = false;

  constructor(private http: HttpClient) {}

  submitEmail() {
    this.http.post('/api/send-otp', { email: this.email }).subscribe(() => {
      this.isOtpSent = true;
    });
  }

  submitOtp() {
    this.http.post('/api/verify-otp', { email: this.email, otp: this.otp }).subscribe(
      () => {
        window.location.href = '/welcome';
      },
      () => {
        alert('Invalid OTP');
      }
    );
  }
}