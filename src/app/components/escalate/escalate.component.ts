import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

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

  ngOnInit(): void {}

  ngOnDestroy(): void {
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
