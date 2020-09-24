import { Component,OnInit } from '@angular/core';
import { DatabaseService } from './database.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Sukot';
  constructor(readonly db:DatabaseService) {
    this.db.incrementViewCount(); 
  }

  ngOnInit(): void{
    
  }


  
}
