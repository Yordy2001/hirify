import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BussinesService } from './bussines-service.service';
import { AddButtonComponent } from "../../shared/components/buttons/add-button/add-button.component";
import { Service } from './models/bussines-service.interface';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { SnackBarService } from '../../shared/components/snack-bar/snack-bar.service';

@Component({
  selector: 'app-services',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, MatInputModule,
    MatFormFieldModule, MatButtonModule,
    AddButtonComponent, MatIconModule, ModalComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {

  @ViewChild('modal') modal!: ModalComponent;
  serviceForm!: FormGroup;
  page = "Servicio";
  services: Service[] = [];
  displayedColumns: string[] = ['name', 'duration', 'price', 'actions'];
  dataSource = new MatTableDataSource<Service>;
  editingService: Service | null = null;


  constructor(
    private formBuilder: FormBuilder,
    private bussinesService: BussinesService,
    private snackbarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.getData();

    this.serviceForm = this.formBuilder.group({
      id: [''.trim()],
      name: ['', [Validators.required, Validators.minLength(3)]],
      duration: ['', [Validators.required, Validators.pattern('^[0-9]+min$')]],
      price: ['', [Validators.required, Validators.min(1)]],
    });
  }

  getData(): void {
    this.bussinesService.get().subscribe({
      next: (data: Service[]) => {
        this.services = data;
        this.dataSource.data = this.services;
      },
      error: (error) => {
        this.snackbarService.showSnackbar('Error al cargar los servicios', 'warning')
      }
    })
  }

  postService(data: Service) {
    this.bussinesService.post(data, '').subscribe({
      next: () => {
        this.modal.close()
        this.getData();
        this.serviceForm.reset();
        this.snackbarService.showSnackbar('Servicio agregado con éxito', 'success')
      },
      error: () => {
        this.modal.close()
        this.snackbarService.showSnackbar('Error al agregar Servicio', 'error');
        this.getData();
      },
    })
  }

  putService(id: string, data: Service) {
    this.bussinesService.put(id, data).subscribe({
      next: () => {
        this.getData()
        this.modal.close();
        this.snackbarService.showSnackbar('Servicio Actualizado con éxito', 'success')
      },
      error: (err) => {
        this.snackbarService.showSnackbar('Error al actualizar servicio', 'error')
        this.modal.close();

      }
    })
  }

  deleteService(id: string) {
    this.bussinesService.delete(id).subscribe({
      next: () => {
        this.getData()
        this.snackbarService.showSnackbar('Servicio eliminado', 'success')
      },
      error: () => {
        this.snackbarService.showSnackbar('Error al eliminar servicio', 'error')
      }
    })
  }

  openFormModal(template: TemplateRef<any>, service?: any) {
    if (service) {
      this.editingService = service;
      this.serviceForm.patchValue(service);
      this.modal.open('Editar Servicio', template);
      return
    }

    this.editingService = null;
    this.serviceForm.reset();
    this.modal.open('Agregar Servicio', template);
  }

  onSubmit() {
    if (this.serviceForm.invalid) {
      alert('Invalid form group');
      return
    }

    const formValue = this.serviceForm.value;

    if (this.editingService) {
      this.putService(this.editingService.id, formValue);
      return
    }

    this.postService(formValue);
    return
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };
}
