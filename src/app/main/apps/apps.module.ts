import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FuseSharedModule } from "@fuse/shared.module";

const routes = [
    {
        path: "dashboards/analytics",
        loadChildren: () =>
            import("./dashboards/analytics/analytics.module").then(
                (m) => m.AnalyticsDashboardModule
            ),
    },
    {
        path: "dashboards/project",
        loadChildren: () =>
            import("./dashboards/project/project.module").then(
                (m) => m.ProjectDashboardModule
            ),
    },

    {
        path: "e-commerce",
        loadChildren: () =>
            import("./e-commerce/e-commerce.module").then(
                (m) => m.EcommerceModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes), FuseSharedModule],
})
export class AppsModule {}
