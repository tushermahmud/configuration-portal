import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { FuseUtils } from "@fuse/utils";
import { ProductData } from "./../configuration-files/ProductData.model";

import { EcommerceProductService } from "app/main/apps/e-commerce/product/product.service";
import { MatChipInputEvent } from "@angular/material/chips";
import {
    NgxFileDropEntry,
    FileSystemFileEntry,
    FileSystemDirectoryEntry,
} from "ngx-file-drop";

@Component({
    selector: "e-commerce-product",
    templateUrl: "./product.component.html",
    styleUrls: ["./product.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class EcommerceProductComponent implements OnInit, OnDestroy {
    product: ProductData;
    pageType: string;
    productForm: FormGroup;
    public images: NgxFileDropEntry[] = [];

    // Private
    private _unsubscribeAll: Subject<any>;

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
    allFormData = {};
    constructor(
        private _ecommerceProductService: EcommerceProductService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar
    ) {
        // Set the default
        this.product = new ProductData();

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
        // Subscribe to update product on changes
        this._ecommerceProductService.onProductChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((product) => {
                console.log(product);
                if (product) {
                    console.log(product);
                    this.product = new ProductData(product);
                    this.pageType = "edit";
                } else {
                    this.pageType = "new";
                    this.product = new ProductData();
                    this.verticalStepperStep1 = this._formBuilder.group({
                        productName: ["", Validators.required],
                        productUrl: ["", Validators.required],
                        ean: ["", Validators.required],
                        active: ["", Validators.required],
                    });

                    this.verticalStepperStep2 = this._formBuilder.group({
                        description: ["", Validators.required],
                        shortDescription: ["", Validators.required],
                    });

                    this.verticalStepperStep3 = this._formBuilder.group({
                        price: ["", Validators.required],
                    });
                    this.verticalStepperStep4 = this._formBuilder.group({
                        images: ["", Validators.required],
                    });
                    this.verticalStepperStep5 = this._formBuilder.group({
                        categories: [this.product.categories],
                    });
                }

                this.productForm = this.createProductForm();
            });
        console.log(this.product);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
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
                    console.log(droppedFile.relativePath, file);

                    /**
              // You could upload it like this:
              const formData = new FormData()
              formData.append('logo', file, relativePath)
    
              // Headers
              const headers = new HttpHeaders({
                'security-token': 'mytoken'
              })
    
              this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
              .subscribe(data => {
                // Sanitized logo returned from backend
              })
              **/
                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }
    }
    createProductForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.product.id],
            productName: [this.product.productName],
            description: [this.product.description],
            categories: [this.product.categories],
            shortDescription: [this.product.shortDescription],
            images: [this.product.images],
            price: [this.product.price],
            ean: [this.product.ean],
            active: [this.product.active],
            brand: [this.product.brand],
            creationDate: [this.product.creationDate],
            updateDate: [this.product.updateDate],
        });
    }
    finishVerticalStepper() {
        const step1 = this.verticalStepperStep1.getRawValue();
        const step2 = this.verticalStepperStep2.getRawValue();
        const step3 = this.verticalStepperStep3.getRawValue();
        const step4 = this.verticalStepperStep4.getRawValue();
        const step5 = this.verticalStepperStep5.getRawValue();
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
        });

        // this.allFormData = [...step1, ...step2, ...step3, ...step4, ...step5];
        console.log(this.allFormData);
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
                    this.product.id +
                    "/" +
                    this.product.handle
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

// export class EcommerceProductComponent implements OnInit, OnDestroy {
//     product: ProductData;
//     pageType: string;
//     productForm: FormGroup;

//     // Private
//     private _unsubscribeAll: Subject<any>;

//     /**
//      * Constructor
//      *
//      * @param {EcommerceProductService} _ecommerceProductService
//      * @param {FormBuilder} _formBuilder
//      * @param {Location} _location
//      * @param {MatSnackBar} _matSnackBar
//      */
//     constructor(
//         private _ecommerceProductService: EcommerceProductService,
//         private _formBuilder: FormBuilder,
//         private _location: Location,
//         private _matSnackBar: MatSnackBar
//     ) {
//         // Set the default
//         this.product = new ProductData();

//         // Set the private defaults
//         this._unsubscribeAll = new Subject();
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Lifecycle hooks
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * On init
//      */
//     ngOnInit(): void {
//         // Subscribe to update product on changes
//         this._ecommerceProductService.onProductChanged
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe((product) => {
//                 console.log(product);
//                 if (product) {
//                     console.log(product);
//                     this.pageType = "edit";
//                     console.log(product);
//                 } else {
//                     this.pageType = "new";
//                     this.product = new ProductData();
//                 }

//                 this.productForm = this.createProductForm();
//             });
//     }

//     /**
//      * On destroy
//      */
//     ngOnDestroy(): void {
//         // Unsubscribe from all subscriptions
//         this._unsubscribeAll.next();
//         this._unsubscribeAll.complete();
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Create product form
//      *
//      * @returns {FormGroup}
//      */
//     createProductForm(): FormGroup {
//         return this._formBuilder.group({
//             id: [this.product.productId],
//             name: [this.product.productName],
//             description: [this.product.description],
//             categories: [this.product.categories],
//             shortDescription: [this.product.shortDescription],
//             images: [this.product.images],
//             price: [this.product.price],
//             ean: [this.product.ean],
//             active: [this.product.active],
//             brand: [this.product.brand],
//             creationDate: [this.product.creationDate],
//             updateDate: [this.product.updateDate],
//         });
//     }

//     /**
//      * Save product
//      */
//     saveProduct(): void {
//         const data = this.productForm.getRawValue();
//         data.handle = FuseUtils.handleize(data.name);

//         this._ecommerceProductService.saveProduct(data).then(() => {
//             // Trigger the subscription with new data
//             this._ecommerceProductService.onProductChanged.next(data);

//             // Show the success message
//             this._matSnackBar.open("Product saved", "OK", {
//                 verticalPosition: "top",
//                 duration: 2000,
//             });
//         });
//     }

//     /**
//      * Add product
//      */
//     addProduct(): void {
//         const data = this.productForm.getRawValue();
//         data.handle = FuseUtils.handleize(data.name);

//         this._ecommerceProductService.addProduct(data).then(() => {
//             // Trigger the subscription with new data
//             this._ecommerceProductService.onProductChanged.next(data);

//             // Show the success message
//             this._matSnackBar.open("Product added", "OK", {
//                 verticalPosition: "top",
//                 duration: 2000,
//             });

//             // Change the location with new one
//             this._location.go(
//                 "apps/e-commerce/products/" + this.product.productId
//             );
//         });
//     }
// }
