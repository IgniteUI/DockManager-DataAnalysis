import { Pipe, PipeTransform } from '@angular/core';
import {IgcDockManagerLayout} from 'igniteui-dockmanager';
@Pipe({
  name: "selectedChart"
})
export class SelectedPipeChart implements PipeTransform {
  public transform(contentId: string, layout: IgcDockManagerLayout, chartTypes) {
      const count = this.hasDuplicateContentID(layout, contentId, 0);
      if (count === 0 && (chartTypes[contentId] || Object.keys(chartTypes).indexOf(contentId) !== -1)) {
          delete chartTypes[contentId];
          return false;
      }
      return count >= 1;

  }

  private hasDuplicateContentID = (ob, contentId, count) => {

      if (ob["contentId"] && ob["contentId"] === contentId) {
          count++;
      }

      for (const i in ob) {
          if (!ob.hasOwnProperty(i)) { continue; }

          if ((typeof ob[i]) === "object") {
              count = this.hasDuplicateContentID(ob[i], contentId, count);
          }
      }
      return count;
  }
}