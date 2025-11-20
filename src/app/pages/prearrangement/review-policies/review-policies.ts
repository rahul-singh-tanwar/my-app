import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PolicyDetailsDialog } from './policy-details-dialog/policy-details-dialog';

@Component({
  selector: 'app-review-policies',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatRadioModule,
    MatDialogModule,
    PolicyDetailsDialog
  ],
  templateUrl: './review-policies.html',
  styleUrl: './review-policies.css'
})
export class ReviewPolicies {
  @Output() backPressed = new EventEmitter<void>();
  dataSource = [
    {
      companyName: 'Allianz Ayudhya',
      policyType: 'A&H',
      policyNumber: 'PA-2025-044444',
      policyStatus: 'Inforce',
      effectiveDate: '2023-01-01',
      expiryDate: '2024-01-01',
      firstUseDate: '2023-02-01',
      benefits: [
        { name: 'Hospitalization', limit: '฿200,000', remarks: 'Covers room rent' },
        { name: 'Medicines', limit: '฿50,000', remarks: 'Prescription only' }
      ]
    },
    {
      companyName: 'Allianz Ayudhya',
      policyType: 'A&H',
      policyNumber: 'PA-2025-055555',
      policyStatus: 'Inforce',
      effectiveDate: '2021-03-10',
      expiryDate: '2024-03-10',
      firstUseDate: '2021-09-01',
      benefits: [
        { name: 'Death Benefit', limit: '฿100,000', remarks: 'Full coverage' },
        { name: 'Accidental Cover', limit: '฿500,000', remarks: 'Covers accidental death' }
      ]
    },
    {
      companyName: 'Allianz Ayudhya',
      policyType: 'L&H',
      policyNumber: 'OL-2023-099999',
      policyStatus: 'Inforce',
      effectiveDate: '2024-06-01',
      expiryDate: '2025-06-01',
      firstUseDate: '2024-06-15',
      benefits: [
        { name: 'Death Benifit', limit: '฿100,000', remarks: 'Includes delay compensation' },
        { name: 'Medical Emergency', limit: '฿300,000', remarks: 'Covers hospitalization abroad' }
      ]
    },
    {
      companyName: 'Allianz Ayudhya',
      policyType: 'L&H',
      policyNumber: 'OL-2023-088888',
      policyStatus: 'Inforce',
      effectiveDate: '2022-09-10',
      expiryDate: '2023-09-10',
      firstUseDate: '2023-10-01',
      benefits: [
        { name: 'Surgery Cover', limit: '฿150,000', remarks: 'Pre-approved surgeries only' },
        { name: 'Diagnostics', limit: '฿25,000', remarks: 'Covers lab tests' }
      ]
    }
  ];

  displayedColumns = [
    'select', 'companyName', 'policyType', 'policyNumber',
    'policyStatus', 'effectiveDate', 'expiryDate', 'firstUseDate', 'benefits'
  ];

  expandedRow: any = null;
  selectedRow: any;

  currentPage = 0;
  pageSize = 10;
  totalItems = this.dataSource.length;

  get paginatedDataSource() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.dataSource.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get hasPreviousPage() {
    return this.currentPage > 0;
  }

  get hasNextPage() {
    return this.currentPage < this.totalPages - 1;
  }

  constructor(private dialog: MatDialog) {}

  goBack() {
    this.backPressed.emit();
  }

  toggleRow(row: any) {
    this.expandedRow = this.expandedRow === row ? null : row;
  }

  onSelectRow(row: any) {
    this.selectedRow = row;
    this.dialog.open(PolicyDetailsDialog, {
      width: '90vw',
      maxWidth: '1100px',
      height: '90vh',
      panelClass: 'custom-policy-dialog',
      data: row
    });
  }

  goToPreviousPage() {
    if (this.hasPreviousPage) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    if (this.hasNextPage) {
      this.currentPage++;
    }
  }

  get startingEntryNumber() {
    return this.currentPage * this.pageSize + 1;
  }

  get endingEntryNumber() {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalItems);
  }
}
