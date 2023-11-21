import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageServiceComponent } from '../services/storage.service';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css'],
})
export class ChatMainComponent {
  sessionData!: {
    sessionId: string;
    userId: string;
    userName: string;
    expertId: string;
    expertName: string;
  };

  constructor(private router: Router, private storageService: StorageServiceComponent) {}

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if(currentUser2 == 'ROLE_USER' || currentUser2 == null)
    {
      setTimeout(() => {this.router.navigate(['/inicio']);});
    }
  }

  handleSessionChange(data: {
    sessionId: string;
    userId: string;
    userName: string;
    expertId: string;
    expertName: string;
  }) {
    this.sessionData = data;
  }

  logout(): void {
    this.router.navigate(['/inicio']);
  }
}
