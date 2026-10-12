import { Component } from '@angular/core';
import { StripeService } from '../../services/stripe.service';
import { CommandService } from '../../services/command.service';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
})
export class PaymentComponent {
  stripe!: Stripe | null;
  elements!: StripeElements | null;
  documentId?: string | undefined;
  clientSecret?: string | undefined;

  constructor(
    private readonly stripeService: StripeService,
    private readonly commandService: CommandService,
  ) {
    this.initializePayment();
  }

  private async initializePayment() {
    const commandId = this.commandService.currentCommand?.documentId;

    if (!commandId) {
      throw new Error('Command ID is missing');
    }

    try {
      const { clientSecret } = await firstValueFrom(
        this.stripeService.createCheckoutSession(commandId),
      );

      this.clientSecret = clientSecret;

      if (!this.clientSecret) {
        throw new Error('Error creating checkout session');
      }

      if (!this.stripe) {
        throw new Error('Stripe is not initialized');
      }

      const checkout = await this.stripe.initEmbeddedCheckout({
        fetchClientSecret: async () => this.clientSecret!,
      });

      checkout.mount('#checkout');
    } catch (error: any) {
      console.error('Error initializing payment:', error);
    }
  }
}
