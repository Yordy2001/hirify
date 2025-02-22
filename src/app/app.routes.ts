import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { FinancialComponent } from './pages/financial/financial.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { ServicesComponent } from './pages/services/services.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: DashboardComponent,
        children: [
            { path: 'appointments', component: AppointmentsComponent },
            { path: 'clients', component: ClientsComponent },
            { path: 'services', component: ServicesComponent },
            { path: 'inventory', component: InventoryComponent },
            { path: 'financial', component: FinancialComponent },
        ]
    },
    { path: '**', component: NotfoundComponent }
];
