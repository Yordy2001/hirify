import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Appointment } from "./models/appointment.model";
import { AppointmentApiService } from "./api/appointment-api.service";

@Injectable({
    providedIn: "root"
})
export class AppointmentService {
    constructor(
        private http: AppointmentApiService,
    ) { }

    get(): Observable<Appointment[]> {
        return this.http.getAppointments()
    }

    post(body: Appointment, options?: any): Observable<any> {
        return this.http.postAppointment(body, options);
    }

    put(id: string, body: Partial<Appointment>): Observable<Appointment> {
        return this.http.putAppointment(id, body)
    }

    delete(id: string) {
        return this.http.deleteAppointment(id);
    }
}