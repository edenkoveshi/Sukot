import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Angular material imports
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon'

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './dialog/dialog.component';
import { MenuComponent,MenuDialog } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    MenuComponent,
    MenuDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents : [MenuComponent,MenuDialog]
})
export class AppModule { }
