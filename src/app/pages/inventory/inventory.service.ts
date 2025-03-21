import { Injectable } from "@angular/core";
import { InvenotoryApiService } from "./api/inventory-api.service";
import { Observable } from "rxjs";
import { Inventory } from "./models/inventory,model";


@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    constructor(
        private http: InvenotoryApiService
    ) { }

    get() {
        return this.http.getInventory();
    }

    post(body: Inventory, options?: any): Observable<any> {
        return this.http.postInventory(body, options);
    }

    put(id: string, body: Partial<Inventory>): Observable<Inventory> {
        return this.http.putInventory(id, body)
    }

    delete(id: string) {
        return this.http.deleteInventory(id);
    }
}