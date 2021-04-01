import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private unsubscribe = new Subject();
  escalate_time: number = 0;
  consultee_time: number = 0;
  total_time: number = 0;
  consulteeChart = [];
  escalateChart = [];
  consultee_labels = [];
  consultee_seconds = [];
  escalate_labels = [];
  escalate_seconds = [];

  constructor(private _http: HttpClient) {
    this._http.get<any[]>(environment.escalate_track).pipe(takeUntil(this.unsubscribe)).subscribe(o => {
      o.forEach(element => {
        this.escalate_labels.push(element.date);
        this.escalate_seconds.push(element.seconds);
        if (element.date === moment().format("L")) {
          this.escalate_time = element.seconds;
          this.total_time += element.seconds;
        }
      });
      this.escalate_labels.splice(0, this.escalate_labels.length - 5);
      this.escalate_seconds.splice(0, this.escalate_seconds.length - 5);
      this.consulteeChart = new Chart('escalateChart', {
        type: 'line',
        data: {
          labels: this.escalate_labels,
          datasets: [{
            label: 'Seconds',
            data: this.escalate_seconds,
            fill: true,
            lineTension: 0.2,
            borderColor: "blue",
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            xAxis: [{
              ticks: {
                autoSkip: true,
                maxTicksLimit: 5
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
    this._http.get<any[]>(environment.consultee_track).pipe(takeUntil(this.unsubscribe)).subscribe(o => {
      o.forEach(element => {
        this.consultee_labels.push(element.date);
        this.consultee_seconds.push(element.seconds);
        if (element.date === moment().format("L")) {
          this.consultee_time = element.seconds;
          this.total_time += element.seconds;
        }
      });
      this.consultee_labels.splice(0, this.consultee_labels.length - 5);
      this.consultee_seconds.splice(0, this.consultee_seconds.length - 5);
      this.escalateChart = new Chart('consulteeChart', {
        type: 'line',
        data: {
          labels: this.consultee_labels,
          datasets: [{
            label: 'Seconds',
            data: this.consultee_seconds,
            fill: true,
            lineTension: 0.2,
            borderColor: "green",
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            xAxis: [{
              ticks: {
                autoSkip: true,
                maxTicksLimit: 5
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}