import { Routes } from '@angular/router';
import { Loan } from './loan/loan';
import { LoanForm } from './loan-form/loan-form';

export const routes: Routes = [
  { path: '', component: Loan },
  { path: 'profile', component: LoanForm },
];
