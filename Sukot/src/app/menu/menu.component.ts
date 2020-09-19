import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import {FormControl , Validators} from '@angular/forms';
import { ViewChild } from '@angular/core'
import db from '../../assets/db.json';

const ARAVOT_PRICE:number = 5;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(MenuDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
    
  }

}

export class SoldItem {
  item: string;
  amount: number;
  priceForEach: number;
  totalPrice: number;

  constructor(item:string,amount:number,priceForEach:number){
      this.item = item;
      this.amount = amount;
      this.priceForEach = priceForEach;
      this.totalPrice = this.amount * this.priceForEach;
  }
}

@Component({
  selector: 'menu-dialog',
  templateUrl: './menu-dialog.html',
})
export class MenuDialog implements OnInit {
  @ViewChild('stepper') stepper;
  dataSource: SoldItem[];
  displayedColumns: string[] = ["item","amount","price_for_each","total_price"];
  db = db;
  AravotType1 : any;
  AravotType2 : any;
  positiveValue : FormControl;
  setsArr: number[]; //Helps implementing the "more sets" feature


    constructor(){
    }

    ngOnInit(): void {
      this.setsArr = [1];
      this.AravotType1 = {
        name:"זוג ערבות בכשרות בדץ העדה החרדית",
        amount:0
      }
      this.AravotType2 = {
        name:"זוג ערבות בכשרות בדץ הבית יוסף",
        amount:0
      }
      this.dataSource = [];
      this.positiveValue = new FormControl("", [Validators.min(0)])
    }

    AddSet():void{
      this.setsArr.push(1);
    }

    ValidateSetOrder():void{
      this.stepper.next();
    }

    AddAravot(type:number):void{
      console.log(type);
      switch(type){
        case 1:
          this.AravotType1.amount++;
          break;
        case 2:
          this.AravotType2.amount++;
      }
    }

    RemoveAravot(type:number):void{
      switch(type){
        case 1:
          if(this.AravotType1.amount > 0)this.AravotType1.amount--;
          break;
        case 2:
          if(this.AravotType2.amount > 0)this.AravotType2.amount--;
      }
    }

    changeNumAravot(change:any,type:number) : void{
      if(change.target.value > 0){
        switch(type){
        case 1:
          this.AravotType1.amount = change.target.value;
          break;
        case 2:
          this.AravotType2.amount = change.target.value
      }
    }
      
    }

    GenerateSummary():void{
      this.dataSource = []
      if(this.AravotType1.amount > 0)
        this.dataSource.push(new SoldItem(this.AravotType1.name,this.AravotType1.amount,ARAVOT_PRICE));
      if(this.AravotType2.amount > 0)
        this.dataSource.push(new SoldItem(this.AravotType2.name,this.AravotType2.amount,ARAVOT_PRICE));
      this.stepper.next();
    }
}