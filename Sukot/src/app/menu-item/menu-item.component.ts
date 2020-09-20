import { Component, OnInit } from '@angular/core';
import db from '../../assets/db.json';
import {DataService} from '../data.service'

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  db = db;
  amount: number;
  kashrut:string;
  selectedEthrog:string;
  selectedLulav:string;
  selectedHadas:string;
  setIndex: number;

  constructor(private dataService:DataService) { 
    this.kashrut = "";
    this.selectedEthrog = "";
    this.selectedHadas = "";
    this.selectedLulav = "";
    this.amount = 1;
    this.setIndex = this.dataService.newSet(this.amount);
  }

  ngOnInit(): void {
  }

  selectKashrut(change:any) : void{
    this.kashrut = change.value;
    this.dataService.editKashrut(this.setIndex,this.kashrut);
  }

  selectEthrog(val:string) : void{
    this.selectedEthrog = val;
    this.dataService.editEthrog(this.setIndex,this.selectedEthrog);
  }

  selectHadas(val:string) : void{
    this.selectedHadas = val;
    this.dataService.editHadas(this.setIndex,this.selectedHadas)
  }

  selectLulav(val:string) : void{
    this.selectedLulav = val;
    this.dataService.editLulav(this.setIndex,this.selectedLulav)
  }

  radioEvent(change: any){
    let val:string = change.value;
    let type:string = val.split(':')[0];
    val = val.split(':')[1];
    if(type === "אתרוג"){this.selectEthrog(val)}
    else if(type === "לולב"){this.selectLulav(val)}
    else if(type === "הדס"){this.selectHadas(val)}
  }

  changeAmount(change:any) : void{
    this.amount = change.target.value;
    this.dataService.editAmount(this.setIndex,this.amount);
  }


  AddSet():void{
    this.amount++;
    this.dataService.editAmount(this.setIndex,this.amount);
  }

  RemoveSet():void{
    if(this.amount > 1){
      this.amount--;
      this.dataService.editAmount(this.setIndex,this.amount);
    }
  }

  
}
