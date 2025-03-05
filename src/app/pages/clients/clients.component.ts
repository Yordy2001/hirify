import { Component, OnInit } from '@angular/core';
import { ClientsService } from './clients.service';
import { Client } from './models/client.model';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AddButtonComponent } from "../../shared/components/buttons/add-button/add-button.component";

@Component({
  selector: 'app-clients',
  imports: [CommonModule, MatTableModule, MatInputModule, MatFormFieldModule, MatButtonModule, AddButtonComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  page = 'Cliente'
  displayedColumns: string[] = ['name', 'whatsapp', 'gender'];
  clients: Client[] = []

  constructor(
    private readonly clientsService: ClientsService,
  ) { }

  ngOnInit() {
    this.clientsService.get().subscribe(
      (clients: Client[]) => {
        console.log(clients);
        
        this.clients.push(...clients)
      },
    );
  }
  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.clients.filter = filterValue.trim().toLowerCase();
  }

  // !Todo : Add fill table
  // !Todo : NgOnChanges


}
