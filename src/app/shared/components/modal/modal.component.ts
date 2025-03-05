import { CommonModule } from '@angular/common';
import { Component, signal, TemplateRef, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  isOpen: WritableSignal<boolean> = signal(false);
  title: WritableSignal<string> = signal('');
  content: WritableSignal<TemplateRef<any> | null> = signal(null);

  open(title: string, content: TemplateRef<any> | null ) {
    console.log(content);
    
    this.title.update(() => title);
    this.content.update(() => content);
    this.isOpen.update(() => true);
  }

  close() {
    this.isOpen.update(() => false);
    this.content.update(() => null);
  }
}
