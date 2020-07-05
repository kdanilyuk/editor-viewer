import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocument } from 'src/app/models/Document';

@Component({
  selector: 'remove-document-dialog',
  templateUrl: './remove-document-dialog.component.html',
  styleUrls: ['./remove-document-dialog.component.scss']
})
export class RemoveDocumentDialogComponent {

  constructor(public dialogRef: MatDialogRef<RemoveDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDocument) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
