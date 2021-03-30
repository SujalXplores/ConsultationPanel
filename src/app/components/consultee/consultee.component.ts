import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment.prod';
import { ViewMoreComponent } from './view-more/view-more.component';

@Component({
  selector: 'app-consultee',
  templateUrl: './consultee.component.html',
  styleUrls: ['./consultee.component.scss']
})
export class ConsulteeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'c_type', 'country', 'c_dt', 'timeLeft', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private _http: HttpClient,
    private _dialog: MatDialog) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.getConsultee();
  }

  getConsultee(): void {
    this._http.get(environment.consultee_url).subscribe((obs: any[]) => {
      this.dataSource.data = obs;
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
