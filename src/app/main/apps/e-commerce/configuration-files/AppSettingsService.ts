import {Injectable} from '@angular/core';
import 'rxjs/add/observable/of';
import {AppSettings} from './AppSettings';
import {Observable, of} from 'rxjs';
import 'rxjs/observable/of';
import {Resolve} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AppSettingsService implements Resolve<Observable<AppSettings>> {
    constructor() {
    }

    resolve(): Observable<AppSettings> {
        const settings = new AppSettings();
        return of<AppSettings>(settings);
    }
}
