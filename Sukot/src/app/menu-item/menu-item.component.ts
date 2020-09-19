import { Component, OnInit } from '@angular/core';
import db from '../../assets/db.json';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  db = db;
  numSets: number;
  kashrut:string;
  selectedEthrog:string;
  selectedLulav:string;
  selectedHadas:string;

  constructor() { 
    this.kashrut = "";
    this.selectedEthrog = "";
    this.selectedHadas = "";
    this.selectedLulav = "";
    this.numSets = 1;
  }

  ngOnInit(): void {
  }

  selectKashrut(change:any) : void{
    this.kashrut = change.value;
  }

  selectEthrog(val:string) : void{
    this.selectedEthrog = val;
  }

  selectHadas(val:string) : void{
    this.selectedHadas = val;
  }

  selectLulav(val:string) : void{
    this.selectedLulav = val;
  }

  radioEvent(change: any){
    let val:string = change.value;
    let type:string = val.split(':')[0];
    val = val.split(':')[1];
    if(type === "אתרוג"){this.selectEthrog(val)}
    else if(type === "לולב"){this.selectLulav(val)}
    else if(type === "הדס"){this.selectHadas(val)}
  }

  changeNumSets(change:any) : void{
    this.numSets = change.target.value;
  }


  AddSet():void{
    this.numSets++;
  }

  RemoveSet():void{
    if(this.numSets > 1)this.numSets--;
  }

  
}
