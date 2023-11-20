import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentClientService } from 'src/app/services/appointmentClient.service';

interface AppointmentBill {
  amount: string;
  file?: string;
}

interface AppointmentDetails {
  id: string;
  UserID: string;
  Workshop: string;
  Schedule: string;
  Location: string;
  Service: string;
  Status: string;
  Bill: AppointmentBill;
  Confirm: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css'],
})
export class PaymentFormComponent implements OnInit {
  paymentError: boolean = false;
  errorMessage: string = '';
  appointmentId: string = '';
  appointmentDetails: any;
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  stripeTest = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
  });
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '500',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
      invalid: {
        iconColor: '#ffc7ee',
        color: '#ffc7ee',
      },
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private router: Router,
    private _AppointmentClientService: AppointmentClientService
  ) {}

  ngOnInit(): void {
    this.appointmentId = this.getAppointmentId();
    if (this.appointmentId) {
      this.fetchAppointmentDetails(this.appointmentId);
    }
  }

  getAppointmentId(): string {
    return localStorage.getItem('appointmentId') || '';
  }

  fetchAppointmentDetails(appointmentId: string): void {
    this.paymentService.getAppointmentDetails(appointmentId).subscribe(
      (details) => {
        if (details && details.Bill) {
          this.appointmentDetails = details;
          this.paymentService
            .getUserDetails(details.UserID!)
            .subscribe((userDetails) => {
              this.stripeTest?.patchValue({
                name: userDetails.firstName + ' ' + userDetails.lastName,
              });
            });
          this.stripeTest?.patchValue({ description: details.Service });
          this.stripeTest?.patchValue({ amount: details.Bill.amount });
        } else {
          console.error('Los detalles de la factura son indefinidos');
        }
      },
      (error) =>
        console.error('Error al obtener los detalles de la cita', error)
    );
  }

  updateStatus(Status: string): void {
    const data = {
      Status: Status,
    };

    this._AppointmentClientService
      .update(this.appointmentId, data)
      .subscribe({
        next: (res) => {
          console.log("OK")
        },
        error: (e) => console.error(e),
      });
  }

  pay(): void {
    if (this.stripeTest.valid) {
      const amountValue = this.stripeTest.value.amount;
      if (amountValue) {
        const amountInCents = Math.round(parseFloat(amountValue) * 100);
        const description = this.stripeTest.value.description;
        if (amountInCents) {
          this.paymentService
            .createPaymentIntent(amountInCents, description!)
            .subscribe({
              next: (response) => {
                const clientSecret = response.client_secret;
                if (clientSecret) {
                  this.stripeService
                    .confirmCardPayment(clientSecret, {
                      payment_method: {
                        card: this.card.element,
                        billing_details: {
                          name: this.stripeTest.value.name ?? '',
                        },
                      },
                    })
                    .subscribe({
                      next: (result) => {
                        if (result.error) {
                          console.error(result.error.message);
                          this.paymentError = true;
                          this.errorMessage = '' + result.error.message;
                        } else if (
                          this.updateStatus("Completado"),
                          result.paymentIntent.status === 'succeeded'                          
                        ) {
                          this.router.navigate(['/payment-success']);
                        }
                      },
                      error: (error) => {
                        console.error(
                          'Error al confirmar el pago con la tarjeta',
                          error
                        );
                        this.paymentError = true;
                        this.errorMessage =
                          'Error al confirmar el pago con la tarjeta';
                      },
                    });
                } else {
                  console.error('client_secret no se recibió del servidor');
                }
              },
              error: (error) => {
                console.error('Error al crear la intención de pago', error);
                this.paymentError = true;
                this.errorMessage = 'Error al crear la intención de pago';
              },
            });
        } else {
          console.error('El monto ingresado no es un número válido');
          this.paymentError = true;
          this.errorMessage = 'El monto ingresado no es un número válido';
          return;
        }
      } else {
        console.error('El monto es requerido');
        this.paymentError = true;
        this.errorMessage = 'El monto es requerido';
        return;
      }
    } else {
      console.error('El formulario no es válido');
      this.paymentError = true;
      this.errorMessage = 'El formulario no es válido';
      return;
    }
  }
}
