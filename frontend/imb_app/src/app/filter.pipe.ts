import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      // Check if the search text is found in any of the fields
      return Object.values(item).some((field: any) => {
        return field && field.toString().toLowerCase().includes(searchText);
      });
    });
  }
}
