import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    console.log('FilterPipe called with:', { items, searchText });
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    const filteredItems = items.filter(item => {
      // Check if the search text exactly matches any element in the developers array or the Scrum Master name field
      return (
        (item.developers &&
          item.developers.some((developerName: string) => {
            return developerName.toLowerCase() === searchText;
          })) ||
        (item.scrumMasterName &&
          item.scrumMasterName.toString().trim().toLowerCase() === searchText)
      );
    });
    console.log('FilterPipe returning:', filteredItems);
    return filteredItems;
  }
}