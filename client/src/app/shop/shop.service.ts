import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../shared/models/product';
import { Pagination } from '../shared/models/pagination';
import { Brand } from '../shared/models/brands';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';


@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'https://localhost:5001/api/';

  constructor(private htpp:HttpClient) { }

  getProducts(ShopParams:ShopParams){
    let params = new HttpParams();

    if( ShopParams.brandId > 0) params = params.append('brandId', ShopParams.brandId);
    if(ShopParams.typeId) params = params.append('typeId', ShopParams.typeId);
    params = params.append('sort', ShopParams.sort);
    params = params.append('PageIndex', ShopParams.pageNumber);
    params = params.append('pageSize', ShopParams.pageSize);
    if(ShopParams.search) params = params.append('search', ShopParams.search);

    return this.htpp.get<Pagination<Product[]>>(this.baseUrl + 'products',{params});
  }

  getProduct(id:number){
    return this.htpp.get<Product>(this.baseUrl + 'products/'+ id);
  }

  getBrands(){
    return this.htpp.get<Brand[]>(this.baseUrl + 'products/brands')
  }
  getTypes(){
    return this.htpp.get<Type[]>(this.baseUrl + 'products/types')
  }
}
