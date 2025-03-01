import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export abstract class BaseHttpService {
    constructor(protected http: HttpClient) { }

    protected get<T>(url: string, options?: any): Observable<T> {
        return this.http.get<T>(url, ...options);
    }

    protected post<T>(url: string, body: any, options?: any): Observable<T> {
        return this.http.post<T>(url, body, ...options);
    }

    protected put<T>(url: string, body: any, options?: any): Observable<T> {
        return this.http.put<T>(url, body, ...options);
    }

    protected delete<T>(url: string, options?: any): Observable<T> {
        return this.http.delete<T>(url, ...options);
    }

}
