import { EcommerceProductsService } from "app/main/apps/e-commerce/products/products.service";
import { MatDialog } from "@angular/material/dialog";
import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    AfterViewInit,
    ViewEncapsulation,
    ViewChildren,
} from "@angular/core";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    FormArray,
} from "@angular/forms";
import "rxjs/add/operator/debounceTime";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Location } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatCalendarCellClassFunction } from "@angular/material/datepicker";

import { fuseAnimations } from "@fuse/animations";
import { FuseUtils } from "@fuse/utils";
import { ProductData } from "./../configuration-files/ProductData.model";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { EcommerceProductService } from "app/main/apps/e-commerce/product/product.service";
import { MatChipInputEvent } from "@angular/material/chips";
import {
    NgxFileDropEntry,
    FileSystemFileEntry,
    FileSystemDirectoryEntry,
} from "ngx-file-drop";
import Swal from "sweetalert2";

import { ProductSaveConfirmationComponent } from "../product-save-confirmation/product-save-confirmation.component";
import { AppSettingsService } from "../configuration-files/AppSettingsService";
import { AppsSettingsService } from "../configuration-files/AppsSettingsService";
export class DatepickerDateClassExample {
    dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
        // Only highligh dates inside the month view.
        if (view === "month") {
            const date = cellDate.getDate();

            // Highlight the 1st and 20th day of each month.
            return date === 1 || date === 20 ? "example-custom-date-class" : "";
        }

        return "";
    };
}
@Component({
    selector: "e-commerce-product",
    templateUrl: "./product.component.html",
    styleUrls: ["./product.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class EcommerceProductComponent
    implements OnInit, OnDestroy, AfterViewInit {
    singleProduct: ProductData;
    pageType: string;
    productForm: FormGroup;
    public images: NgxFileDropEntry[] = [];
    deletedImages: any[] = [];
    allFiles: any[] = [];
    allSaveFiles: File[] = [];
    nameSearch: string = "";
    variants: ProductData[] = [];
    // Private
    filteredProduct: ProductData[];
    // filter: ElementRef;
    private _unsubscribeAll: Subject<any>;
    categoriess: string[] = [
        "Extra cheese",
        "Mushroom",
        "Onion",
        "Pepperoni",
        "Sausage",
        "Tomato",
    ];
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    displayColumns: any[];
    products: ProductData[] = [];
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    /**
     * Constructor
     *
     * @param {EcommerceProductService} _ecommerceProductService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    // Vertical Stepper
    verticalStepperStep1: FormGroup;
    verticalStepperStep2: FormGroup;
    verticalStepperStep3: FormGroup;
    verticalStepperStep4: FormGroup;
    verticalStepperStep5: FormGroup;
    verticalStepperStep6: FormGroup;
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    allFormData = {};
    constructor(
        private appsSettingService: AppsSettingsService,
        private appSettingService: AppSettingsService,
        private _ecommerceProductsService: EcommerceProductsService,
        private _ecommerceProductService: EcommerceProductService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private matDialog: MatDialog
    ) {
        // Set the default
        this.singleProduct = new ProductData();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.appsSettingService.resolve().subscribe((settings) => {
            this.displayColumns = settings.searchResultColumns;
        });

        this._ecommerceProductsService
            .getVariantProducts()
            .subscribe((products) => {
                this.products = products;
            });
        this._ecommerceProductService.onProductChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((product) => {
                if (product) {
                    console.log(product);
                    this.singleProduct = new ProductData(product);
                    this.pageType = "edit";
                    product.images.map((file) => {
                        this.allFiles.push({
                            fileId: file.id,
                            fileType: file.type,
                            fileUrl: file.url,
                            isDeleted: false,
                        });
                    });
                    console.log(this.allFiles);
                    // this.getUserProvidedFiles(
                    //     answer
                    // ).map((file) =>
                    //     this.neededFiles.push(
                    //         new PraxisDocument(
                    //             file && file.ItemId,
                    //             file && file.Name
                    //         )
                    //     )
                    // );
                } else {
                    this.pageType = "new";
                    this.singleProduct = new ProductData();
                    this.verticalStepperStep1 = this._formBuilder.group({
                        productName: ["", Validators.required],
                        productUrl: ["", Validators.required],
                        ean: ["", Validators.required],
                        active: [false, Validators.required],
                    });

                    this.verticalStepperStep2 = this._formBuilder.group({
                        description: ["", Validators.required],
                        shortDescription: ["", Validators.required],
                        brand: ["", Validators.required],
                        keywords: [[]],
                    });

                    this.verticalStepperStep3 = this._formBuilder.group({
                        price: ["", Validators.required],
                    });
                    this.verticalStepperStep4 = this._formBuilder.group({
                        images: ["", Validators.required],
                    });
                    this.verticalStepperStep5 = this._formBuilder.group({
                        categories: [""],
                    });
                    this.verticalStepperStep6 = this._formBuilder.group({
                        search: [""],
                    });
                }

                this.productForm = this.createProductForm();
                if (this.pageType != "edit") {
                    this.verticalStepperStep6
                        .get("search")
                        .valueChanges.debounceTime(500)
                        .subscribe((val: any) => {
                            const searchTerm = val.trim();
                            if (searchTerm === "") {
                                this.filteredProduct = [];
                            } else {
                                this.filteredProduct = this.products.filter(
                                    (search) =>
                                        search.productName
                                            .toLowerCase()
                                            .indexOf(searchTerm) > -1
                                );
                            }

                            // this.openFilteredProduct(this.filteredProduct);
                        });
                } else {
                    this.productForm
                        .get("search")
                        .valueChanges.debounceTime(500)
                        .subscribe((val: any) => {
                            const searchTerm = val.trim();
                            if (searchTerm === "") {
                                this.filteredProduct = [];
                            } else {
                                this.filteredProduct = this.products.filter(
                                    (search) =>
                                        search.productName
                                            .toLowerCase()
                                            .indexOf(searchTerm) > -1
                                );
                            }

                            // this.openFilteredProduct(this.filteredProduct);
                        });
                }
            });
    }

    /**
     * On destroy
     */
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    goToBack() {
        this._location.back();
    }

    get keywordControls(): FormArray {
        return this.verticalStepperStep2.controls["keywords"] as FormArray;
    }
    addToVariant(product) {
        this.variants.push(product);
        this.filteredProduct.splice(
            this.filteredProduct.findIndex(
                (products) => products.id === product.id
            ),
            1
        );
        console.log(this.variants);
    }
    removeVariant(product) {
        this.filteredProduct.unshift(product);
        this.variants.splice(
            this.variants.findIndex((products) => products.id === product.id),
            1
        );
        console.log(this.variants);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        // Add our fruit
        if ((value || "").trim()) {
            this.keywordControls.value.push(value);
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }
    }

    remove(fruit: string): void {
        const index = this.keywordControls.value.indexOf(fruit);
        console.log(this.keywordControls.value);
        if (index >= 0) {
            this.keywordControls.value.splice(index, 1);
        }
        console.log(this.keywordControls.value);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create product form
     *
     * @returns {FormGroup}
     */
    public dropped(files: NgxFileDropEntry[]) {
        this.images = files;
        for (const droppedFile of files) {
            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    // Here you can access the real file
                    this.allSaveFiles.push(file);
                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }
    }
    removeFile(id) {
        this.allFiles.find((file) => {
            if (file.fileId === id) {
                console.log(file);

                file.isDeleted = true;
            }
        });
        console.log(this.allFiles);
    }
    createProductForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.singleProduct.id],
            productName: [this.singleProduct.productName],
            description: [this.singleProduct.description],
            categories: [this.categoriess],
            keywords: [this.singleProduct.keywords],
            shortDescription: [this.singleProduct.shortDescription],
            images: [this.singleProduct.images],
            price: [this.singleProduct.price],
            ean: [this.singleProduct.ean],
            productUrl: [this.singleProduct.productUrl],
            active: [this.singleProduct.active],
            brand: [this.singleProduct.brand],
            creationDate: [this.singleProduct.creationDate],
            updateDate: [this.singleProduct.updateDate],
            search: [""],
        });
    }
    finishVerticalStepper() {
        const step1 = this.verticalStepperStep1.getRawValue();
        const step2 = this.verticalStepperStep2.getRawValue();
        const step3 = this.verticalStepperStep3.getRawValue();
        const step4 = this.verticalStepperStep4.getRawValue();
        const step5 = this.verticalStepperStep5.getRawValue();
        const step6 = this.verticalStepperStep6.getRawValue();

        console.log(step2);
        Object.assign(this.allFormData, {
            categories: step5.categories,
            images: step4.images,
            price: step3.price,
            shortDescription: step2.shortDescription,
            description: step2.description,
            ean: step1.active,
            active: step1.active,
            productUrl: step1.productUrl,
            productName: step1.productName,
            allDroppedImages: this.allSaveFiles,
            keywords: step2.keywords,
            brand: step2.brand,
            variants: this.variants,
        });

        // this.allFormData = [...step1, ...step2, ...step3, ...step4, ...step5];
        console.log(this.allFormData);
        this.openSaveAlert(this.allFormData);
    }
    openSaveAlert(allFormData: {}) {
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Save`,
            denyButtonText: `Don't save`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                console.log(allFormData);
                this.allSaveFiles = [];
                Swal.fire("Saved!", "", "success");
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }
    /**
     * Save product
     */
    saveProduct(): void {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.saveProduct(data).then(() => {
            // Trigger the subscription with new data
            this._ecommerceProductService.onProductChanged.next(data);

            // Show the success message
            this._matSnackBar.open("Product saved", "OK", {
                verticalPosition: "top",
                duration: 2000,
            });
        });
    }
    openFilteredProduct(allFilteredData: ProductData[]) {
        console.log(allFilteredData);
        // console.log(ids);
        const deleteDialog = this.matDialog.open(
            ProductSaveConfirmationComponent,
            {
                disableClose: true,
                data: {
                    data: allFilteredData,
                    width: "300px",
                    height: "400px",
                },
            }
        );
    }
    // openSaveProduct(allFormData: {}) {
    //     console.log("tusher");
    //     // console.log(ids);
    //     const deleteDialog = this.matDialog.open(
    //         ProductSaveConfirmationComponent,
    //         {
    //             disableClose: true,
    //             data: {
    //                 data: allFormData,
    //                 width: "300px",
    //                 height: "400px",
    //             },
    //         }
    //     );
    // }

    /**
     * Add product
     */
    addProduct(): void {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.addProduct(data).then(() => {
            // Trigger the subscription with new data
            this._ecommerceProductService.onProductChanged.next(data);

            // Show the success message
            this._matSnackBar.open("Product added", "OK", {
                verticalPosition: "top",
                duration: 2000,
            });

            //Change the location with new one
            this._location.go(
                "apps/e-commerce/products/" +
                    this.singleProduct.id +
                    "/" +
                    this.singleProduct.handle
            );
        });
    }
    addCategory(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        // Add category
        if (value) {
            console.log(this.verticalStepperStep5.controls["categories"].value);
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }
    }

    /**
     * Remove category
     *
     * @param category
     */
    removeCategory(category): void {
        const index = this.verticalStepperStep5.controls[
            "categories"
        ].value.indexOf(category);

        if (index >= 0) {
            this.verticalStepperStep5.controls["categories"].value.splice(
                index,
                1
            );
        }
    }
    public fileOver(event) {
        console.log(event);
    }

    public fileLeave(event) {
        console.log(event);
    }
}
