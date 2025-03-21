import { Component, Inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-snack-bar',
  imports: [MatIcon],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent {

  progress = 100;
  private duration = 3000;
  intervalSub!: Subscription;

  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
    if (data.duration) this.duration = data.duration;
    this.startTimer();
  }

  startTimer() {
    const step = 100 / (this.duration / 100); // Calcular decremento de barra
    this.intervalSub = interval(100).subscribe(() => {
      this.progress -= step;
      if (this.progress <= 0) this.closeSnackbar();
    });
  }

  closeSnackbar() {
    this.intervalSub.unsubscribe();
    this.snackBarRef.dismiss();
  }
}
