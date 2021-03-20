
import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
export interface DialogData {

  selectIds: any[];
  width: string;
  height: string;
}
@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})

export class ProductDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
) {}

  ngOnInit(): void {
  }
  onNoClick(): void {
      this.dialogRef.close();
  }
  deleteAllByIds(selectIds:any[]){
    console.log(selectIds);
    this.dialogRef.close();

  }
}

