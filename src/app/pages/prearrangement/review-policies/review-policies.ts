import { Component } from '@angular/core';
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
  styleUrls: ['./review-policies.css']
})
export class ReviewPolicies {
  dataSource = [
    {
      companyName: 'ABC Insurance',
      policyType: 'Health',
      policyNumber: '12345',
      policyStatus: 'Active',
      effectiveDate: '2023-01-01',
      expiryDate: '2024-01-01',
      firstUseDate: '2023-02-01',
      benefits: [
        { name: 'Hospitalization', limit: '₹2,00,000', remarks: 'Covers room rent' },
        { name: 'Medicines', limit: '₹50,000', remarks: 'Prescription only' }
      ]
    },
    {
      companyName: 'XYZ Life',
      policyType: 'Life',
      policyNumber: '67890',
      policyStatus: 'Expired',
      effectiveDate: '2021-03-10',
      expiryDate: '2024-03-10',
      firstUseDate: '2021-04-01',
      benefits: [
        { name: 'Death Benefit', limit: '₹10,00,000', remarks: 'Full coverage' },
        { name: 'Accidental Cover', limit: '₹5,00,000', remarks: 'Covers accidental death' }
      ]
    },
    {
      companyName: 'CarePlus',
      policyType: 'Travel',
      policyNumber: 'T98324',
      policyStatus: 'Active',
      effectiveDate: '2024-06-01',
      expiryDate: '2025-06-01',
      firstUseDate: '2024-06-15',
      benefits: [
        { name: 'Lost Baggage', limit: '₹1,00,000', remarks: 'Includes delay compensation' },
        { name: 'Medical Emergency', limit: '₹3,00,000', remarks: 'Covers hospitalization abroad' }
      ]
    },
    {
      companyName: 'MediShield',
      policyType: 'Health',
      policyNumber: 'MS44567',
      policyStatus: 'Pending Renewal',
      effectiveDate: '2022-09-10',
      expiryDate: '2023-09-10',
      firstUseDate: '2022-10-01',
      benefits: [
        { name: 'Surgery Cover', limit: '₹1,50,000', remarks: 'Pre-approved surgeries only' },
        { name: 'Diagnostics', limit: '₹25,000', remarks: 'Covers lab tests' }
      ]
    }
  ];

  displayedColumns = [
    'select', 'companyName', 'policyType', 'policyNumber',
    'policyStatus', 'effectiveDate', 'expiryDate', 'firstUseDate', 'benefits'
  ];

  expandedRow: any = null;
  selectedRow: any;

  constructor(private dialog: MatDialog) {}

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
}
