import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { StorageServiceComponent } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
})
export class RecoverPasswordComponent {
  isButtonDisabled: boolean = false;
  countdown: number = 10;
  Id: string = '';
  resetLink: string = '';

  form: any = {};
  email: string = '';
  message: string = '';
  token: string = '';
  data: any;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private http: HttpClient,
    private storageService: StorageServiceComponent,
    private router: Router
  ) {}

  onSubmit(event: Event) {
    const currentUser2 = this.storageService.getUser().roles;
    if(currentUser2 == 'ROLE_USER' || currentUser2 == 'ROLE_MODERATOR')
    {
      setTimeout(() => {this.router.navigate(['/inicio']);});
    }
    
    event.preventDefault();
    const emailValue = this.email;

    this.authService.checkEmailExists(emailValue).subscribe(
      (response) => {
        if (response.exists) {
          this.handleUserIdAndSendEmail(emailValue, event);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'El email no está registrado en nuestro sistema.',
          });
        }
      },
      (error: any) => {
        if (error instanceof ErrorEvent) {
          // Client-side error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        } else {
          // Backend error
          if (error.status === 400 && error.error.exists) {
            this.handleUserIdAndSendEmail(emailValue, event);
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: 'El email no está registrado en nuestro Sistema.',
            });
          }
        }
      }
    );
  }

  handleUserIdAndSendEmail(emailValue: string, event: Event) {
    this.authService.getUserIdByEmail(emailValue).subscribe(
      (data) => {
        this.Id = data.userId || data.workshopId;
        this.resetLink = 'https://garage365.netlify.app/resetpassword/' + this.Id;
        this.sendEmail();
      },
      (error: any) => {
        if (error instanceof ErrorEvent) {
          // Client-side error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        } else {
          // Backend error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un error al obtener el ID del usuario.',
          });
        }
      }
    );
  }

  public sendEmail() {
    const emailParams = {
      email: this.email,
      link: this.resetLink,
    };

    emailjs
      .send(
        'service_r14escu',
        'template_eynp9v8',
        emailParams,
        'e1lwbmwrBmOqC36Dp'
      )
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(result.text);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail:
              'Se ha enviado un correo electrónico para restablecer tu contraseña.',
          });
        },
        (error: any) => {
          if (error instanceof ErrorEvent) {
            // Client-side error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          } else {
            // Backend error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Hubo un error al intentar enviar el correo electrónico. Por favor, inténtalo de nuevo.',
            });
          }
        }
      );

    this.isButtonDisabled = true;
    const interval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(interval);
        this.isButtonDisabled = false;
        this.countdown = 10;
        this.email = '';
      }
    }, 1000);
  }
}
