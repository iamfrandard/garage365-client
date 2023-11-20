import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '../environments/environments';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { SocketService } from '../app/services/socket.service';
import { AppointmentClientListComponent } from './appointment-client/appointment-client-list/appointment-client-list.component';
import { AppointmentClientDetailsComponent } from './appointment-client/appointment-client-details/appointment-client-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { httpInterceptorProviders } from './helpers/http.interceptor';
import { CardModule } from 'primeng/card';
import { AppointmentWorkshopListComponent } from './appointment-workshop/appointment-workshop-list/appointment-workshop-list.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ListboxModule } from 'primeng/listbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChartModule } from 'primeng/chart';
import { DashboardReportComponent } from './dashboard-report/dashboard-report.component';

import { HeaderComponent } from './hearder/header.component';
import { FooterComponent } from './footer/footer.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { TallerChatBoxComponent } from './taller-chat-box/taller-chat-box.component';
import { TallerListComponent } from './taller-list/taller-list.component';
import { ChatMainComponent } from './chat-main/chat-main.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentCancelComponent } from './payment-cancel/payment-cancel.component';

import { ManagementEmployeeComponent } from './management-employee/management-employee.component';
import { ManagementScheduleComponent } from './management-schedule/management-schedule.component';
import { ManagementServiceComponent } from './management-service/management-service.component';

import { VerifyAccountUComponent } from './verify-accountU/verify-accountU.component';
import { VerifyAccountEComponent } from './verify-accountE/verify-accountE.component';

import { SettingsComponent } from './settings/settings.component';
import { SettingsUserComponent } from './settings-user/settings-user.component';
import { SettingsWorkshopComponent } from './settings-workshop/settings-workshop.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardReportComponent,
    HomeComponent,
    ProfileComponent,
    SearchComponent,
    AppointmentClientListComponent,
    AppointmentClientDetailsComponent,
    AppointmentWorkshopListComponent,
    HeaderComponent,
    FooterComponent,
    RecoverPasswordComponent,
    ResetPasswordComponent,
    ManagementEmployeeComponent,
    ManagementScheduleComponent,
    ManagementServiceComponent,
    VerifyAccountUComponent,
    VerifyAccountEComponent,
    SettingsComponent,
    SettingsUserComponent,
    SettingsWorkshopComponent,
    ChatBoxComponent,
    ChatListComponent,
    TallerChatBoxComponent,
    TallerListComponent,
    ChatMainComponent,
    PaymentFormComponent,
    PaymentSuccessComponent,
    PaymentCancelComponent,
    DashboardReportComponent,
  ],
  imports: [
    BrowserModule,
    NgxStripeModule.forRoot(environment.stripePublicKey),
    AppRoutingModule,
    FormsModule,
    NgbModule,
    ChartModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastModule,
    ButtonModule,
    ListboxModule,
    CardModule,
    InputTextareaModule,
  ],
  providers: [
    httpInterceptorProviders,
    MessageService,
    SocketService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
