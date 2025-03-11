import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './add-button.component.html',
})
export class AddButtonComponent {
  @Input() page:string = '';
  @Input() action:string = 'Agregar';
}
