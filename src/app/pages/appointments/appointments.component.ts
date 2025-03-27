import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, debounceTime, map } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddButtonComponent } from "../../shared/components/buttons/add-button/add-button.component";
import { ModalComponent } from "../../shared/components/modal/modal.component";
import { ClientsService } from '../clients/clients.service';
import { BussinesService } from '../services/bussines-service.service';
import { futureDateValidator, pmTimeValidator } from '../../shared/helpers/dateValidator';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-appointments',
  imports: [
    CommonModule, FullCalendarModule, AddButtonComponent, ModalComponent,
    MatFormFieldModule, MatSelectModule, MatOptionModule, MatDatepickerModule,
    MatAutocompleteModule, ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {

  page = 'Reservas';
  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('eventDetailTemplate') eventDetailTemplate!: TemplateRef<any>;
  appointmentForm!: FormGroup;
  filteredClients$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  clients: any[] = [];
  services: any[] = [];
  appointments: any[] = [];
  editingAppointment: boolean = false;
  today = new Date().toISOString().split('T')[0];
  selectedEvent: any = null;
  
  calendarOptions: CalendarOptions = {
    selectable: true,
    height: 600,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      right: 'prev,next today',
      center: 'title',
      left: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    dateClick: (info) => this.onDateClick(info),
  };

  constructor(
    private fb: FormBuilder,
    private clientService: ClientsService,
    private bussinesService: BussinesService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadClients();
    this.loadServices();
  }

  private initForm() {
    this.appointmentForm = this.fb.group({
      client: ['', Validators.required],
      services: [[], Validators.required],
      date: ['', Validators.required, futureDateValidator.bind(this)],
      time: ['', Validators.required],
    });

    // Filtrar clientes en tiempo real
    this.appointmentForm.get('client')!.valueChanges.pipe(
      debounceTime(300),
      map(value => this.filterClients(value))
    ).subscribe(filtered => this.filteredClients$.next(filtered));
  }

  private loadClients() {
    this.clientService.get().subscribe(clients => {
      this.clients = clients;
      this.filteredClients$.next(clients);
    });
  }

  private loadServices() {
    this.bussinesService.get().subscribe(services => {
      this.services = services;
    });
  }

  filterClients(searchText: string): any[] {
    if (!searchText) return this.clients;
    const filterValue = searchText.toLowerCase();
    return this.clients.filter(client =>
      client.whatsapp.toLowerCase().includes(filterValue) ||
      client.name.toLowerCase().includes(filterValue)
    );
  }

  submit() {
    if (this.appointmentForm.invalid) return;
    console.log('Formulario enviado:', this.appointmentForm.value);
    // !todo: Llamar servicio para crear la cita en el backend

    const formData = this.appointmentForm.value;

    // Crear nuevo evento para el calendario
    const newAppointment = {
      title: this.getClientName(formData.client) + ' - ' + this.getServiceNames(formData.services),
      start: formData.date + 'T' + formData.time,
      allDay: false
    };

    // Agregar al listado de citas
    this.appointments.push(newAppointment);

    // Actualizar eventos en el calendario
    this.calendarOptions = { ...this.calendarOptions, events: [...this.appointments] };

    this.modal.close();
  }

  private onDateClick(info: any) {
    // this.selectedEvent = info.event.extendedProps;
    console.log(info);
    
    this.modal.open('Detalles de la Cita', this.eventDetailTemplate);
  }

  private getClientName(clientId: string): string {
    
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente desconocido';
  }

  private getServiceNames(serviceIds: string[]): string {
    return this.services
      .filter(service => serviceIds.includes(service.id))
      .map(service => service.name)
      .join(', ');
  }

  openFormModal(template: TemplateRef<any>) {
    this.modal.open('Agregar cita', template);
  }

  trackByClient(index: number, client: any) {
    return client.id;
  }

  trackByService(index: number, service: any) {
    return service.id;
  }
}
