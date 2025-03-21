import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Service } from "./models/bussines-service.interface";
import { BussinesApiService } from "./api/bussines-api.service";

@Injectable({
    providedIn: 'root'
})
export class BussinesService {
    constructor(private http: BussinesApiService) {

    }

    get(): Observable<Service[]> {
        return this.http.getServices();
    }

    post(body: Service, options?: any): Observable<any> {
        return this.http.postService(body, options);
    }

    put(id: string, body: Partial<Service>) {
        return this.http.putService(id, body);
    }

    delete(id: string) {
        return this.http.deleteService(id);
    }
}
