import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  KashrutTypes:any;
  productTypes:string[];
  products:any;

  constructor(private firedb:AngularFireDatabase) { 
    firedb.object('/KashrutTypes').valueChanges().subscribe(kt => {
      this.KashrutTypes = kt;
    });
    firedb.object('/productTypes').valueChanges().subscribe((pt:string[]) => {
      this.productTypes = pt;
    });
    firedb.object('/products').valueChanges().subscribe(products => {
      this.products = products;
    })
  }

  getKashrutTypes():any{
    return this.KashrutTypes;
  }

  getProductTypes():string[]{
    return this.productTypes;
  }

  getProducts():any{
    return this.products;
  }

  signUpOrder(sum:number):void{
    this.firedb.object('/totalRevenue').query.ref.transaction(rev => {
      if (rev === null) {
          return rev = sum;
      } else {
          return rev + sum;
      }
    });

    this.firedb.object('/numOrders').query.ref.transaction(val => {
      if (val === null) {
          return val = 1;
      } else {
          return val + 1;
      }
    });

  }


  incrementViewCount():void{
    this.firedb.object('/viewCount').query.ref.transaction(val => {
      if (val === null) {
          return val = 1;
      } else {
          return val + 1;
      }
    });
  }
}
