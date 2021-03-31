import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  constructor() { }
  et
  ngOnInit(): void {
    this.et = localStorage.getItem('et');
    this.et /= 1000;
    console.log(this.et);
  }
}