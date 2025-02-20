import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";

import { environment } from '../../environments/environment';
import { RegisterTenantDto } from '../dto/tenant.inteface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  api = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private cookies: CookieService,

  ) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, { email, password }, { withCredentials: true });
  }

  register(registerTenantDto: RegisterTenantDto): Observable<any> {
    console.log(registerTenantDto);
    
    return this.http.post(`${this.api}/tenant`, registerTenantDto, { withCredentials: true });
  }

  setToken(token: string) {
    this.cookies.set("token", token)
  }
}
