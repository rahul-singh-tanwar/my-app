import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, } from '@angular/material/dialog';
import { FileUpload } from '../file-upload/file-upload';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'; // <mat-form-field>
import { MatInputModule } from '@angular/material/input';          // <input matInput>
import { MatButtonModule } from '@angular/material/button'; 
import { CamundaService } from '../../../../../utils/camunda.service';

@Component({
  selector: 'app-policy-details-dialog',
  imports: [FileUpload, CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './policy-details-dialog.html',
  styleUrls: ['./policy-details-dialog.css'],
})
export class PolicyDetailsDialog {

  physicianLicense: string = '';
  simbAmount: number | null = null;
  taskname = 'Upload Documents';
  userTaskKey ='';
  processInstanceKey = '';

  @ViewChild('labFiles') labFiles!: FileUpload;
  @ViewChild('formFiles') formFiles!: FileUpload;
  @ViewChild('otherFiles') otherFiles!: FileUpload;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PolicyDetailsDialog>,
    private camundaService: CamundaService
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

    this.taskname = 'Upload Documents';
     this.camundaService.processIntanceKey$.subscribe(key => {
      if (key) {
        this.processInstanceKey = key;
      }
    });

    

    // Get User task key and complete Task
     this.camundaService.getUserTaskByProcessInstance(this.processInstanceKey, this.taskname)
        .subscribe({
          next: (res) => {
            this.userTaskKey = res.userTaskKey;
         /*   const variables = {
              customerInfo: {
                nationalId: fv.nationalId || '',
                policyNumber: fv.policyNumber || '',
              },
              visitInfo: {
                visitType: fv.visitType || '',
                reservationType: fv.reservationType || '',
                HospitalName: fv.hospitalName || '',
                ICD10: fv.icd10 || '',
                ICD9: fv.icd9 || '',
                AdmissionDate: fv.admissionDate || '',
                AccidentDate: fv.accidentDate || '',
              }
            }*/
          }
          });

          const variables ={};

            // Complete user task
            this.camundaService.completeUserTask(this.userTaskKey, variables).subscribe({
              next: () => {
                     userTaskKey: this.userTaskKey,
                                    
                    variables
            /*      this.formSubmitted.emit({
                    userTaskKey: this.userTaskKey,
                    processInstanceKey: this.processInstanceKey,
                    payload,
                    variables
                  });*/
                  console.log('✅ Task completed and formSubmitted emitted');
              },
              error: (err) => {
                console.error('❌ Error completing task:', err);
              },
            });
         
    
    // Expose payload to parent via close() or custom event
    this.close();
    // this.dialogRef.close(payload);
  }
}
