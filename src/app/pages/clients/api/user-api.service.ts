import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../shared/http/base-http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends BaseHttpService {

  private readonly baseUrl = environment.apiUrl;

  constructor(http: HttpClient) {
    super(http);
  }

  getClients(): Observable<Client[]> {
    return this.get<Client[]>(`${this.baseUrl}/clients`);
  }

  postClient(body: Partial<Client>, options?: any): Observable<Client> {
    return this.post<Client>(`${this.baseUrl}/clients`, body, options);
  }

  putClient(id:string, body: Partial<Client>): Observable<Client> {
    return this.patch<Client>(`${this.baseUrl}/clients`, id, body);
  }

  deleteClient(id: any): Observable<any> {
    return this.delete(`${this.baseUrl}/clients`, id)
  }

}
