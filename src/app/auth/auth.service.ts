import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";

import { environment } from '../../environments/environment';
import { RegisterTenantDto } from './dto/tenant.inteface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  api = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,

  ) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, { email, password }, { withCredentials: true });
  }

  register(registerTenantDto: RegisterTenantDto): Observable<any> {
    console.log(registerTenantDto);
    
    return this.http.post(`${this.api}/tenant`, registerTenantDto, { withCredentials: true });
  }

  isAutenticated(){
    return this.cookieService.check('token')
  }

  setToken(token: string) {
    this.cookieService.set("token", token)
  }

  logOut(){
    this.cookieService.delete('token');
    window.location.href = '/login';
  }

}
