import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Basket } from 'src/app/shared/models/basket';
import { Address } from 'src/app/shared/models/user';
import { NavigationExtras, Router } from '@angular/router';
import { Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, loadStripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { OrderToCreate } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm?: FormGroup;
  @ViewChild('cardNumber') cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef;
  @ViewChild('cardCvc') cardCvcElement?: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardNumberComplete = false;
  cardExpiryComplete = false;
  cardCvcComplete = false;
  cardError: any;
  loading = false;

  constructor(private basketService: BasketService,
    private checkOutService: CheckoutService,
    private toaster: ToastrService, private router: Router) { }

  ngOnInit(): void {
    loadStripe('pk_test_51Oj6ObAoGE06HoQcWmobTL0pdTBnZn9hSCLDjVcVtEkznBMBeW6vARdQEqKt58KdEGLfcrRZwTY8Eo2dcEHmGTbv00icb8FO6i')
      .then(stripe => {
        this.stripe = stripe;
        const elements = stripe?.elements();
        if (elements) {
          this.cardNumber = elements.create('cardNumber');
          this.cardNumber.mount(this.cardNumberElement?.nativeElement);
          this.cardNumber.on('change', event => {
            this.cardNumberComplete = event.complete;
            if (event.error) this.cardError = event.error.message;
            else this.cardError = null;
          })

          this.cardExpiry = elements.create('cardExpiry');
          this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
          this.cardExpiry.on('change', event => {
            this.cardExpiryComplete = event.complete;
            if (event.error) this.cardError = event.error.message;
            else this.cardError = null;
          })

          this.cardCvc = elements.create('cardCvc');
          this.cardCvc.mount(this.cardCvcElement?.nativeElement);
          this.cardCvc.on('change', event => {
            this.cardCvcComplete = event.complete;
            if (event.error) this.cardError = event.error.message;
            else this.cardError = null;
          })
        }
      })
  }

  get paymentFormComplete() {
    return this.checkoutForm?.get('paymentForm')?.valid
      && this.cardNumberComplete
      && this.cardExpiryComplete
      && this.cardCvcComplete
  }

  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) throw new Error('Cannot get basket');
    try {
      const cratedOrder = await this.createOrder(basket);
      const paymetResult = await this.confirmPaymentWithStripe(basket)
      //console.log(paymetResult);
      if (paymetResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = { state: cratedOrder }
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        this.toaster.error(paymetResult.error.message);
      }
    } catch (error: any) {
      console.log(error);
      this.toaster.error(error.message);
    } finally {
      this.loading = false;
    }

  }
  private async confirmPaymentWithStripe(basket: Basket | null) {
    if (!basket) throw new Error('Basket is null');
    const result = this.stripe?.confirmCardPayment(basket.clientSecret!, {
      payment_method: {
        card: this.cardNumber!,
        billing_details: {
          name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
        }
      }
    });
    if (!result) throw new Error('Problem attempting payment with stripe');
    return result;
  }
  private async createOrder(basket: Basket | null) {
    if (!basket) throw new Error('Basket is null');
    const orderToCreate = this.getOrderToCreate(basket);
    return firstValueFrom(this.checkOutService.createOrder(orderToCreate))
  }

  private getOrderToCreate(basket: Basket): OrderToCreate {
    //console.log(basket);
    const delivaryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    // console.log(delivaryMethodId);
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as Address;
    //  console.log(shipToAddress);
    if (!delivaryMethodId || !shipToAddress) throw new Error('Problem with basket');
    return {
      basketId: basket.id,
      deliveryMethodId: delivaryMethodId,
      shipToAddress: shipToAddress
    }
  }
}
