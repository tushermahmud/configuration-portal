import { Component, Inject, OnInit } from "@angular/core";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
export interface DialogData {
    data: {};
    width: string;
    height: string;
}
@Component({
    selector: "app-product-save-confirmation",
    templateUrl: "./product-save-confirmation.component.html",
    styleUrls: ["./product-save-confirmation.component.scss"],
})
export class ProductSaveConfirmationComponent implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<ProductSaveConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit(): void {}
    onNoClick(): void {
        this.dialogRef.close();
    }
    saveAllData(data: {}) {
        console.log(data);
        this.dialogRef.close();
    }
}
