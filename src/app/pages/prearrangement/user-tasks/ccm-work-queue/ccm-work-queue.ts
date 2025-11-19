import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import * as CcmWorkDTO from '../ccm-workDTO';

@Component({
  selector: 'app-ccm-work-queue',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule
  ],
  templateUrl: './ccm-work-queue.html',
  styleUrl: './ccm-work-queue.css',
})
export class CcmWorkQueue {

  constructor(
    public dialogRef: MatDialogRef<CcmWorkQueue>,
    @Inject(MAT_DIALOG_DATA) public data: CcmWorkDTO.ReadonlyPopupData
  ) {}

  close() {
    this.dialogRef.close();
  }

  hasAnyUploaded(): boolean {
    const u = this.data.uploadedDocuments;
    return !!(u && ((u.formFiles && u.formFiles.length) || (u.labFiles && u.labFiles.length) || (u.otherFiles && u.otherFiles.length)));
  }

}