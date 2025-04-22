import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Invoice } from "./models/invoice.interfac";
import { InvoiceApiService } from "./api/invoice-api.service";


@Injectable({
    providedIn: "root"
})
export class InvoiceService {

   constructor(
    private http: InvoiceApiService
   ) { }

    getInvoice(): Observable<Invoice[]> {
        return this.http.getInvoice();    
    }

    postInvoice(body: any, options?: any): Observable<any> {
        return this.http.postInvoice(body, options);
    }

    putInvoice(id: string, body: Partial<Invoice>): Observable<Invoice> {
        return this.http.putInvoice(id, body);
    }

    deleteInvoice(id: string): Observable<any> {
        return this.http.deleteInvoice(id);
    }
}