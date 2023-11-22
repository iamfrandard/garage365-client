import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/models/appointment.model';
import { AppointmentClientService } from 'src/app/services/appointmentClient.service';
import { StorageServiceComponent } from 'src/app/services/storage.service';

@Component({
  selector: 'app-appointment-client-list',
  templateUrl: './appointment-client-list.component.html',
  styleUrls: ['./appointment-client-list.component.css'],
})
export class AppointmentClientListComponent {
  tutorials?: Appointment[];
  appointment1?: Appointment[];
  appointment2?: Appointment[];
  appointment3?: Appointment[];

  currentTutorial: Appointment = {};
  currentIndex = -1;
  title = '';
  fechaActual: Date = new Date();
  fechaFormatoISO: string = this.fechaActual.toISOString();
  message = '';

  Estado0 = 'Completado';
  Estado1 = 'Recepcion';
  Estado2 = 'En Progreso';
  Estado3 = 'Finalizado';
  Estado4 = 'Cancelada';

  rating: number = 0;
  comment: string = '';

  CurrentUser = '';

  constructor(
    private _AppointmentClientService: AppointmentClientService,
    private _StorageService: StorageServiceComponent,
    private router: Router
  ) {}

  

  ngOnInit(): void {
    const currentUser2 = this._StorageService.getUser().roles;
    if(currentUser2 == null)
    {
      setTimeout(() => {this.router.navigate(['/inicio']);});
    }
    this.retrieveTutorials();
    this.CurrentUser = this._StorageService.getUser().id;
  }

  refreshWindow() {
    window.location.reload();
  }

  retrieveTutorials(): void {
    this._AppointmentClientService.getAll().subscribe({
      next: (data) => {
        this.tutorials = data;
        this.tutorials = this.tutorials.filter(tutorial => tutorial.Status !== 'Cancelada');
        this.appointment1 = this.tutorials.filter(tutorial => tutorial.Status == null);
        this.appointment2 = this.tutorials.filter(tutorial => tutorial.Status !== null && tutorial.Status !== 'Completado');
        this.appointment3 = this.tutorials.filter(tutorial => tutorial.Status == 'Completado');
      },
      error: (e) => console.error(e),
    });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Appointment, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    this._AppointmentClientService.deleteAll().subscribe({
      next: (res) => {
        this.refreshList();
      },
      error: (e) => console.error(e),
    });
  }

  searchTitle(): void {
    this.currentTutorial = {};
    this.currentIndex = -1;

    this._AppointmentClientService.findByTitle(this.title).subscribe({
      next: (data) => {
        this.tutorials = data;
      },
      error: (e) => console.error(e),
    });
  }

  redirectToStripe(id: string) {
    localStorage.setItem('appointmentId', id);
    this.router.navigateByUrl(`/payment/${id}`);
  }

  

  postComment(): void {
    const workshopString: string = String(this.currentTutorial.Workshop);
    this._AppointmentClientService
      .postReviews(workshopString, this.rating, this.comment)
      .subscribe(
        (response) => {
          console.log('OK');
          this.rating = 0;
          this.comment = '';
        },
        (error) => {
          console.error('NOT OK');
        }
      );
  }

  setRating(value: number): void {
    this.rating = value;
  }

  cancelAppointment(): void {
  const workshopString: string = String(this.currentTutorial.id);

  this._AppointmentClientService.cancelAppointment(workshopString, this.fechaFormatoISO)
    .subscribe(
      (isSuccess) => {
        if (isSuccess) {
          console.log('Cancelación exitosa');
          this.message = "Su reserva ha sido cancelada exitosamente. Agradecemos su comprensión.";
        } else {
          console.log('Cancelación fallida');
          this.message = "Lo sentimos, las reservas solo pueden cancelarse con al menos 3 días de anticipación. Para más detalles, por favor revise nuestras políticas de cancelación.";
        }
      },
      (error) => {
        console.error('Error en la solicitud de cancelación');
        this.message = "Ocurrió un error al procesar su solicitud de cancelación. Por favor, póngase en contacto con el equipo de soporte de Garage365 en garage365@gmail.com. Lamentamos los inconvenientes causados.";
      }
    );
  }

}
