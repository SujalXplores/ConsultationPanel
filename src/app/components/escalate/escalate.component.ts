import { HttpClient } from '@angular/common/http';
import { Component, ModuleWithComponentFactories, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import * as moment from 'moment';

@Component({
  selector: 'app-escalate',
  templateUrl: './escalate.component.html',
  styleUrls: ['./escalate.component.scss']
})
export class EscalateComponent implements OnInit {
  displayedColumns: string[] = ['name', 'c_type', 'country', 'c_dt', 'timeLeft'];
  dataSource = new MatTableDataSource<any>();
  private unsubscribe = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  startTime
  endTime
  isExist: boolean = false;
  obj: any = {}
  constructor(private _http: HttpClient) {
    this.getEscalate();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this._http.get<any[]>('http://localhost:3000/escalate_track/').subscribe(o => {
      o.forEach(element => {
        if(element.date===moment().format("L")) {
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
      this._http.put('http://localhost:3000/escalate_track/' + this.obj.id, this.obj).subscribe();
    }
    if(!this.isExist) {
      this.obj = {
        "date": moment().format("L"),
        "seconds": secondsSpent
      }
      this._http.post('http://localhost:3000/escalate_track/', this.obj).subscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getEscalate(): void {
    this._http.get(environment.escalate_url).pipe(takeUntil(this.unsubscribe)).subscribe((obs: any[]) => {
      this.dataSource.data = obs;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
