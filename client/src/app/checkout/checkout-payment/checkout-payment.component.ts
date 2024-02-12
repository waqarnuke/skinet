import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Basket } from 'src/app/shared/models/basket';
import { Address } from 'src/app/shared/models/user';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent {
  @Input() checkoutForm?: FormGroup;

  constructor(private basketService: BasketService,
    private checkOutService: CheckoutService,
    private toaster: ToastrService, private router: Router) { }

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) return;
    const orderToCreate = this.getOrderToCreate(basket);
    console.log("gasdg" + orderToCreate);
    if (!orderToCreate) return;
    this.checkOutService.createOrder(orderToCreate).subscribe({
      next: order => {
        this.toaster.success('Order created successfully');
        this.basketService.deleteLocalBasket();
        const navigationExtras: NavigationExtras = { state: order }
        this.router.navigate(['checkout/success'], navigationExtras);
      }
    })
  }

  private getOrderToCreate(basket: Basket) {
    console.log(basket);
    const delivaryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    console.log(delivaryMethodId);
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as Address;
    console.log(shipToAddress);
    if (!delivaryMethodId || !shipToAddress) return;
    return {
      basketId: basket.id,
      deliveryMethodId: delivaryMethodId,
      shipToAddress: shipToAddress
    }
  }
}
