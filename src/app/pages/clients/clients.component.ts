import { Component, OnInit } from '@angular/core';
import { ClientsService } from './clients.service';
import { Client } from './models/client.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients',
  imports: [CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {

  clients: Client[] = []

  constructor(
    private readonly clientsService: ClientsService,
  ) { }

  ngOnInit() {
    this.clientsService.get().subscribe(
      (clients: Client[]) => {
        this.clients.push(...clients)
      },
    );
  }

  // !Todo : Add fill table
  // !Todo : NgOnChanges

  
}
