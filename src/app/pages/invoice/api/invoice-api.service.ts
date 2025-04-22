import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { BaseHttpService } from "../../../shared/http/base-http.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class InvoiceApiService  extends BaseHttpService {
    private readonly baseUrl = environment.apiUrl + "/invoice";

    constructor(http: HttpClient) {
        super(http);
    }

    getInvoice(): Observable<any> {
        return this.get(this.baseUrl)
    }

    postInvoice(body: any, options?: any): Observable<any> {
        return this.post(this.baseUrl, body, options);
    }

    putInvoice(id: string, body: any): Observable<any> {
        return this.patch(this.baseUrl, id, body);
    }

    deleteInvoice(id: any): Observable<any> {
        return this.delete(this.baseUrl, id);
    }
}
