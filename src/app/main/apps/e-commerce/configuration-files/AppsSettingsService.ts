import { Injectable } from "@angular/core";
import "rxjs/add/observable/of";
import { AppsSettings } from "./AppSettings";
import { Observable, of } from "rxjs";
import "rxjs/observable/of";
import { Resolve } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class AppsSettingsService implements Resolve<Observable<AppsSettings>> {
    constructor() {}

    resolve(): Observable<AppsSettings> {
        const settings = new AppsSettings();
        return of<AppsSettings>(settings);
    }
}
