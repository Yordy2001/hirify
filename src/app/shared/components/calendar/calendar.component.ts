import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';


@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule,
      MatFormFieldModule, MatSelectModule, MatOptionModule, MatDatepickerModule,
      MatAutocompleteModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

  @Input() events: any[] = [];
  @Input() calendarHeight: number = 450;
  @Input() calendarWidth: number = 1000;
  @Input() plugins: any[] = [dayGridPlugin, timeGridPlugin, interactionPlugin];

  calendarOptions: CalendarOptions = {
    selectable: true,
    height: 450,
    locale: esLocale,
    plugins: this.plugins,
    headerToolbar: {
      right: 'prev,next today',
      center: 'title',
      left: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
  };
}
