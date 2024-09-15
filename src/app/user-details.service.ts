import { Injectable } from '@angular/core';
import { ResponseItem } from './custom-table/custom-table.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
   BASH_URL ='https://reqres.in/api/users'
  constructor(private http: HttpClient) { }
  fetchUserDetails(
    userId:number
  ): Observable<ResponseItem> {
    const requestUrl = `${this.BASH_URL}?id=${userId}`
    return this.http.get<ResponseItem>(requestUrl);
  }
}
