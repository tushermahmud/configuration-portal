import { FuseNavigation } from "@fuse/types";

export const navigation: FuseNavigation[] = [
    {
        id: "applications",
        title: "Applications",
        translate: "NAV.APPLICATIONS",
        type: "group",
        icon: "apps",
        children: [
            {
                id: "dashboards",
                title: "Dashboards",
                translate: "NAV.DASHBOARDS",
                type: "collapsable",
                icon: "dashboard",
                children: [
                    {
                        id: "analytics",
                        title: "Analytics",
                        type: "item",
                        url: "/apps/dashboards/analytics",
                    },
                    {
                        id: "project",
                        title: "Project",
                        type: "item",
                        url: "/apps/dashboards/project",
                    },
                ],
            },

            {
                id: "e-commerce",
                title: "E-Commerce",
                translate: "NAV.ECOMMERCE",
                type: "collapsable",
                icon: "shopping_cart",
                children: [
                    {
                        id: "products",
                        title: "Products",
                        type: "item",
                        url: "/apps/e-commerce/products",
                        exactMatch: true,
                    },
                    // {
                    //     id: "create",
                    //     title: "Product Create",
                    //     type: "item",
                    //     url: "/apps/e-commerce/products/create",
                    //     exactMatch: true,
                    // },
                    {
                        id: "productDetail",
                        title: "Product Detail",
                        type: "item",
                        url: "/apps/e-commerce/products/1/printed-dress",
                        // exactMatch: true
                    },
                    {
                        id: "orders",
                        title: "Orders",
                        type: "item",
                        url: "/apps/e-commerce/orders",
                        exactMatch: true,
                    },
                    {
                        id: "orderDetail",
                        title: "Order Detail",
                        type: "item",
                        url: "/apps/e-commerce/orders/1",
                        exactMatch: true,
                    },
                ],
            },
        ],
    },
];
