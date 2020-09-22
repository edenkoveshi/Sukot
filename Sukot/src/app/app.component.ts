import { Component,OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Sukot';

  constructor(firedb: AngularFireDatabase) {
    let count:any;
    firedb.list('/').valueChanges().subscribe(i => {
      count = i[0];
      if(typeof(count) == 'number'){
        firedb.object('/').set({viewCount : <number>count+1});
      }
    });
    //itemRef.set({ name: 'new name!'});
  }

  ngOnInit(): void{
    
  }


  
}
