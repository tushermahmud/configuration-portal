import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ProductData } from "../../../../app/main/apps/e-commerce/configuration-files/ProductData.model";
import { fuseAnimations } from "@fuse/animations";
import { FuseUtils } from "@fuse/utils";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

@Component({
    selector: "fuse-demo-sidebar",
    templateUrl: "./demo-sidebar.component.html",
    styleUrls: ["./demo-sidebar.component.scss"],
})
export class FuseDemoSidebarComponent implements OnInit {
    /**
     * Constructor
     */
    encapsulation: ViewEncapsulation.None;
    productData: ProductData;
    @Input() product: ProductData;
    constructor() {}
    ngOnInit(): void {
        this.productData = this.product;
        console.log(this.productData);
    }
}
