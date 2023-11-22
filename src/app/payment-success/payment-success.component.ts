import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageServiceComponent } from '../services/storage.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
})
export class PaymentSuccessComponent {
  constructor(private router: Router, private storageService: StorageServiceComponent) {}

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if(currentUser2 == null)
    {
      setTimeout(() => {this.router.navigate(['/inicio']);});
    }
    setTimeout(() => {
      this.router.navigate(['/reservas']);
    }, 5000);
  }
}