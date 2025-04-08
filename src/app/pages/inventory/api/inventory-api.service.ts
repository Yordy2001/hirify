import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { BaseHttpService } from "../../../shared/http/base-http.service";
import { environment } from "../../../../environments/environment";
import { Inventory } from "../models/inventory,model";

@Injectable({
    providedIn: 'root'
})
export class InvenotoryApiService extends BaseHttpService {
    private readonly baseUrl = environment.apiUrl;

    constructor(http: HttpClient) {
        super(http);
    }

    getInventory(): Observable<Inventory[]> {
        return this.get<Inventory[]>(`${this.baseUrl}/inventory`);
    }

    postInventory(body: Partial<Inventory>, options?: any): Observable<Inventory> {
        return this.post<Inventory>(`${this.baseUrl}/inventory`, body, options);
    }

    putInventory(id: string, body: Partial<Inventory>): Observable<Inventory> {
        return this.patch<Inventory>(`${this.baseUrl}/inventory`, id, body);
    }

    deleteInventory(id: any): Observable<any> {
        return this.delete(`${this.baseUrl}/inventory`, id)
    }
}
