import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PreArrangementForm} from './pre-arrangement-form/pre-arrangement-form';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-prearrangement',
  imports: [PreArrangementForm, CommonModule, MatIconModule],
  templateUrl: './prearrangement.html',
  styleUrl: './prearrangement.css',
})
export class Prearrangement {
  selectedDepartment: 'IPD' | 'OPD' = 'IPD';
  showForm: boolean = false;
  constructor(private router: Router) {}

  loadForm() {
    this.showForm = true;
    // this.router.navigate(['/prearrangement/form'], { queryParams: { dept: this.selectedDepartment } });
    // console.log('Loading Pre-Arrangement Form for', this.router);
  }

  goBack() {
    this.showForm = false;
  }

  onDepartmentChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedDepartment = input.value as 'IPD' | 'OPD';
  }

  onFormSubmit(formValue: any) {
    console.log('Form submitted from child:', formValue);
  }
}
