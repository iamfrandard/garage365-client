import { Component, OnInit } from '@angular/core';
import { StorageServiceComponent } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(private storageService: StorageServiceComponent, private router: Router) { }

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if(currentUser2 == null)
    {
      setTimeout(() => {this.router.navigate(['/inicio']);});
    }

    this.currentUser = this.storageService.getUser();
  }
}
