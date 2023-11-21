import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StorageServiceComponent } from '../services/storage.service';

@Component({
  selector: 'app-payment-cancel',
  templateUrl: './payment-cancel.component.html',
  styleUrls: ['./payment-cancel.component.css'],
})
export class PaymentCancelComponent {
  @Input() errorMessage!: string;

  constructor(private router: Router, private storageService: StorageServiceComponent,) {}

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if(currentUser2 == null)
    {
      setTimeout(() => {this.router.navigate(['/inicio']);});
    }

    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  redirectToHome() {
    window.location.reload();
  }
}
