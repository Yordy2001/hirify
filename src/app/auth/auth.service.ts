import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  api = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private cookies:CookieService,

  ) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, { email, password }, { withCredentials: true });
  }

  setToken(token: string){
    this.cookies.set("token", token)
  }
}
