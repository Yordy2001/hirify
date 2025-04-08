import { Injectable } from "@angular/core";
import { BaseHttpService } from "../../../shared/http/base-http.service";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Appointment } from "../models/appointment.model";

@Injectable({
    providedIn: 'root'
})
export class AppointmentApiService extends BaseHttpService {
    private readonly baseUrl = environment.apiUrl;

    constructor(http: HttpClient) {
        super(http);
    }

    getAppointments(): Observable<Appointment[]> {
        return this.get<Appointment[]>(`${this.baseUrl}/appointment`);
    }

    postAppointment(body: Partial<Appointment>, options?: any): Observable<Appointment> {
        return this.post<Appointment>(`${this.baseUrl}/appointment`, body, options);
    }

    putAppointment(id: string, body: Partial<Appointment>): Observable<Appointment> {
        return this.patch<Appointment>(`${this.baseUrl}/appointment`, id, body);
    }

    deleteAppointment(id: any): Observable<any> {
        return this.delete(`${this.baseUrl}/appointment`, id)
    }
}
