import { Component, OnInit, TemplateRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective, FormBuilder } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AddButtonComponent } from "../../shared/components/buttons/add-button/add-button.component";
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ClientsService } from './clients.service';
import { Client } from './models/client.model';
import { SnackBarService } from '../../shared/components/snack-bar/snack-bar.service';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-clients',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, MatInputModule,
    MatFormFieldModule, MatButtonModule,
    AddButtonComponent, ModalComponent, MatIconModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit, OnChanges {

  @ViewChild('modal') modal!: ModalComponent;

  page = 'Cliente';
  editingClient: Client | null = null;

  displayedColumns: string[] = ['name', 'last_name', 'whatsapp', 'gender', 'age', 'actions'];

  clients: Client[] = [];

  dataSource = new MatTableDataSource<Client>;

  clientFormGrup!: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private readonly clientsService: ClientsService,
    private snackbarService: SnackBarService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.clients);
  }

  ngOnInit() {
    this.getData()

    this.clientFormGrup = this.formBuilder.group({
      id: new FormControl(''.trim),
      name: new FormControl(''.trim(), [Validators.required]),
      last_name: new FormControl(''.trim(), [Validators.required]),
      whatsapp: new FormControl(''.trim(), [Validators.required, Validators.minLength(10)]),
      gender: new FormControl(''.trim(), [Validators.required, Validators.maxLength(1)]),
      age: new FormControl(''.trim(), [Validators.required, Validators.maxLength(3), Validators.minLength(1)]),
    })
  };

  getData() {
    this.clientsService.get().subscribe(
      (clients: Client[]) => {
        this.clients = clients;
        this.dataSource.data = this.clients;
      },
    );
  }

  postData() {
    const data = this.clientFormGrup.value;
 
    if (!this.clientFormGrup.invalid) {
      this.clientsService.post(data, '').subscribe({
        next: () => {
          this.getData()
          this.clientFormGrup.reset();
          this.snackbarService.showSnackbar('Cliente agregado correctamente', 'success');
          //Close Modal
          this.modal.close()
        },
        error: (err) => { 
          this.snackbarService.showSnackbar('Error al agregar cliente', 'error');
        }
      })
    }
  }

  editClient(id: any) {
    // todo: add alert after update one
    const formValue = this.clientFormGrup.value;

    this.clientsService.put(id, formValue).subscribe({
      next: () => {
        this.snackbarService.showSnackbar('Cliente actualizado con éxito', 'success')
        this.getData()
        this.modal.close();
      },
      error: (err) => {
        this.snackbarService.showSnackbar('Error al actualizar cliente', 'success')
        this.modal.close();

      }
    })
  }

  deleteClient({ id }: Client) {
    // todo: add validate alert before delete client
    this.clientsService.delete(id).subscribe({
      next: () => {
        this.snackbarService.showSnackbar('Cliente eliminado con exito', 'success')
        // GetData
        this.getData();
        this.modal.close();
      },
      error: (err) => {
        this.snackbarService.showSnackbar('Error al eliminar Cliente', 'error')
        this.getData();
        this.modal.close();
      }
    });
  }

  onSubmit() {
    if (this.clientFormGrup.invalid) {
      alert('Invalid form group');
      return
    }

    if (this.editingClient) {
      this.editClient(this.editingClient.id);
      return
    }
 
    this.postData();
    return
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  openFormModal(template: TemplateRef<any>, client?: any) {

    if (client) {
      this.editingClient = client;
      this.clientFormGrup.patchValue(client);
      this.modal.open('Editar Cliente', template);
      return
    }

    this.editingClient = null;
    this.clientFormGrup.reset();
    this.modal.open('Agregar Cliente', template);
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.clientFormGrup.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}
