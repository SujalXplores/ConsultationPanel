import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsulteeComponent } from './components/consultee/consultee.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EscalateComponent } from './components/escalate/escalate.component';
import { AuthGuard } from './components/login/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Page404Component } from './components/page404/page404.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'nav',
    canActivate: [AuthGuard],
    component: NavbarComponent,
    children: [
      { path: '', component: ConsulteeComponent },
      { path: 'dashboard', component: DashboardComponent},
      { path: 'escalated', component: EscalateComponent }
    ]
  },
  { path: 'pagenotfound', component: Page404Component },
  { path: '**', redirectTo: '/pagenotfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
