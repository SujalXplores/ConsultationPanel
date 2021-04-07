import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { ViewMoreComponent } from './view-more/view-more.component';
import * as moment from 'moment';

@Component({
  selector: 'app-consultee',
  templateUrl: './consultee.component.html',
  styleUrls: ['./consultee.component.scss']
})
export class ConsulteeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'c_type', 'country', 'c_dt', 'timeLeft', 'actions'];
  dataSource = new MatTableDataSource<any>();
  private unsubscribe = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  startTime: any;
  endTime: any;
  isExist: boolean = false;
  obj: any = {}
  dueTime: any[] = [];
  currTime: any[] = [];
  timeLeft: any[] = [];
  constructor(
    private _http: HttpClient,
    private _dialog: MatDialog
  ) { 
    this.getConsultee();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this._http.get<any[]>(environment.consultee_track).pipe(takeUntil(this.unsubscribe)).subscribe(obs => {
      obs.forEach(element => {
        if(element.date == moment().format("L")) {
          this.isExist = true;
          this.obj = element;
        }
      });
    });
    this.startTime = moment().format("L HH:mm:ss");
  }

  ngOnDestroy(): void {
    this.endTime = moment().format("L HH:mm:ss");
    let secondsSpent = moment(this.endTime, "L HH:mm:ss").diff(moment(this.startTime, "L HH:mm:ss"));
    secondsSpent /= 1000;
    if(this.isExist) {
      this.obj.seconds += secondsSpent;
      this._http.put(environment.consultee_track + this.obj.id, this.obj).pipe(takeUntil(this.unsubscribe)).subscribe();
    }
    if(!this.isExist) {
      this.obj = {
        "date": moment().format("L"),
        "seconds": secondsSpent
      }
      this._http.post(environment.consultee_track, this.obj).pipe(takeUntil(this.unsubscribe)).subscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getConsultee(): void {
    this._http.get(environment.consultee_url).pipe(takeUntil(this.unsubscribe)).subscribe((obs: any[]) => {
      this.dataSource.data = obs;
      obs.forEach((element,i)=>{
        this.currTime.push(moment().format("H"));
        this.dueTime.push(moment(element.Consultation_DateTime).add(8, 'hour').format("H"));
        Number.parseInt(this.currTime[i]);
        Number.parseInt(this.dueTime[i]);        
        this.timeLeft.push(this.currTime[i] - this.dueTime[i]);
        let today = moment().format("YYYY-MM-DD HH:mm");
        this.dataSource.data[i].Time_Left = ((moment(today).diff(element.Consultation_DateTime) / 1000) > 86400) ? "Long time ago" : this.timeLeft[i];
      });
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openDialog(row: any): void {
    this._dialog.open(ViewMoreComponent, {
      data: row,
      disableClose: true
    });
  }
}
