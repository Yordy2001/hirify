import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { AppointmentService } from './appointment.service';
import { ClientsService } from '../clients/clients.service';
import { BussinesService } from '../services/bussines-service.service';
import { Appointment } from './models/appointment.model';
import { Client } from '../clients/models/client.model';
import { Service } from '../services/models/bussines-service.interface';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AddButtonComponent } from "../../shared/components/buttons/add-button/add-button.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../shared/components/snack-bar/snack-bar.service';

@Component({
  standalone: true,
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  imports: [CommonModule, AddButtonComponent, MatIconModule, MatTableModule, MatButtonModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatStepperModule, MatCardModule, ModalComponent],
})
export class AppointmentsComponent implements OnInit {
  page = 'Reservas';
  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('stepper') stepper!: MatStepper;

  displayedColumns: string[] = ['id', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<Appointment>();

  firstFormGroup!: FormGroup;
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClients: Client[] = [];
  services: Service[] = [];
  selectedServices: any[] = [];
  editingAppointment: Appointment | null = null;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private clientService: ClientsService,
    private businessService: BussinesService,
    private snackbarService: SnackBarService,
  ) { }

  ngOnInit() {
    this.getAppointments();
    this.initForm();
    this.loadClients();
    this.loadServices();
  }

  private initForm() {
    this.firstFormGroup = this.fb.group({
      date: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  private loadClients() {
    this.clientService.get().subscribe(clients => {
      this.clients = clients;
      this.filteredClients = [...clients];
    });
  }

  private loadServices() {
    this.businessService.get().subscribe(services => {
      this.services = services;
    });
  }

  getAppointments() {
    this.appointmentService.get().subscribe((appointments: any) => {
      this.dataSource.data = appointments.data;
    });
  }

  deleteAppointment(appointmentId: string) {
    if (!appointmentId) return;

    this.appointmentService.delete(appointmentId).subscribe({
      next: () => {
        this.snackbarService.showSnackbar('Cita eliminada con éxito', 'success');
        this.getAppointments();
      },
      error: (error) => {
        console.error('Error deleting appointment:', error);
        this.snackbarService.showSnackbar('Error eliminando cita', 'error');
      }
    });
  }

  submit() {
    if (this.firstFormGroup.invalid) return;

    const appointmentData = {
      ...this.firstFormGroup.value,
      clientId: this.selectedClients.map(client => client.id),
      serviceId: this.selectedServices.map(service => service.id)
    };

    // If editing an appointment, update it instead of creating a new one
    if (this.editingAppointment) {
      this.appointmentService.put(this.editingAppointment.id, appointmentData).subscribe(() => {
        this.getAppointments();
        this.firstFormGroup.reset()
      });
      return
    }
    return this.postData(appointmentData);
  }

  // !todo: add alert after update one
   // !todo: fill the form with the selected appointment data
  updateDate(event: any) {
    const date = new Date(event.value).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
    this.firstFormGroup.patchValue({ date });
  }

  postData(appointmentData: any) {
  
    if (this.firstFormGroup.invalid) return;

    this.appointmentService.post(appointmentData, '').subscribe({
      next: () => {
        this.modal.close();
        this.snackbarService.showSnackbar('Cita creada con éxito', 'success');
        this.getAppointments();
        this.firstFormGroup.reset();
        this.selectedClients = [];
        this.selectedServices = [];
      },
      error: (error) => {
        this.modal.close();
        console.error('Error creating appointment:', error);
        this.snackbarService.showSnackbar('Error creando Appointmen', 'error');
      },
    });

  }

  openFormModal(template: TemplateRef<any>, appointment?: Appointment) {
    if(appointment){   
      this.firstFormGroup.patchValue({
        date: new Date(appointment.date).getDate(),
        status: appointment.status
      });
      // this.selectedClients = this.clients.filter(client => appointment.clientId.includes(client.id));
      // this.selectedServices = this.services.filter(service => appointment.servicesId.includes(service.id));
    }
  
    this.editingAppointment = appointment || null;
    this.modal.open(appointment ? 'Editar cita' : 'Agregar cita', template);
  }

  filterClients(query: any) {
    this.filteredClients = this.clients.filter(client => client.whatsapp.includes(query?.value));
  }

  filterServices(query: any) {
    this.services = this.services.filter(service => service.name.toLowerCase().includes(query?.value.toLowerCase()));
  }

  toggleClientSelection(client: Client) {
    const index = this.selectedClients.findIndex(c => c.id === client.id);
    index === -1 ? this.selectedClients.push(client) : this.selectedClients.splice(index, 1);
  }

  toggleServiceSelection(service: Service) {
    const index = this.selectedServices.findIndex(s => s.id === service.id);
    index === -1 ? this.selectedServices.push(service) : this.selectedServices.splice(index, 1);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
