import { Injectable } from "@angular/core";
import { BaseHttpService } from "../../../shared/http/base-http.service";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Service } from "../models/bussines-service.interface";


@Injectable({
    providedIn: 'root'
})
export class BussinesApiService extends BaseHttpService {
    private readonly baseUrl = environment.apiUrl;

    constructor(http: HttpClient) {
        super(http)
    }

    getServices(): Observable<Service[]> {
        return this.get<Service[]>(`${this.baseUrl}/bussines-services`);
    }

    postService(body: Partial<Service>, options?: any): Observable<Service> {
        return this.post<Service>(`${this.baseUrl}/bussines-services`, body, options);
    }

    putService(id: string, body: Partial<Service>): Observable<Service> {
        return this.patch<Service>(`${this.baseUrl}/bussines-services`, id, body);
    }

    deleteService(id: any): Observable<any> {
        return this.delete(`${this.baseUrl}/bussines-services`, id)
    }

}
