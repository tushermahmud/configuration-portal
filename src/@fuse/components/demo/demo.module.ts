import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import { FuseDemoContentComponent } from "./demo-content/demo-content.component";
import { FuseDemoSidebarComponent } from "./demo-sidebar/demo-sidebar.component";
import { CommonModule } from "@angular/common";
@NgModule({
    declarations: [FuseDemoContentComponent, FuseDemoSidebarComponent],
    imports: [
        RouterModule,
        CommonModule,
        MatDividerModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
    ],
    exports: [FuseDemoContentComponent, FuseDemoSidebarComponent],
})
export class FuseDemoModule {}
