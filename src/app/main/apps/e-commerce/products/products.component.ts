import { ProductData } from "../configuration-files/ProductData.model";
import { DisplayColumns } from "./../configuration-files/ProductData.model";

import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    OnDestroy,
} from "@angular/core";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { FuseUtils } from "@fuse/utils";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { EcommerceProductsService } from "app/main/apps/e-commerce/products/products.service";
import { takeUntil } from "rxjs/operators";
import { ProductDialogComponent } from "../product-dialog/product-dialog.component";
import Swal from "sweetalert2";

@Component({
    selector: "e-commerce-products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class EcommerceProductsComponent implements OnInit, OnDestroy {
    form: FormGroup;
    isChecked = true;
    displayColumns: any[];
    isTitle: boolean = false;
    isEan: boolean = false;
    isUpdate: boolean = false;
    isCreated: boolean = false;
    isPrice: boolean = false;
    isActive: boolean = false;

    dataSource: FilesDataSource | null;
    // productDataInfo: ProductData = {
    //     productName: "Product Name",
    //     description: "Description",
    //     shortDescription: "Short Description",
    //     price: "Price",
    //     ean: "EAN",
    //     brand: "Brand",
    //     // creationDate: "Created Date",
    //     // updateDate: Date;
    // };
    Columns: DisplayColumns = {
        select: "select",
        id: "id",
        name: "name",
        shortDescription: "shortDescription",
        active: "active",
        ean: "ean",
        price: "price",
        actions: "actions",
    };
    selection = new SelectionModel<ProductData>(true, []);

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;
    public isShowing = false;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild("filter", { static: true })
    filter: ElementRef;
    isSelected: any[] = [];
    // Private
    showDeleteButton: boolean = false;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private matDialog: MatDialog,
        private _ecommerceProductsService: EcommerceProductsService,
        private _formBuilder: FormBuilder
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    ngOnInit(): void {
        this.displayColumns = Object.values(this.Columns);

        this.dataSource = new FilesDataSource(
            this._ecommerceProductsService,
            this.paginator,
            this.sort
        );
        console.log(this._ecommerceProductsService);
        fromEvent(this.filter.nativeElement, "keyup")
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }

                this.dataSource.filter = this.filter.nativeElement.value;
            });
        // Reactive Form
        this.form = this._formBuilder.group({
            title: [""],
            // lastName: ["", Validators.required],
            dropdown: ["and"],
            ean: [""],
            toDropdown: ["to"],
            fromPrice: [""],
            toPrice: [""],
            acceptTerms: [true],
            onOff: [true],
            attribute: [""],
            updateDate: [""],
            toUpdated: ["equals"],
            updateDate1: [""],
            CreatedDate: [""],
            toCreated: ["equals"],
            createdDate1: [""],
        });
    }
    toogleFilter() {
        this.isShowing = !this.isShowing;
    }
    openDialog(ids: any[]) {
        console.log(ids);
        const deleteDialog = this.matDialog.open(ProductDialogComponent, {
            disableClose: true,
            data: {
                selectIds: ids ? ids : this.isSelected,
                width: "300px",
                height: "400px",
            },
        });
    }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this._ecommerceProductsService.products.length;
        if (numSelected === numRows) {
            this.isSelected = this.selection.selected;
        }
        return numSelected === numRows;
    }
    checkboxLabel(row?: ProductData): string {
        if (!row) {
            return `${this.isAllSelected() ? "select" : "deselect"} all`;
        }
        return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
            row.id + 1
        }`;
    }
    openSweetAlert(id: any) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                if (!id) {
                    console.log(this.isSelected);
                } else {
                    console.log(id);
                }
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
        });
    }
    onChange($event) {
        let attributeValue = this.form.get("attribute").value;
        this.form.valueChanges.subscribe((value) => {
            attributeValue = this.form.get("attribute").value;
            if (attributeValue === "title") {
                this.isTitle = true;
            } else if (attributeValue === "ean") {
                this.isEan = true;
            } else if (attributeValue === "updateDate") {
                this.isUpdate = true;
            } else if (attributeValue === "createdDate") {
                this.isCreated = true;
            } else if (attributeValue === "active") {
                this.isActive = true;
            } else if (attributeValue === "price") {
                this.isPrice = true;
            }
        });
    }
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
            this.isSelected = [];
            console.log(this.isSelected);
            return true;
        } else {
            this._ecommerceProductsService.products.forEach((row) => {
                return this.selection.select(row);
            });
        }
    }
    getSelected($event, row) {
        $event.stopPropagation();
        console.log(row);
        const alreadyIn =
            this.isSelected.length &&
            this.isSelected.findIndex((item) => item.id === row.id);
        if (!this.isSelected.length) {
            this.isSelected.push(row);
        } else if (this.isSelected.length && alreadyIn < 0) {
            this.isSelected.push(row);
        } else {
            this.isSelected.splice(alreadyIn, 1);
        }
        console.log(this.isSelected);
    }
    submitSearchData() {
        const allSearchData = this.form.getRawValue();
        console.log(allSearchData);
    }
}

export class FilesDataSource extends DataSource<any> {
    private _filterChange = new BehaviorSubject("");
    private _filteredDataChange = new BehaviorSubject("");
    public newData = [];
    /**
     * Constructor
     *
     * @param {EcommerceProductsService} _ecommerceProductsService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _ecommerceProductsService: EcommerceProductsService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();
        this.newData = this._ecommerceProductsService.products;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        // this._ecommerceProductsService.products = [];
        // // this._ecommerceProductsService.onProductsChanged.asObservable().subscribe(item=>{
        // //     console.log(item)
        // //     this._ecommerceProductsService.products = this.newData
        // // })
        const displayDataChanges = [
            this._ecommerceProductsService.onProductsChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange,
        ];
        return merge(...displayDataChanges).pipe(
            map(() => {
                let data = this._ecommerceProductsService.products.slice();

                data = this.filterData(data);

                this.filteredData = [...data];

                data = this.sortData(data);

                // Grab the page's slice of data.
                const startIndex =
                    this._matPaginator.pageIndex * this._matPaginator.pageSize;
                return data.splice(startIndex, this._matPaginator.pageSize);
            })
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any) {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string {
        if (this._filterChange.value !== "") {
            this._ecommerceProductsService.products = this.newData;
            // this._ecommerceProductsService.getFilteredData(this._filterChange.value);
        } else {
            this._ecommerceProductsService.products = [];
        }
        return this._filterChange.value;
    }

    set filter(filter: string) {
        if (this._filterChange.value !== "") {
            this._ecommerceProductsService.products = this.newData;
        } else {
            this._ecommerceProductsService.products = [];
        }
        this._filterChange.next(filter);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(data): any {
        if (!this.filter) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    /**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     */
    sortData(data): any[] {
        if (!this._matSort.active || this._matSort.direction === "") {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = "";
            let propertyB: number | string = "";

            switch (this._matSort.active) {
                case "id":
                    [propertyA, propertyB] = [a.id, b.id];
                    break;
                case "shortDescription":
                    [propertyA, propertyB] = [
                        a.shortDescription,
                        b.shortDescription,
                    ];
                    break;
                case "productName":
                    [propertyA, propertyB] = [a.productName, b.productName];
                    break;
                // case "categories":
                //     [propertyA, propertyB] = [a.categories[0], b.categories[0]];
                //     break;
                // case "price":
                //     [propertyA, propertyB] = [a.priceTaxIncl, b.priceTaxIncl];
                //     break;
                // case "quantity":
                //     [propertyA, propertyB] = [a.quantity, b.quantity];
                //     break;
                // case "active":
                //     [propertyA, propertyB] = [a.active, b.active];
                //     break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (
                (valueA < valueB ? -1 : 1) *
                (this._matSort.direction === "asc" ? 1 : -1)
            );
        });
    }

    /**
     * Disconnect
     */
    disconnect(): void {}
}
