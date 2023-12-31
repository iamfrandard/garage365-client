import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { NgForm } from '@angular/forms';
import { StorageServiceComponent } from "../services/storage.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  content?: string;
  currentUser = "";

  constructor(private userService: UserService, private storageService: StorageServiceComponent) {}

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser().roles;
    this.userService.getPublicContent().subscribe({
      next: (data) => {
        this.content = data;
      },
      error: (err) => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      },
    });
  }

  refreshWindow() {
    window.location.reload();
  }

  onSubmit(event: Event, f: NgForm) {
    if (f.valid) {
      this.sendEmail(event);
      f.resetForm();
    } else {
    }
  }

  public sendEmail(e: Event) {
    e.preventDefault();
    emailjs
      .sendForm(
        'service_r14escu',
        'template_46l1xxp',
        e.target as HTMLFormElement,
        'e1lwbmwrBmOqC36Dp'
      )
      .then(
        (result: EmailJSResponseStatus) => {},
        (error) => {}
      );
  }
}
