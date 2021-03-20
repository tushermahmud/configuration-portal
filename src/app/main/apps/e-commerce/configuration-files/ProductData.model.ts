import { FuseUtils } from "@fuse/utils";
import { MatChipInputEvent } from "@angular/material/chips";

export class ProductData {
    id: string;
    handle: string;
    productName: string;
    description: string;
    shortDescription: string;
    price: string;
    images: string[];
    ean: string;
    productUrl: string;
    keywords: string[];
    categories: string[];
    variants: ProductData[];
    active: boolean;
    brand: string;
    creationDate: Date;
    updateDate: Date;
    constructor(product?) {
        product = product || {};
        this.id = product.id || FuseUtils.generateGUID();
        this.productName = product.productName || "";
        this.handle = product.handle || FuseUtils.handleize(this.productName);
        this.description = product.description || "";
        this.shortDescription = product.description || "";
        this.categories = product.categories || [];
        this.images = product.images || [];
        this.price = product.price || "";
        this.ean = product.ean || "";
        this.active = product.active || true;
        this.brand = product.brand || "";
        this.creationDate = product.creationDate || "";
        this.updateDate = product.creationDate || "";
    }
    addCategory(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add category
        if (value) {
            this.categories.push(value);
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
        const index = this.categories.indexOf(category);

        if (index >= 0) {
            this.categories.splice(index, 1);
        }
    }
}
export class DisplayColumns {
    select: any;
    id: string;
    name: string;
    shortDescription: string;
    ean: string;
    active: string;
    price: string;
    actions: string;
}
