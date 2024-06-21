import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserRequest } from '../../models/auth/user-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrlBase+'auth/'

  constructor() { }

  router=inject(Router);
  http=inject(HttpClient);

  login(user: UserRequest): Observable<UserRequest>{
    return this.http.post<UserRequest>(`${this.baseUrl}login`,user)
  }



}
