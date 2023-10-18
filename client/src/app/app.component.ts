import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { Product } from './models/product';
import { Pagination } from './models/pagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'skinet';
  products: Product[] = [];

  constructor(private _http:HttpClient){}

  ngOnInit(): void {
    this._http.get<Pagination<Product>> ('https://localhost:5001/api/products?pageSize=50').subscribe(
    {
      next: (response:any) => this.products = response.data, // what do next
      error : error => console.log(error),
      complete : () => {
        console.log('request is completed');
        console.log('extra statement');
      }
    })
  }
}
