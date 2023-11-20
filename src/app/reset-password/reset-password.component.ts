import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  userId: string = '';
  password: string = '';
  confirmPassword: string = '';
  responseType: 'success' | 'error' = 'success';
  responseMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
  }

  submitForm() {
    if (this.password === this.confirmPassword) {
      this.http
        .put(`${environment.apiUrl}/api/resetpassword/${this.userId}`, {
          password: this.password,
        })
        .subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Contraseña actualizada correctamente',
            });
            setTimeout(() => {
              this.router.navigate(['/ingreso']);
            }, 2000);
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar la contraseña',
            });
            console.error('Error al actualizar la contraseña', error);
          }
        );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Las contraseñas no coinciden',
      });
    }
  }
}
