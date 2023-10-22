import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private spinnerServices : NgxSpinnerService) { }

  busy(){
    this.busyRequestCount++;
    this.spinnerServices.show(undefined,{
      type:'timer',
      bdColor:'rbg(255,255,255,0.7)',
      color:'#333333'
    })
  }

  idle(){
    this.busyRequestCount--;
    if(this.busyRequestCount <=0){
      this.busyRequestCount = 0;
      this.spinnerServices.hide();
    }
  }
}
