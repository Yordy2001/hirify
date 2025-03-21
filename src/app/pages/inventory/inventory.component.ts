import { Component, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { InventoryService } from './inventory.service';
import { Inventory } from './models/inventory,model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddButtonComponent } from '../../shared/components/buttons/add-button/add-button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { SnackBarService } from '../../shared/components/snack-bar/snack-bar.service';
import { ErrorStateMatcher } from '@angular/material/core';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, MatInputModule,
    MatFormFieldModule, MatButtonModule,
    AddButtonComponent, ModalComponent, MatIconModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit, OnChanges {

  page = "Inventario";

  @ViewChild('modal') modal!: ModalComponent;
  dataSource = new MatTableDataSource<Inventory>;
  invetoryForm!: FormGroup;

  editingProduct: Inventory | null = null;
  products: Inventory[] | [] = []
  displayedColumns: string[] = ['name', 'price', 'quantity', 'min_stock', 'actions']

  constructor(
    private invetoryService: InventoryService,
    private snackbarService: SnackBarService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.products);
  }

  ngOnInit(): void {
    this.getData()

    this.invetoryForm = this.formBuilder.group({
      id: [''.trim()],
      name: [''.trim(), [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      min_stock: ['', [Validators.required, Validators.min(1)]],
    })
  }

  getData() {
    this.invetoryService.get().subscribe({
      next: (products) => {
        console.log(products);
        
        this.products = products
        this.dataSource.data = this.products;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  postData(data: Inventory) {
    this.invetoryService.post(data, '').subscribe({
      next: () => {
        this.modal.close();
        this.getData();
        this.snackbarService.showSnackbar('Producto agregado con éxito!', 'success');
        this.invetoryForm.reset();
      },
      error: (error) => {
        this.modal.close()
        this.snackbarService.showSnackbar('Error al agregar producto', 'error');
        this.getData();
      }
    })
  }

  putData(id: string, data: Inventory) {
    this.invetoryService.put(id, data).subscribe({
      next: () => {
        this.getData()
        this.modal.close();
        this.snackbarService.showSnackbar('Producto actualizado con éxito', 'success')
      },
      error: (err) => {
        this.snackbarService.showSnackbar('Error al actualizar producto', 'error')
        this.modal.close();
      }
    })
  }

  deleteData({ id }: Inventory) {
    this.invetoryService.delete(id).subscribe({
      next: () => {
        this.getData()
        this.snackbarService.showSnackbar('Producto eliminado', 'success')
      },
      error: () => {
        this.snackbarService.showSnackbar('Error al eliminar Producto', 'error')
      }
    })
  }

  openFormModal(template: TemplateRef<any>, product?: any) {
    if (product) {
      this.editingProduct = product;
      this.invetoryForm.patchValue(product);
      console.log(this.editingProduct);
      
      this.modal.open('Editar Producto', template);
      return
    }

    this.editingProduct = null;
    this.invetoryForm.reset();
    this.modal.open('Agregar Producto', template);
  }

  onSubmit() {
    if (this.invetoryForm.invalid) {
      this.snackbarService.showSnackbar('Formulario invalido', 'warning')
      return
    }

    const formValue = this.invetoryForm.value;

    if (this.editingProduct) {
      this.putData(this.editingProduct.id, formValue);
      return
    }

    this.postData(formValue);
    return
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  hasError(controlName: string, errorType: string): boolean {
    const control = this.invetoryForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}
