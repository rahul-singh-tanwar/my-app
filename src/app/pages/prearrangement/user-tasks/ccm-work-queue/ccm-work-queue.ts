import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {  } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import * as CcmWorkDTO from '../ccm-workDTO'

@Component({
  selector: 'app-ccm-work-queue',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './ccm-work-queue.html',
  styleUrl: './ccm-work-queue.css',
})
export class CcmWorkQueue {

  constructor(
    public dialogRef: MatDialogRef<CcmWorkQueue>,
    @Inject(MAT_DIALOG_DATA) public data: CcmWorkDTO.ReadonlyPopupData
  ) { }

  close() {
    this.dialogRef.close();
  }

  hasAnyUploaded(): boolean {
    console.log("Uploaded Documents:", this.data);
    const docs = this.data.uploadedDocuments;
    return docs?.formFiles?.length || docs?.labFiles?.length || docs?.otherFiles?.length ? true : false;
  }

}