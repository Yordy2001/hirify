import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export abstract class BaseHttpService {
    constructor(protected http: HttpClient) { }

    protected get<T>(url: string, options?: any): Observable<T> {
        return this.http.get<T>(url);
    }

    protected post<T>(url: string, body: any, options?: any): Observable<T> {
        return this.http.post<T>(url, body, ...options);
    }

    protected patch<T>(url: string, id: string, body: any): Observable<T> {
        return this.http.patch<T>(url + '/' + id, body);
    }

    protected delete<T>(url: string, id: string): Observable<T> {
        return this.http.delete<T>(url + '/' + id);
    }
}
