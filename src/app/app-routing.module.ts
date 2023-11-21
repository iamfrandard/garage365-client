import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TallerChatBoxComponent } from './taller-chat-box/taller-chat-box.component';
import { TallerListComponent } from './taller-list/taller-list.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatMainComponent } from './chat-main/chat-main.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentCancelComponent } from './payment-cancel/payment-cancel.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AppointmentClientListComponent } from './appointment-client/appointment-client-list/appointment-client-list.component';
import { AppointmentClientDetailsComponent } from './appointment-client/appointment-client-details/appointment-client-details.component';
import { ManagementEmployeeComponent } from './management-employee/management-employee.component';
import { ManagementScheduleComponent } from './management-schedule/management-schedule.component';
import { ManagementServiceComponent } from './management-service/management-service.component';
import { VerifyAccountUComponent } from './verify-accountU/verify-accountU.component';
import { VerifyAccountEComponent } from './verify-accountE/verify-accountE.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardReportComponent } from './dashboard-report/dashboard-report.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeComponent },
  { path: 'ingreso', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'recoverpassword', component: RecoverPasswordComponent },
  { path: 'resetpassword/:id', component: ResetPasswordComponent },
  { path: 'chat-de-expertos', component: TallerListComponent },
  { path: 'tallerchat/:id', component: TallerChatBoxComponent },
  { path: 'reservas', component: ProfileComponent },
  { path: 'chatlistT', component: ChatListComponent },
  { path: 'payment/:id', component: PaymentFormComponent },
  { path: 'chatbox', component: ChatBoxComponent },
  { path: 'taller/reportes', component: DashboardReportComponent },
  { path: 'chat-de-usuarios', component: ChatMainComponent },
  { path: 'busqueda', component: SearchComponent },
  { path: 'tutorials', component: AppointmentClientListComponent },
  { path: 'reservas/:id', component: AppointmentClientDetailsComponent },
  { path: 'taller/empleados', component: ManagementEmployeeComponent },
  { path: 'taller/horarios', component: ManagementScheduleComponent },
  { path: 'taller/servicios', component: ManagementServiceComponent },
  { path: 'verifyAccountU/:id', component: VerifyAccountUComponent },
  { path: 'verifyAccountE/:id', component: VerifyAccountEComponent },
  { path: 'configuracion', component: SettingsComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment-cancel', component: PaymentCancelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
