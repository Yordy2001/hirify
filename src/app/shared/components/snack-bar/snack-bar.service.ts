import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarComponent } from "./snack-bar.component";

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {
    constructor(
        private snackBar: MatSnackBar,
    ) { }

    showSnackbar(message: string, type: 'success' | 'error' | 'warning' | 'info', duration = 5000) {
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info',
        };

        this.snackBar.openFromComponent(SnackBarComponent, {
            data: { message, type, duration, icon: icons[type] },
            duration,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: type, // Clase CSS específica
        });
    }
}