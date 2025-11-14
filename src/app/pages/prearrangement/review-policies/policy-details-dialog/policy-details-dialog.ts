import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, } from '@angular/material/dialog';
import { FileUpload } from '../file-upload/file-upload';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'; // <mat-form-field>
import { MatInputModule } from '@angular/material/input';          // <input matInput>
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-policy-details-dialog',
  imports: [FileUpload, CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './policy-details-dialog.html',
  styleUrls: ['./policy-details-dialog.css'],
})
export class PolicyDetailsDialog {

  physicianLicense: string = '';
  simbAmount: number | null = null;

  @ViewChild('labFiles') labFiles!: FileUpload;
  @ViewChild('formFiles') formFiles!: FileUpload;
  @ViewChild('otherFiles') otherFiles!: FileUpload;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PolicyDetailsDialog>
  ) {}

  close() {
    this.dialogRef.close();
  }

  submit(form: NgForm) {
    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    // Collect uploaded files
    const uploadedFiles = {
      labFiles: this.labFiles.getFiles(),
      formFiles: this.formFiles.getFiles(),
      otherFiles: this.otherFiles.getFiles()
    };

    // Create payload
    const payload = {
      physicianLicense: this.physicianLicense,
      simbAmount: this.simbAmount,
      files: uploadedFiles,
      policy: this.data
    };

    // Expose payload to parent via close() or custom event
    this.close();
    // this.dialogRef.close(payload);
  }
}
