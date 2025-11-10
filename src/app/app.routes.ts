import { Routes } from '@angular/router';
import { Prearrangement } from './pages/prearrangement/prearrangement';
import { TeamPerformance } from './pages/team-performance/team-performance';
import { ProcessPerformance } from './pages/process-performance/process-performance';
import { AdminConsole } from './pages/admin-console/admin-console';
import { PreArrangementForm } from './pages/prearrangement/pre-arrangement-form/pre-arrangement-form';

export const routes: Routes = [
{ path: '', redirectTo: 'prearrangement', pathMatch: 'full' },
  { path: 'prearrangement', component: Prearrangement },
  { path: 'team-performance', component: TeamPerformance },
  { path: 'process-performance', component: ProcessPerformance },
  { path: 'admin-console', component: AdminConsole },
  { path: 'prearrangement/form', component: PreArrangementForm },
];
