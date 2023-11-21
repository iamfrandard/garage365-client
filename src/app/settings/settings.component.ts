import { Component, OnInit } from '@angular/core';
import { StorageServiceComponent } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import data from './Cars.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  currentUser: any;
  
  constructor
  (
    private storageService: StorageServiceComponent,
    private router: Router
    ) { }

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if(currentUser2 == null)
    {
      setTimeout(() => {this.router.navigate(['/inicio']);});
    }

    this.currentUser = this.storageService.getUser();
  }
}