import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormControl , Validators} from '@angular/forms';
import { ViewChild } from '@angular/core'
import db from '../../assets/db.json';
import { DataService, MinimSet } from '../data.service'
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';

import '../../assets/smtp.js'
import smtp_settings from '../../assets/smtp_settings.json';
declare let Email: any;

const ARAVOT_PRICE:number = 5;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isMobile: boolean;

  constructor(public dialog: MatDialog,private dataService:DataService) {
    
  }

  openDialog() {
    const dialogRef = this.dialog.open(MenuDialog,{
      height: '100vw',
      width: '100vw',
      maxWidth: this.isMobile ? '100vw' : '80vw',
   });

    dialogRef.afterClosed().subscribe(result => {
      this.dataService.clearSets();
      console.log(`Dialog result: ${result}`);
    });

    this.dataService.closeDialogObservable.subscribe(flag => {
      if(flag){
        dialogRef.close();
        this.dataService.setDialogClose(false);
      }
    });
  }

  ngOnInit(): void {
    let mobileRE = new RegExp("Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile");
    this.isMobile = mobileRE.test(window.navigator.userAgent)
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

export class ContactDetails{
  firstName: string;
  lastName: string;
  city: string;
  street: string;
  houseNo: number;
  buildingEntrance: string;
  aptNo: number;
  phoneNo:number;
  comment: string;
  inviter:string;

  constructor(){
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
  contactDetails:ContactDetails;
  processing: boolean;
  isMobile: boolean;

    constructor(private dataService:DataService,private _snackBar: MatSnackBar,
      private http: HttpClient){
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
        name:"קוישיקלעך",
        amount:0
      }
      this.dataSource = [];
      this.positiveValue = new FormControl("", [Validators.min(0)])
      this.parsedSets = [];
      this.contactDetails = new ContactDetails();
      this.processing = false;

      let mobileRE = new RegExp("Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile");
      this.isMobile = mobileRE.test(window.navigator.userAgent)
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
      if(set.Ethrog == ""){
        this._snackBar.open("עליך לבחור אתרוג", "אישור", {
          duration: 1000,
        });
        return null;
      }
      if(set.Lulav == ""){
        this._snackBar.open("עליך לבחור לולב", "אישור", {
          duration: 1000,
        });
        return null;
      }
      if(set.Hadas == ""){
        this._snackBar.open("עליך לבחור הדס", "אישור", {
          duration: 1000,
        });
        return null;
      }
      
      if(temp){
        let name:string = temp[1];
        let price:number = temp[0];
        result.push(new SoldItem(name,set.amount,price));
        result.push(new SoldItem(set.Ethrog,set.amount,0));
        result.push(new SoldItem(set.Lulav,set.amount,0));
        result.push(new SoldItem(set.Hadas,set.amount,0));
        return result;
      }
      this._snackBar.open("עליך לבחור כשרות", "אישור", {
        duration: 1000,
      });
      return null;
    }

    CalculateAllSetCosts():void{
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
          return;
        }
      }
      this.stepper.next();
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

    getTotalCost():number{
      return this.dataSource.map(t=>t.totalPrice).reduce((acc, value) => acc + value, 0);
    }

    changeContactDetails(change:any,field:string):void{
      let val = change.target.value;
      this.contactDetails[field] = val;
    }

    testExact(str:string,regex:string):boolean{
        let match = str.match(regex);
        return match != null && str === match[0];
    }

    validateContactDetails():string{
      const HebrewStringRegex = "[א-ת ']+";
      const NumberRegex = "[0-9]+";
      const PhoneRegex = "(05[0-9]{8})|(0[0-9]{8})";
        if(this.contactDetails.firstName == undefined || this.contactDetails.lastName == undefined 
          || this.contactDetails.city == undefined || this.contactDetails.street == undefined 
          || this.contactDetails.houseNo == undefined || this.contactDetails.aptNo == undefined 
          || this.contactDetails.phoneNo == undefined) return "עליך למלא את כל הפרטים";
        
        if(!this.testExact(this.contactDetails.firstName,HebrewStringRegex)) return "שם פרטי שגוי";
        if(!this.testExact(this.contactDetails.lastName,HebrewStringRegex)) return "שם משפחה שגוי";
        if(!this.testExact(this.contactDetails.city,HebrewStringRegex)) return "עיר שגויה";
        if(!this.testExact(this.contactDetails.street,HebrewStringRegex)) return "רחוב שגוי";
        if(!this.testExact(this.contactDetails.houseNo.toString(),NumberRegex)) return "מס' בית שגוי";
        if(!this.testExact(this.contactDetails.aptNo.toString(),NumberRegex)) return "מס' דירה שגוי";
        if(!this.testExact(this.contactDetails.phoneNo.toString(),PhoneRegex)) return "מס' טלפון שגוי";

        return null;
    };

    async sendMailWithContactDetails():Promise<any>{
      this.processing = true;
      let msg:string = this.validateContactDetails()
      if(msg){
        this.processing = false;
        this._snackBar.open(msg, "אישור", {
          duration: 1000,
        });
        return;
      };

      this.stepper.next();

      let body:string = "פרטי המזמין:<br>"
      + "שם: " + this.contactDetails.firstName + " " + this.contactDetails.lastName + "<br>"
      + "כתובת: " + this.contactDetails.street + " " + this.contactDetails.houseNo + " "
      + (this.contactDetails.buildingEntrance != undefined ? ("כניסה " + this.contactDetails.buildingEntrance) : "")
      + ",דירה " + this.contactDetails.aptNo  + " ," + this.contactDetails.city + "<br>" 
      + "מספר טלפון: " + this.contactDetails.phoneNo + "<br>" + 
      (this.contactDetails.comment != undefined ? "הערות נוספות: " + this.contactDetails.comment + "<br>" : "") +
      (this.contactDetails.inviter != undefined ? "הוזמן לאתר על ידי: " + this.contactDetails.inviter + "<br>" : "");

      for(let data of this.dataSource){
        body += data.item + "*" + data.amount + " - " + data.totalPrice + "שח" + "<br>";
      }

      body += "סהכ:   " + this.getTotalCost();

        Email.send({
            Host : smtp_settings.server,
            Username : smtp_settings.username,
            Password : smtp_settings.password,
            To : smtp_settings.targetAddress,
            From : smtp_settings.username,
            Subject : "הזמנה חדשה - " + this.contactDetails.firstName + " " + this.contactDetails.lastName,
            Body : body,
            }).then( (message) => {
              console.log(message);
              if(message != "OK"){
                this._snackBar.open("אירעה שגיאה. אנא נסו שוב מאוחר יותר.", "", {
                  duration: 10000,
                  direction: 'rtl'
                });
              }
              else{
                this._snackBar.open("ההזמנה בוצעה בהצלחה. שליח שלנו יצור איתך קשר בימים הקרובים. תודה רבה וחג שמח!", "", {
                  duration: 10000,
                  direction: 'rtl'
                });
                
              }
              this.processing = false;
              this.dataService.setDialogClose(true);
            });
        
    }

}