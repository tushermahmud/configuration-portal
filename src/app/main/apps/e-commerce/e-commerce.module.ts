import { FuseSidebarModule } from "@fuse/components";
import { FuseDemoModule } from "./../../../../@fuse/components/demo/demo.module";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatRippleModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { AgmCoreModule } from "@agm/core";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseWidgetModule } from "@fuse/components/widget/widget.module";
import { EcommerceProductsComponent } from "app/main/apps/e-commerce/products/products.component";
import { EcommerceProductsService } from "app/main/apps/e-commerce/products/products.service";
import { EcommerceProductComponent } from "app/main/apps/e-commerce/product/product.component";
import { EcommerceProductService } from "app/main/apps/e-commerce/product/product.service";
import { EcommerceOrdersComponent } from "app/main/apps/e-commerce/orders/orders.component";
import { EcommerceOrdersService } from "app/main/apps/e-commerce/orders/orders.service";
import { EcommerceOrderComponent } from "app/main/apps/e-commerce/order/order.component";
import { EcommerceOrderService } from "app/main/apps/e-commerce/order/order.service";
import { NgxFileDropModule } from "ngx-file-drop";
import { MatListModule } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ProductDialogComponent } from "./product-dialog/product-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { ProductSaveConfirmationComponent } from "./product-save-confirmation/product-save-confirmation.component";
import { TypeofPipe } from "./typeofpipe";

const routes: Routes = [
    {
        path: "products",
        component: EcommerceProductsComponent,
        resolve: {
            data: EcommerceProductsService,
        },
    },
    {
        path: "products/:id",
        component: EcommerceProductComponent,
        resolve: {
            data: EcommerceProductService,
        },
    },
    {
        path: "products/:id/:handle",
        component: EcommerceProductComponent,
        resolve: {
            data: EcommerceProductService,
        },
    },
    {
        path: "orders",
        component: EcommerceOrdersComponent,
        resolve: {
            data: EcommerceOrdersService,
        },
    },
    {
        path: "orders/:id",
        component: EcommerceOrderComponent,
        resolve: {
            data: EcommerceOrderService,
        },
    },
];

@NgModule({
    declarations: [
        EcommerceProductsComponent,
        EcommerceProductComponent,
        EcommerceOrdersComponent,
        EcommerceOrderComponent,
        ProductDialogComponent,
        ProductSaveConfirmationComponent,
        TypeofPipe,
    ],
    imports: [
        RouterModule.forChild(routes),
        MatDatepickerModule,
        MatNativeDateModule,
        NgxFileDropModule,
        MatProgressBarModule,
        FuseDemoModule,
        MatCheckboxModule,
        MatSliderModule,
        MatDialogModule,
        MatStepperModule,
        MatSlideToggleModule,
        FuseSidebarModule,
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatListModule,
        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8",
        }),

        FuseSharedModule,
        FuseWidgetModule,
    ],
    providers: [
        EcommerceProductsService,
        EcommerceProductService,
        EcommerceOrdersService,
        EcommerceOrderService,
    ],
    entryComponents: [ProductDialogComponent, ProductSaveConfirmationComponent],
})
export class EcommerceModule {}
