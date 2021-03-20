import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { TranslateModule } from "@ngx-translate/core";

import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,
} from "@fuse/components";

import { fuseConfig } from "app/fuse-config";

import { FakeDbService } from "app/fake-db/fake-db.service";
import { AppComponent } from "app/app.component";
import { AppStoreModule } from "app/store/store.module";
import { LayoutModule } from "app/layout/layout.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

const appRoutes: Routes = [
    {
        path: "apps",
        loadChildren: () =>
            import("./main/apps/apps.module").then((m) => m.AppsModule),
    },

    {
        path: "**",
        redirectTo: "apps/dashboards/analytics",
    },
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { relativeLinkResolution: "legacy" }),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true,
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AppStoreModule,
    ],
    exports: [RouterModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
