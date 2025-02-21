import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ClientsComponent } from './dashboard/clients/clients.component';
import { AppointmentsComponent } from './dashboard/appointments/appointments.component';
import { FinancialComponent } from './dashboard/financial/financial.component';
import { InventoryComponent } from './dashboard/inventory/inventory.component';
import { ServicesComponent } from './dashboard/services/services.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'dashboard', canActivate: [AuthGuard], children: [
            { path: 'appointments', component: AppointmentsComponent },
            { path: 'clients', component: ClientsComponent },
            { path: 'services', component: ServicesComponent },
            { path: 'inventory', component: InventoryComponent },
            { path: 'financial', component: FinancialComponent },
        ]
    },
    { path: '**', component: NotfoundComponent }
];
