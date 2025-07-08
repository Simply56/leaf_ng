import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'computeWateredDaysAgo'
})
export class ComputeWateredDaysAgoPipe implements PipeTransform {

  transform(lastWatered: Date | undefined,): number | undefined {
    if (lastWatered == null) {
      return undefined;
    }

    const difInMilis = Date.now() - lastWatered.getTime();
    const difInDays = difInMilis / (1000 * 60 * 60 * 24);

    return Math.trunc(difInDays);
  }

}
