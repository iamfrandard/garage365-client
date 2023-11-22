import { Component, Input, ViewChild } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { Usuario } from 'src/app/models/usuario.model';
import { AppointmentClientService } from 'src/app/services/appointmentClient.service';
import { AppointmentWorkshopService } from 'src/app/services/appointmentWorkshop.service';
import { StorageServiceComponent } from 'src/app/services/storage.service';

@Component({
  selector: 'app-appointment-workshop-list',
  templateUrl: './appointment-workshop-list.component.html',
  styleUrls: ['./appointment-workshop-list.component.css'],
})
export class AppointmentWorkshopListComponent {
  @ViewChild('billingModal', { static: true }) billingModalContent: any;
  billAmount: any = null;
  billFile: any = null;
  @Input() Appointment: Appointment = {
    UserID: '',
    Workshop: '',
    Schedule: '',
    Status: '',
    Bill: { amount: '', file: '' },
    Confirm: false,
  };

  @Input() User: Usuario = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    idNumber: '',
    email: '',
  };

  tutorials?: Appointment[];
  appointment1?: Appointment[];
  appointment2?: Appointment[];
  appointment3?: Appointment[];
  
  user?: Usuario[];
  currentAppointment: Appointment = {};
  currentUser: Usuario = {};

  employee: any[] = [];
  selectedEmployee: any = null;

  fechaActual: Date = new Date();
  fechaFormatoISO: string = this.fechaActual.toISOString();
  
  message = '';

  CurrentUser: any = '';
  
  constructor(
    private storageService: StorageServiceComponent,
    private _AppointmentWorkshopService: AppointmentWorkshopService,
    private _AppointmentClientService: AppointmentClientService
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();
    this.CurrentUser = user.email;
    this.retrieveTutorials();
  }

  resetSelectedEmployee(): void {
    this.selectedEmployee = 'null';
  }

  getAllEmployee(): void {
    this._AppointmentClientService
      .getAllEmployee(this.currentAppointment.Workshop)
      .subscribe({
        next: (data: any[]) => {
          this.employee = data;
        },
        error: (e) => console.error(e),
      });
  }

  updatePublished(Confirm: boolean): void {
    const data = {
      Confirm: Confirm,
      Employee: this.selectedEmployee,
    };

    this._AppointmentClientService
      .update(this.currentAppointment.id, data)
      .subscribe({
        next: (res) => {
          this.Appointment.Confirm = Confirm;
        },
        error: (e) => console.error(e),
      });
  }

  updateStatus(Status: string): void {
    const data = {
      Status: Status,
    };

    this._AppointmentClientService
      .update(this.currentAppointment.id, data)
      .subscribe({
        next: (res) => {
          this.Appointment.Status = Status;
        },
        error: (e) => console.error(e),
      });
  }

  selectedOption: string = '';

  optionSelected() {
    if (this.selectedOption === '1') {
      this.updateStatus('Recepcion');
    } else if (this.selectedOption === '2') {
      this.updateStatus('En Progreso');
    } else if (this.selectedOption === '3') {
      this.updateStatus('Finalizado');
      this.selectedOption = 'Finalizado'
    }
  }

  retrieveTutorials(): void {
    this._AppointmentWorkshopService.getAll().subscribe({
      next: (data: any) => {
        console.log(data)
        this.tutorials = data.appointments;
        this.user = data.user;
        this.tutorials = this.tutorials.filter(tutorial => tutorial.Workshop == this.CurrentUser && tutorial.Status !== 'Cancelada');
        this.appointment1
        this.appointment2
        this.appointment3
      },
      error: (e) => console.error(e),
    });
  }

  setActiveTutorial(data: Appointment, User: Usuario): void {
    this.currentAppointment = data;
    this.currentUser = User;
  }

  refreshWindow() {
    window.location.reload();
  }

  cancelAppointment(): void {
    const workshopString: string = String(this.currentAppointment.id);
  
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

  async saveBillDetails() {
    const formData = new FormData();
      formData.append('billFile', this.billFile, this.billFile.name);
      formData.append('Bill.amount', this.billAmount.toString());

      try {
          const res = await this._AppointmentClientService
              .updateL(this.currentAppointment.id, formData)
              .toPromise();
          console.log('Factura actualizada con éxito');
      } catch (e) {
        console.error(e);
      }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.billFile = event.target.files[0];
    }
  }
}