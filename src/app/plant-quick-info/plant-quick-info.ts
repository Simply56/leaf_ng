import { Component, Input } from '@angular/core';
import plantInfo from '../models/plantInfo.model';

@Component({
  selector: 'app-plant-quick-info',
  imports: [],
  templateUrl: './plant-quick-info.html',
  styleUrl: './plant-quick-info.css'
})
export class PlantQuickInfo {
  @Input() plantInfo!: plantInfo;
  wateredDaysAgo: number | null = this.computeWateredDaysAgo();

  computeWateredDaysAgo(): number | null {
    return 0;
    // if (this.plantInfo.lastWatered == null) {
    //   return null;
    // }
    // const now: Date = new Date();
    // const utcThen = Date.UTC(this.plantInfo.lastWatered.getFullYear(), this.plantInfo.lastWatered.getMonth(), this.plantInfo.lastWatered.getDate());
    // const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    // return utcNow - utcThen;
  }


}
