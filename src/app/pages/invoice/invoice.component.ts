import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientsService } from '../clients/clients.service';
import { map, Observable, of, startWith } from 'rxjs';

import { AddButtonComponent } from '../../shared/components/buttons/add-button/add-button.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InvoiceService } from './invoice.service';
import { BussinesService } from '../services/bussines-service.service';
import { SnackBarService } from '../../shared/components/snack-bar/snack-bar.service';
import { AuthService } from '../../auth/auth.service';


@Component({
  standalone: true,
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatAutocompleteModule
  ],
})
export class InvoiceComponent implements OnInit, OnChanges {
  facturaForm!: FormGroup;
  invoiceItems: any[] = [];
  total = 0;
  cambio = 0;
  employ$: any = ''; // Placeholder for the employee name
  invoiceNumber = 'INV-123456';
  clients: { name: string; phone: string }[] = [];
  serviciosDisponibles: { id: any; name: string; price: number }[] = [];
  filteredClients$!: Observable<{ name: string; phone: string }[]>;
  filteredServicios$!: Observable<{ name: string; price: number }[]>;
  selectedClient?: { name: string; phone: string };

  constructor(
    private fb: FormBuilder,
    private clienteService: ClientsService,
    private invoiceService: InvoiceService,
    private servicesService: BussinesService,
    private snackbarService: SnackBarService,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.decodeAndSetUser(); // Placeholder for the employee name
    this.authService.user$.subscribe((user) => {
      this.employ$ = user.name || 'Empleado';
    });
    this.loadClients();
    this.loadServices();
    this.initForm();
    this.handlePagoChange();
    this.setupClientAutocomplete();
    this.setupServicioAutocomplete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateTotal();
    this.updateCambio();
  }

  private initForm(): void {
    this.facturaForm = this.fb.group({
      client: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      employ: [{ value: this.employ$, disabled: true }],
      date: [{ value: new Date().toLocaleDateString(), disabled: true }],
      servicio: ['',],
      payment_method: ['efectivo', Validators.required],
      pago: [, [Validators.required, Validators.min(this.total)]],
      cambio: [{ value: 0, disabled: true }],
    });
  }

  get client(): AbstractControl {
    return this.facturaForm.get('client')!;
  }

  get service(): AbstractControl {
    return this.facturaForm.get('servicio')!;
  }

  get pago(): AbstractControl {
    return this.facturaForm.get('pago')!;
  }

  get employ(): AbstractControl {
    return this.facturaForm.get('employ')!;
  }

  addItem(): void {
    const serviceName = this.service.value;

    const selectedService = this.serviciosDisponibles.find(s => s.name === serviceName);

    if (!selectedService) {
      this.service.setErrors({ invalid: true });
      this.service.markAsTouched();
      return;
    }

    const newItem = {
      id: selectedService.id,
      name: selectedService.name,
      unitPrice: selectedService.price,
      quantity: 1,
      totalPrice: selectedService.price,
    };

    this.invoiceItems.push(newItem);
    this.service.reset();
    this.calculateTotal();
    this.updateCambio();
  }

  removeItem(item: any): void {
    this.invoiceItems = this.invoiceItems.filter(i => i !== item);
    this.calculateTotal();
    this.updateCambio();
  }

  cleanTable(): void {
    this.invoiceItems = [];
    this.total = 0;
    this.updateCambio();
  }

  calculateTotal(): number {
    return (this.total = this.invoiceItems.reduce(
      (acc, item) => acc + item.unitPrice * (item.quantity || 1),
      0
    ));
  }

  handlePagoChange(): void {
    this.pago.valueChanges.subscribe(() => this.updateCambio());
  }

  updateCambio(): void {
    const pagoValue = this.pago.value || 0;
    const cambioValue = pagoValue >= this.total ? pagoValue - this.total : 0;
    this.cambio = cambioValue;
    this.facturaForm.get('cambio')?.setValue(this.cambio);
  }

  onSubmit(): void {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      return;
    }

    if (this.facturaForm.get('pago')?.value < this.total) {
      this.facturaForm.get('pago')?.setErrors({ min: true });
      return;
    }

    if (this.invoiceItems.length === 0) {
      this.service.setErrors({ required: true });
      this.service.markAsTouched();
      return;
    }

    const formData = this.facturaForm.getRawValue();
    const invoiceData = this.buildInvoiceData(formData);


    this.invoiceService.postInvoice(invoiceData, '').subscribe({
      next: () => {
        this.snackbarService.showSnackbar('Factura guardada correctamente', 'success');
        this.cleanTable();
        this.facturaForm.reset();
      },
      error: (error) => {
        console.error('Error al guardar la factura:', error);
        this.snackbarService.showSnackbar('Error al guardar la factura', 'error');
      },
      complete: () => {
        console.log('Proceso de guardado completado');
      }
    });
  }

  loadClients(): void {
    this.clienteService.get().subscribe((clients) => {
      this.clients = clients.map((client) => ({
        name: client.name,
        phone: client.whatsapp,
      }));
    });
  }

  loadServices(): void {
    this.servicesService.get().subscribe((services) => {
      this.serviciosDisponibles = services.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
      }));
    });
  }

  setupClientAutocomplete(): void {
    this.filteredClients$ = this.client.valueChanges.pipe(
      startWith(''),
      map(value => this._filterClients(value || ''))
    );
  }

  setupServicioAutocomplete(): void {
    this.filteredServicios$ = this.service.valueChanges.pipe(
      startWith(''),
      map(value => this._filterServicios(value || ''))
    );
  }

  onClientSelected(phone: any): void {
    this.selectedClient = this.clients.find(c => c.phone === phone);
  } 
  
  onClientBlur() {
    const control = this.client;
    const phone = control.value;
    if (!phone) {
      return;
    }

    const existe = this.clients.some(c => c.phone === phone);
    if (!existe) {
      control.setErrors({ notRegistered: true });
    } 
    else {
      if (control.hasError('notRegistered')) {
        control.setErrors(null);
      }
    }
  }

  private _filterClients(value: string): { name: string; phone: string }[] {
    const filterValue = value.toLowerCase();
    return this.clients.filter(client =>
      client.name.toLowerCase().includes(filterValue) ||
      client.phone.toLowerCase().includes(filterValue)
    );
  }

  private _filterServicios(value: string): { name: string; price: number }[] {
    const filterValue = value.toLowerCase();
    return this.serviciosDisponibles.filter(service =>
      service.name.toLowerCase().includes(filterValue)
    );
  }

  private buildInvoiceData(formData: any) {
    return {
      invoiceNumber: this.invoiceNumber,
      client: formData.client,
      employ: formData.employ,
      date: formData.date,
      payment_method: formData.payment_method,
      items: this.invoiceItems.map((item) => ({
        itemId: item.id,
        name: item.name,
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      total_amount: this.total,
      pago: formData.pago,
      cambio: this.cambio,
      status: 'facturada',
    };
  }
}
