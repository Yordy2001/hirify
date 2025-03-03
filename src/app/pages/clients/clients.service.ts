import { Injectable } from '@angular/core';
import { UserApiService } from './api/user-api.service';
import { Observable } from 'rxjs';
import { Client } from './models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(
    private http: UserApiService
  ) { }

  get(): Observable<Client[]> {
    return this.http.getClients();
  }

  post(body: Client, options?: any): Observable<any> {
    return this.http.postClient(body, options);
  }

  put(body: Partial<Client>, options?: any): Observable<Client> {
    return this.http.putClient(body, options)
  }

  delete(options?: any) {
    return this.http.deleteClient(options);
  }
}
