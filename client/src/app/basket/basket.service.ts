import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/product';
import { tick } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<Basket | null>(null);
  basketSource$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotalSource$ = this.basketTotalSource.asObservable();

  constructor(private _http:HttpClient) { }

  getBaseket(id:string){
    return this._http.get<Basket>(this.baseUrl + 'basket?id='+id).subscribe({
      next:basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
      }
    })
  }

  setBasket(basket:Basket){
    return this._http.post<Basket>(this.baseUrl + 'basket', basket).subscribe({
      next:basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
      }
    })
  }

  getCurrentBasketValue(){
    return this.basketSource.value;
  }

  AddItemToBasket(item:Product | BasketItem, quantity = 1){
    if(this.isProduct(item)) item = this.mapProductItemToBasketItme(item);
    //const itemToAdd = this.mapProductItemToBasketItme(item);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items =  this.addOrUpdateItem(basket.items, item , quantity)
    this.setBasket(basket)
  }

  removeItemFromBasket(id:number, quantity = 1){
    const basket = this.getCurrentBasketValue();
    if(!basket)  return;
    const item =  basket.items.find(x =>x.id === id);
    if(item){
      item.quantity -= quantity;
      if(item.quantity === 0){
        basket.items = basket.items.filter(x => x.id !== id);
      }
      if(basket.items.length > 0) this.setBasket(basket);
      else this.deleteBasket(basket)
    }
  }
  deleteBasket(basket: Basket) {
    return this._http.delete(this.baseUrl + "basket?id=" + basket.id).subscribe({
      next: () =>{
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id')
      }
    })
  }

  private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    const item = items.find(x=>x.id === itemToAdd.id);
    if(item) item.quantity += quantity;
    else{
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }

    return items;
  }

  createBasket():Basket{
    const basket = new Basket();
    localStorage.setItem('basket_id',basket.id);
    return basket;
  }

  private mapProductItemToBasketItme(item:Product) : BasketItem{
    return {
      id : item.id,
      productName:item.name,
      price:item.price,
      quantity : 0,
      pictureUrl : item.pictureUrl,
      brand : item.productBrand,
      type : item.productType
    }
  }

  private calculateTotals(){
    const basket = this.getCurrentBasketValue();
    if(!basket) return;
    const shipping = 0;
    const subTotal = basket.items.reduce((a, b) => (b.price * b.quantity)+ a, 0);
    const total = subTotal + shipping;
    this.basketTotalSource.next({shipping, total,subTotal})
  }

  private isProduct(item : Product | BasketItem):item is Product{
    return (item as Product).productBrand !== undefined;
  }
}
