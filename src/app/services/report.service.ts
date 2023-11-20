import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AppointmentStat {
  _id: string;
  count: number;
}

interface TotalAppointmentsResponse {
  tallerName: string;
  totalAppointments: number;
  stats: AppointmentStat[];
}

const baseUrl = 'http://localhost:8080/taller/reportes';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) {}

  // report.service.ts
  getIncomeStats(workshopId: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/income/${workshopId}`);
  }

  getTotalAppointments(
    workshopId: string
  ): Observable<TotalAppointmentsResponse> {
    return this.http.get<TotalAppointmentsResponse>(
      `${baseUrl}/total-appointments/${workshopId}`
    );
  }

  getPopularServices(workshopId: string) {
    return this.http.get<any[]>(`${baseUrl}/popular-services/${workshopId}`);
  }

  getAppointmentTrend(workshopId: string) {
    return this.http.get<any[]>(`${baseUrl}/appointment-trend/${workshopId}`);
  }

  getMonthlyUsers(workshopId: string) {
    return this.http.get<any[]>(`${baseUrl}/monthly-users/${workshopId}`);
  }
}
