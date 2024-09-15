import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableDataService } from '../table-data.service';
import { FormControl } from '@angular/forms';
import { merge, of as observableOf } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';


export interface ApiResponse {
  data: ResponseItem[];
  total: number;
}

export interface ResponseItem {
  avatar: string, id: number, first_name: string, last_name: string, email: string
}

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent implements OnInit, AfterViewInit {
  ngOnInit(): void { }

  displayedColumns: string[] = ['avatar', 'id', 'first_name', 'last_name', 'email'];
  data: ResponseItem[] = [];

  pageSizes = [5, 10, 20];

  totalCount = 0;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(public tableDataService: TableDataService, private spinner: NgxSpinnerService, private router: Router) { }

  searchKeywordFilter = new FormControl();

  ngAfterViewInit() {
    const cache = new Map<string, any>();
    merge(this.searchKeywordFilter.valueChanges.pipe(debounceTime(500)), this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          this.spinner.show();

          const searchTerm = this.searchKeywordFilter.value == null ? '' : this.searchKeywordFilter.value;
          const pageIndex = this.paginator.pageIndex + 1;
          const pageSize = this.paginator.pageSize;
          const cacheKey = `${searchTerm}:${pageIndex}:${pageSize}`;

          if (cache.has(cacheKey)) {
            const cachedData = cache.get(cacheKey);
            this.isLoading = false;
            this.spinner.hide();
            return observableOf(cachedData);
          }
          return this.tableDataService
            .fetchTableData(pageIndex, pageSize)
            .pipe(
              catchError(() => observableOf(null)),
              map((data) => {
                this.isLoading = false;
                this.spinner.hide();

                if (data === null) {
                  return [];
                }

                if (searchTerm) {
                  data['data'] = data.data.filter((item) => item.id === Number(searchTerm));
                }
                cache.set(cacheKey, data.data);

                this.totalCount = data.total;
                return data.data;
              })
            );
        })
      )
      .subscribe((data) => (this.data = data));
  }
  goToDetails(userId: number): void {
    this.router.navigate([`/user/${userId}`]);
  }
}




