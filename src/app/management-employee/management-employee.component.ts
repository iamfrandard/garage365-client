import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StorageServiceComponent } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'management-employee',
  templateUrl: './management-employee.component.html',
  styleUrls: ['./management-employee.component.css'],
})
export class ManagementEmployeeComponent {
  currentUser: string = "";
  employee: any[] = [];
  
  currentEmployee: any = null;

  nameEmployee: string = "";
  positionEmployee: string = "";

  constructor
  (
    private authService: AuthService,
    private storageService: StorageServiceComponent,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if(currentUser2 == 'ROLE_USER' || currentUser2 == null)
    {
      setTimeout(() => {this.router.navigate(['/inicio']);});
    }

    this.currentUser = this.storageService.getUser().id;
    this.getAllEmployee();
  }

  refreshWindow() {
    window.location.reload();
  }

  getAllEmployee(): void {
    this.authService.getAllEmployee(this.currentUser).subscribe(data => {
      this.employee = data;
    }, error => {
      console.error('NOT OK - ', error);
    });
  }
    
  selectEmployee(x: any) {
    if (this.currentEmployee) {
        this.currentEmployee.isSelected = false;
    }
    if (this.currentEmployee !== x) {
      x.isSelected = true;
        this.currentEmployee = x;
        this.nameEmployee = this.currentEmployee.name;
        this.positionEmployee = this.currentEmployee.position;
    } else {
        this.currentEmployee = null;
    }
  }

  addEmployee(): void{
    const data = {
      id: this.currentUser,
      name: this.nameEmployee,
      position: this.positionEmployee
    };

    this.authService.addEmployee(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllEmployee();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  updateEmployee(): void{
    const data = {
      userID: this.currentUser,
      employeeID: this.currentEmployee._id, 
      name: this.nameEmployee,
      position: this.positionEmployee
    };

    this.authService.updateEmployee(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllEmployee();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  deleteEmployee(): void{
    const data = {
      userID: this.currentUser,
      employeeID: this.currentEmployee._id, 
      name: this.nameEmployee,
      position: this.positionEmployee
    };

    this.authService.deleteEmployee(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllEmployee();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }
}
