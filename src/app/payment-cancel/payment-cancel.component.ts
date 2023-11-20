import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-cancel',
  templateUrl: './payment-cancel.component.html',
  styleUrls: ['./payment-cancel.component.css'],
})
export class PaymentCancelComponent {
  @Input() errorMessage!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  redirectToHome() {
    window.location.reload();
  }
}
