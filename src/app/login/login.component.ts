import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StorageServiceComponent } from '../services/storage.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {
    inputMail: null,
    inputPassword: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private storageService: StorageServiceComponent,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if(currentUser2 == 'ROLE_USER' || currentUser2 == 'ROLE_MODERATOR')
    {
      setTimeout(() => {this.router.navigate(['/inicio']);});
    }
    
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  onSubmit(): void {
    const { inputMail, inputPassword } = this.form;

    this.authService.login(inputMail, inputPassword).subscribe({
      next: (data) => {
        this.storageService.saveUser(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Exitosamente',
          detail: 'Bienvenido a Garage365',
        });
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.router.navigate(['/reserva']);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Advertencia',
          detail: this.errorMessage,
        });
      },
    });
  }
}
