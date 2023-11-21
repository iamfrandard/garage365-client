import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from 'src/app/models/appointment.model';
import { AppointmentClientService } from 'src/app/services/appointmentClient.service';
import { SearchServiceComponent } from 'src/app/services/search.service';
import { StorageServiceComponent } from 'src/app/services/storage.service';

@Component({
  selector: 'app-appointment-client-details',
  templateUrl: './appointment-client-details.component.html',
  styleUrls: ['./appointment-client-details.component.css'],
})
export class AppointmentClientDetailsComponent {
  Locations = '';
  Services = '';
  Alert = false;
  commentValue: string = '';
  isPriorityService: boolean = false;
  reviews: any[] = [];
  cars: any[] = [];
  _Cars: any[] = [];
  averageRating: number = 0;
  workshopId: string = '';
  schedules: any[] = [];
  selectedDay = '';
  selectedTime = '';
  selectedDate = '';

  currentSlide = 0;
  autoSlideInterval: any;

  _Appointment: Appointment = {
    UserID: '',
    Workshop: '',
    Schedule: '',
    Location: '',
    Service: '',
    Status: '',
    Bill: { amount: '', file: '' },
    Confirm: false,
    Comment: '',
    PriorityService: false,
  };
  submitted = false;
  workshops: any;

  @Input() viewMode = true;

  @Input() Appointment: Appointment = {
    UserID: '',
    Workshop: '',
    Schedule: '',
    Status: '',
    Bill: { amount: '', file: '' },
    Confirm: false,
    Comment: '',
    PriorityService: false,
  };

  @Input() Workshop: any;

  message = '';

  constructor(
    private _AppointmentClientService: AppointmentClientService,
    private _SearchService: SearchServiceComponent,
    private route: ActivatedRoute,
    private _StorageService: StorageServiceComponent,
    private router: Router
  ) {}

  direcciones: any[] = [];
  servicios: any[] = [];
  CurrentUser = '';
  CurrentUser2 = '';
  Role = 'ROLE_USER';

  ngOnInit(): void {
    const currentUser2 = this._StorageService.getUser().roles;
    if(currentUser2 == null)
    {
      setTimeout(() => {this.router.navigate(['/inicio']);});
    }
    this.message = '';
    this.getTutorial(this.route.snapshot.params['id']);
    this.CurrentUser = this._StorageService.getUser().id;
    this.CurrentUser2 = this._StorageService.getUser().roles;
    this.workshopId = this.route.snapshot.params['id'];
    this.getCars();
    this.fetchReviews();
    this.autoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSlideInterval);
  }

  getTutorial(id: string): void {
    this._SearchService.get(id).subscribe({
      next: (data) => {
        this.Workshop = data;
        this.schedules = this.Workshop.schedule;

        this._SearchService.getDirecciones(id).subscribe(
          (direccionesData) => {
            this.direcciones = direccionesData.locations;
          },
          (error) => {
            console.error('Error al obtener las direcciones:', error);
          }
        );

        this._SearchService.getServicios(id).subscribe(
          (serviciosData) => {
            this.servicios = serviciosData.vehicleService;
          },
          (error) => {
            console.error('Error al obtener los servicios:', error);
          }
        );
      },
      error: (e) => console.error(e),
    });
  }

  updatePublished(status: boolean): void {
    const data = {
      Schedule: this.Appointment.Schedule,
    };

    this.message = '';

    this._AppointmentClientService.update(this.Appointment.id, data).subscribe({
      next: (res) => {
        this.Appointment.Confirm = status;
        this.message = res.message
          ? res.message
          : 'The status was updated successfully!';
      },
      error: (e) => console.error(e),
    });
  }

  updateTutorial(): void {
    this.message = '';

    this._AppointmentClientService
      .update(this.Appointment.id, this.Appointment)
      .subscribe({
        next: (res) => {
          this.message = res.message
            ? res.message
            : 'This tutorial was updated successfully!';
        },
        error: (e) => console.error(e),
      });
  }

  saveTutorial(): void {
    const data = {
      UserID: this.CurrentUser,
      Workshop: this.Workshop.WorkshopName,
      Schedule: this.selectedDay + ', ' + this.selectedTime + ' (' + this.selectedDate + ')',
      Location: this.Locations,
      Service: this.Services,
      Comment: this.commentValue,
      PriorityService: this.isPriorityService,
      Cars: this._Cars,
    };

    console.log(data)

    this.Alert = true;

    this._AppointmentClientService.create(data).subscribe({
      next: (res) => {
        this.submitted = true;
      },
      error: (e) => console.error(e),
    });
  }

  newTutorial(): void {
    this.submitted = false;
    this._Appointment = {
      UserID: '',
      Workshop: '',
      Schedule: '',
      Status: '',
      Bill: { amount: '', file: '' },
      Confirm: false,
    };
  }

  getWorkshopList() {
    this._AppointmentClientService.getWorkshopList().subscribe((data) => {
      this.workshops = data;
    });
  }

  fetchReviews(): void {
    this._AppointmentClientService.getReviews(this.workshopId).subscribe(
      (data) => {
        this.reviews = data;
        const totalRating = this.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        this.averageRating = this.reviews.length
          ? totalRating / this.reviews.length
          : 0;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  getCars(): void {
    this._AppointmentClientService.getCars(this.CurrentUser).subscribe(
      (data) => {
        this.cars = data;
        console.log(this.CurrentUser);
        console.log(data);
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  autoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  previousSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.reviews.length - 1;
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.reviews.length - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0;
    }
  }

  onDayChange() {
    this.selectedTime = '';
    const nextDate = this.calculateNextDate(this.selectedDay);
  
    const day = nextDate.getDate().toString().padStart(2, '0');
    const month = (nextDate.getMonth() + 1).toString().padStart(2, '0'); // Enero es 0
    const year = nextDate.getFullYear();
  
    this.selectedDate = `${day}-${month}-${year}`;
    console.log(this.selectedDate)
  }
  

  getTimesForDay(day: string) {
    const schedule = this.schedules.find((s) => s.day === day);
    if (!schedule) return [];
  
    const today = new Date();
    const currentHour = today.getHours();
    const isToday = this.isToday(schedule.day);
  
    let times = [];
    for (let i = schedule.timeStart; i <= schedule.timeFinish; i++) {
      if (isToday && i <= currentHour) {
        continue;
      }
  
      const amPm = i >= 12 ? ': 00 PM' : ': 00 AM';
      let hour = i % 12;
      hour = hour ? hour : 12;
      times.push(`${hour} ${amPm}`);
    }
    return times;
  }

  isToday(selectedDay: string): boolean {
    const today = new Date();
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const todayDayOfWeek = daysOfWeek[today.getDay()];
    return selectedDay === todayDayOfWeek;
  }
  

  calculateNextDate(selectedDay: string): Date {
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const selectedDayIndex = daysOfWeek.indexOf(selectedDay);
  
    let daysToAdd = selectedDayIndex - todayDayOfWeek;
  
    if (daysToAdd === 0) {
      return today;
    } else if (daysToAdd < 0) {
      daysToAdd += 7;
    }
  
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + daysToAdd);
    return nextDate;
  }
  
  
}
