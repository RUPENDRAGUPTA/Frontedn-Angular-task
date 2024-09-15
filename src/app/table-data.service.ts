import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs';
import { ApiResponse } from './custom-table/custom-table.component';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  BASH_URL ='https://reqres.in/api/users'
  constructor(private http: HttpClient) { }
  fetchTableData(
    page: number,
    limit_per_page: number
  ): Observable<ApiResponse> {
    const requestUrl = `${this.BASH_URL}?page=${page}&per_page=${limit_per_page}`
    return this.http.get<ApiResponse>(requestUrl);
  }

}
