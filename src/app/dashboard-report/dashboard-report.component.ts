import { Component, OnInit, Injectable } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { StorageServiceComponent } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

interface AppointmentStats {
  [key: string]: number;
}

@Component({
  selector: 'app-dashboard-report',
  templateUrl: './dashboard-report.component.html',
  styleUrls: ['./dashboard-report.component.css'],
})
export class DashboardReportComponent implements OnInit {
  incomeStats: any;
  monthlyUserData: any;
  appointmentTrendData: any;
  appointmentStats: any = {};
  workshopId: string | undefined;
  totalAppointments: number = 0;
  workshopName: string | undefined;
  popularServicesData: any;

  constructor(
    private statsService: ReportService,
    private storageService: StorageServiceComponent,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.storageService.getUser();
    this.workshopId = user?.id;
    if (this.workshopId) {
      this.statsService.getIncomeStats(this.workshopId).subscribe((data) => {
        this.incomeStats = this.transformToChartData(data);
      });
      // Get total appointments
      this.statsService
        .getTotalAppointments(this.workshopId)
        .subscribe((data) => {
          this.totalAppointments = data.totalAppointments;
          this.appointmentStats = data.stats.reduce(
            (acc: AppointmentStats, stat) => {
              acc[stat._id] = stat.count;
              return acc;
            },
            {}
          );
        });
      // Obtener datos de servicios populares
      this.statsService
        .getPopularServices(this.workshopId)
        .subscribe((data) => {
          this.popularServicesData = this.transformToPieChartData(data);
        });

      this.statsService
        .getAppointmentTrend(this.workshopId)
        .subscribe((data) => {
          this.appointmentTrendData = this.transformToLineChartData(data);
        });

      this.statsService.getMonthlyUsers(this.workshopId).subscribe((data) => {
        this.monthlyUserData = this.transformToDoughnutChartData(data);
      });
    } else {
      console.error('No workshop ID found');
    }
  }

  transformToDoughnutChartData(data: any[]): any {
    const Months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const labels = data.map((item) => Months[item._id - 1]);
    const userCounts = data.map((item) => item.userCount);

    return {
      labels: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      datasets: [
        {
          label: 'Usuarios Atendidos',
          backgroundColor: 'rgb(255, 159, 64)',
          data: userCounts,
        },
      ],
    };
  }

  transformToChartData(data: any[]): any {
    const Months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const labels = data.map((item) => Months[item._id - 1]);
    const incomes = data.map((item) => item.totalIncome);

    return {
      labels: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      datasets: [
        {
          label: 'Ingresos por Mes',
          backgroundColor: ['rgb(54, 162, 235)'],
          borderWidth: 1,
          data: incomes,
        },
      ],
    };
  }

  transformToLineChartData(data: any[]): any {
    const weekdays = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const labels = data.map((item) => weekdays[item._id - 1]);
    const values = data.map((item) => item.count);

    return {
      labels: [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
      ],
      datasets: [
        {
          label: 'Número de Citas por Día',
          data: values,
          fill: false,

          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
          ],
          tension: 0.5,
        },
      ],
    };
  }

  transformToPieChartData(data: any[]): any {
    const labels = data.map((item) => item._id);
    const values = data.map((item) => item.count);

    const colors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
    ];

    return {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors.slice(0, data.length),
        },
      ],
    };
  }

  logout(): void {
    this.router.navigate(['/inicio']);
  }
}
