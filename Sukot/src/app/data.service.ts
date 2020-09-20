import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';

export class MinimSet{
  kashrut:string;
  Ethrog:string;
  Lulav:string;
  Hadas:string;
  amount:number;

  constructor(amount:number){
    this.amount = amount;
    this.kashrut = "";
    this.Ethrog = "";
    this.Lulav = "";
    this.Hadas = "";
  }

  setKashrut(kashrut:string):void{
    this.kashrut = kashrut;
  }

  setAmount(amount:number):void{
    this.amount = amount;
  }

  setEthrog(Ethrog: string):void{
    this.Ethrog = Ethrog
  }

  setLulav(Lulav: string):void{
    this.Lulav = Lulav
  }

  setHadas(Hadas : string):void{
    this.Hadas = Hadas
  }

}


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private sets:MinimSet[];
  setsBehaviorSubject:BehaviorSubject<MinimSet[]>;
  setsObservable:Observable<MinimSet[]>;

  constructor() { 
    this.sets = [];
    this.setsBehaviorSubject = new BehaviorSubject(this.sets);
    this.setsObservable = this.setsBehaviorSubject.asObservable();
  }

  newSet(amount:number):number{
    this.sets.push(new MinimSet(amount));
    console.log(this.sets)
    return this.sets.length - 1;
  }

  editAmount(index:number,amount:number):void{
    if(this.sets.length < index || index < 0) return
    if(amount != undefined){ this.sets[index].setAmount(amount) }
  }

  editKashrut(index:number,kashrut:string):void{
    if(this.sets.length < index || index < 0) return
    if(kashrut != undefined){ this.sets[index].setKashrut(kashrut) }
  }

  editEthrog(index:number,ethrog:string):void{
    if(this.sets.length < index || index < 0) return
    if(ethrog != undefined){ this.sets[index].setEthrog(ethrog) }
  }

  editLulav(index:number,lulav: string):void{
    if(this.sets.length < index || index < 0) return
    if(lulav != undefined){ this.sets[index].setLulav(lulav) }
  }

  editHadas(index:number,hadas: string):void{
    if(this.sets.length < index || index < 0) return
    if(hadas != undefined){ this.sets[index].setHadas(hadas) }
  }

}
