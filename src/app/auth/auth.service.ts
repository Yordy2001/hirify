import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";
import { jwtDecode } from 'jwt-decode';

import { environment } from '../../environments/environment';
import { RegisterTenantDto } from './dto/tenant.inteface';
import { SubdomainService } from '../shared/services/subdomain.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  api = environment.apiUrl;
  private readonly tokenKey = 'token'
  private readonly userSubject = new BehaviorSubject<any>(null)

  // Observable expuesto para los componentes
  readonly user$ = this.userSubject.asObservable()
  
  constructor(
    private http: HttpClient,
    private readonly cookieService: CookieService,
    private readonly subDomainService: SubdomainService
  ) { }

  login(email: string, password: string): Observable<any> {
    const subdomain = this.subDomainService.getSubdomain()
    
    return this.http.post(`${this.api}/auth/login`,
      { email, password },
      { headers: { 'X-Tenant-Subdomain': subdomain || '' }, withCredentials: true });
  }

  register(registerTenantDto: RegisterTenantDto): Observable<any> {
    return this.http.post(`${this.api}/tenant`, registerTenantDto, { withCredentials: true });
  }

  isAutenticated() {
    return this.cookieService.check('token')
  }

  setToken(token: string) { 
    this.cookieService.set(this.tokenKey, token);
    this.decodeAndSetUser(token);
  }

  decodeAndSetUser(token?: string): void {
    const jwt = token || this.cookieService.get(this.tokenKey);
    if (!jwt) return;

    try {
      const user = jwtDecode<any>(jwt);
      this.userSubject.next(user);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  getCurrentUser(): any | null {
    return this.userSubject.value;
  }

  logOut() {
    this.cookieService.delete('token');
    this.userSubject.next(null);
    window.location.href = '/login';
  }
}

