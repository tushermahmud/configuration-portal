import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "filterProduct",
})
export class Filterpipe implements PipeTransform {
    transform(value: any, searchTerm: any): any {
        console.log(value);
        return value.filter(function (search) {
            return search.productName.toLowerCase().indexOf(searchTerm) > -1;
        });
    }
}
