import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule, MatIconModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule } from '@angular/material';
  
import { LoadingComponent } from './loading/loading.component';
import { SnackBarComponent } from './snack-bar/snack-bar.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule, MatIconModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  exports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule, MatIconModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule,
    SnackBarComponent,
    LoadingComponent
  ],
  declarations: [
    SnackBarComponent,
    LoadingComponent
  ],
  providers: [
    SnackBarComponent
  ]
})
export class SystemModule { }
