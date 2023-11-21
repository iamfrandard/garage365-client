import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StorageServiceComponent } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'management-service',
  templateUrl: './management-service.component.html',
  styleUrls: ['./management-service.component.css'],
})
export class ManagementServiceComponent {
  currentUser: string = "";
  service: any[] = [];
  
  currentService: any = null;

  nameService: string = "";
  descriptionService: string = "";

  constructor
  (
    private authService: AuthService,
    private storageService: StorageServiceComponent,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if(currentUser2 == 'ROLE_USER')
    {
      setTimeout(() => {this.router.navigate(['/inicio']);});
    }

    this.currentUser = this.storageService.getUser().id;
    this.getAllService();
  }

  refreshWindow() {
    window.location.reload();
  }

  getAllService(): void {
    this.authService.getAllService(this.currentUser).subscribe(data => {
      this.service = data;
    }, error => {
      console.error('NOT OK - ', error);
    });
  }
    
  selectService(x: any) {
    if (this.currentService) {
        this.currentService.isSelected = false;
    }
    if (this.currentService !== x) {
      x.isSelected = true;
        this.currentService = x;
        this.nameService = this.currentService.inputService;
        this.descriptionService = this.currentService.inputServiceDescription;
    } else {
        this.currentService = null;
    }
  }

  addService(): void{
    const data = {
      id: this.currentUser,
      inputService: this.nameService,
      inputServiceDescription: this.descriptionService
    };

    this.authService.addService(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllService();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  updateService(): void{
    const data = {
      workshopID: this.currentUser,
      serviceID: this.currentService._id, 
      inputService: this.nameService,
      inputServiceDescription: this.descriptionService
    };

    this.authService.updateService(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllService();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  deleteService(): void{
    const data = {
      workshopID: this.currentUser,
      serviceID: this.currentService._id, 
    };

    this.authService.deleteService(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllService();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }
}
