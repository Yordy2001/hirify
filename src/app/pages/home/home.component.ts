import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from "../../shared/components/calendar/calendar.component";
import  dayGridPlugin from '@fullcalendar/daygrid';
import { CommonModule } from '@angular/common';
import { ClientsService } from '../clients/clients.service';
import { AppointmentService } from '../appointments/appointment.service';
import { BussinesService } from '../services/bussines-service.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule , CalendarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  calendarPlugins = [dayGridPlugin];
  totalClients: number = 0;
  totalAppointments: number = 0;
  totalServices: number = 0;
  totalAppointmentsToday: number = 0;

  constructor(
    private _clientsService: ClientsService,
    private __appointmentService: AppointmentService,
    private __servicesService: BussinesService,
  ) {}

  ngOnInit(): void {
    this.getTotalClients();
    this.getTotalAppointments();
    this.getTotalServices();
  }

  getTotalClients() {
    this._clientsService.get().subscribe((res) => {
      this.totalClients = res.length;
    });
  }

  getTotalAppointments() {
    this.__appointmentService.get().subscribe((res: any) => {
      this.totalAppointments = res.data.length;
    });
  }

  getTotalServices() {
    this.__servicesService.get().subscribe((res) => {
      this.totalServices = res.length;
    });
  }
}
