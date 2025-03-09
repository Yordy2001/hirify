import { Component, OnInit, TemplateRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { AddButtonComponent } from "../../shared/components/buttons/add-button/add-button.component";
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ClientsService } from './clients.service';
import { Client } from './models/client.model';


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
    AddButtonComponent, ModalComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit, OnChanges {

  @ViewChild('modal') modal!: ModalComponent;

  page = 'Cliente';

  displayedColumns: string[] = ['name', 'last_name', 'whatsapp', 'gender', 'age'];

  clients: Client[] = [];

  dataSource = new MatTableDataSource<Client>;

  clientFormGrup: FormGroup = new FormGroup({});
  matcher = new MyErrorStateMatcher();

  constructor(
    private readonly clientsService: ClientsService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.clients);
  }

  ngOnInit() {
    this.getData()

    this.clientFormGrup = new FormGroup({
      name: new FormControl(''.trim(), [Validators.required]),
      lastName: new FormControl(''.trim(), [Validators.required]),
      whatsapp: new FormControl(''.trim(), [Validators.required, Validators.minLength(10)]),
      gender: new FormControl(''.trim(), [Validators.required]),
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
          //Close Modal
          this.modal.close()
        },
        error: (err) => { console.log(err); }
      })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  openFormModal(template: TemplateRef<any>) {
    this.modal.open('Agregar Cliente', template);
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.clientFormGrup.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}
