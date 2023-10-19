import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brands';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
 @ViewChild('search') searchTerm? : ElementRef;
  products : Product[] = [];
  brands : Brand[] = [];
  types : Type[] = [];

  shopParams = new ShopParams();

  sortOption = [
    {name : 'Alphabetical' , value : 'name'},
    {name : 'Price : Low to high' , value : 'priceAsc'},
    {name : 'Price : High to low' , value : 'priceDesc'},
  ];
  totalCount = 0;

  constructor(private shopServices : ShopService){}

  ngOnInit(): void {
    this.getBrands();
    this.getTypes();
    this.getProducts();

  }

  getProducts(){
    this.shopServices.getProducts(this.shopParams).subscribe({
      next: respone => {
        this.products = respone.data;
        this.shopParams.pageNumber = respone.pageIndex;
        this.shopParams.pageSize = respone.pageSize;
        this.totalCount = respone.count;
      },
      error: error => console.log(error)
    })
  };

  getBrands(){
    this.shopServices.getBrands().subscribe({
      next:respone => this.brands = [{id:0 , name:'All'}, ...respone],
      error: error => console.log(error)
    })
  };

  getTypes(){
    this.shopServices.getTypes().subscribe({
      next:respone => this.types = [{id:0 , name:'All'}, ...respone],
      error: error => console.log(error)
    })
  };

  onBrandSelected(brandId: number){
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId:number){
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(event : any){
    this.shopParams.sort = event.target.value;
    this.getProducts();
  }

  onPageChnaged(event : any){
    if(this.shopParams.pageNumber !== event){
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch(){
    this.shopParams.search = this.searchTerm?.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }

}
