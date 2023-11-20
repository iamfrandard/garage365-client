import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

const baseUrl = 'https://goldfish-app-67lk9.ondigitalocean.app/api/appointmentClient';

const AUTH_API = 'https://goldfish-app-67lk9.ondigitalocean.app/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, description: string): Observable<any> {
    return this.http.post(AUTH_API + `/create-payment-intent`, {
      amount,
      description,
    });
  }

  getAppointmentDetails(id: any): Observable<Appointment> {
    return this.http.get<Appointment>(`${baseUrl}/${id}`);
  }

  getUserDetails(userId: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/user/${userId}`);
  }
}
