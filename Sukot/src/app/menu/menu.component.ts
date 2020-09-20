import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import {FormControl , Validators} from '@angular/forms';
import { ViewChild } from '@angular/core'
import db from '../../assets/db.json';
import { DataService, MinimSet } from '../data.service'
import { resourceUsage } from 'process';

const ARAVOT_PRICE:number = 5;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(MenuDialog,{
      height: '100%'
   });

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
  allSets:MinimSet[];
  parsedSets:SoldItem[];


    constructor(private dataService:DataService){
      this.dataService.setsObservable.subscribe(sets => {
        this.allSets = sets;
      })
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
      this.parsedSets = [];
    }

    AddSet():void{
      this.setsArr.push(1);
    }

    AddAravot(type:number):void{
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

    GetSetCostAndName(kashrut: string):[number,string]{
      let name:string = "";
      let price:number = 0;

      function FilterByKashrut(kashrut:string):(element:any)=>boolean{
        return function(element:any):boolean{
          return element.type == kashrut;
        }
      }

      let res = db.KashrutTypes.filter(FilterByKashrut(kashrut))[0]
      if(res){
        name = "סט "+res.type;
        price = res.price;
        return [price,name];
      }
      return null;
    }

    CalculateSetCost(set: MinimSet):SoldItem[]{
      let result:SoldItem[] = []; //Should have 4 elements
      let temp:[number,string] = this.GetSetCostAndName(set.kashrut);
      if(set.Ethrog=="" || set.Lulav == "" || set.Hadas == "") return null;
      if(temp){
        let name:string = temp[1];
        let price:number = temp[0];
        result.push(new SoldItem(name,set.amount,price));
        result.push(new SoldItem(set.Ethrog,set.amount,0));
        result.push(new SoldItem(set.Lulav,set.amount,0));
        result.push(new SoldItem(set.Hadas,set.amount,0));
        return result;
      }
      return null;
    }

    CalculateAllSetCosts():boolean{
      this.parsedSets = [];
      for(let set of this.allSets){
        let items = this.CalculateSetCost(set);
        if(items){
          for(let item of items){
            this.parsedSets.push(item);
          }
        }
        else{
          console.log("failed calculating set");
          return false;
        }
      }
      this.stepper.next();
      return true;
    }

    GenerateSummary():boolean{
      this.dataSource = []
      for(let set of this.parsedSets){this.dataSource.push(set)};
      if(this.AravotType1.amount > 0)
        this.dataSource.push(new SoldItem(this.AravotType1.name,this.AravotType1.amount,ARAVOT_PRICE));
      if(this.AravotType2.amount > 0)
        this.dataSource.push(new SoldItem(this.AravotType2.name,this.AravotType2.amount,ARAVOT_PRICE));
      this.stepper.next();
      return true;
    }
}