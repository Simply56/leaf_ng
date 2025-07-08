import { Component, Input, OnInit } from '@angular/core';
import plantInfo from '../models/plantInfo.model';

@Component({
  selector: 'app-plant-quick-info',
  imports: [],
  templateUrl: './plant-quick-info.html',
  styleUrl: './plant-quick-info.css'
})
export class PlantQuickInfo implements OnInit {
  @Input() plantInfo!: plantInfo;
  wateredDaysAgo?: number;


  ngOnInit(): void {
    this.wateredDaysAgo = this.computeWateredDaysAgo();
  }

  computeWateredDaysAgo(): number | undefined {
    if (this.plantInfo.lastWatered == null) {
      return undefined;
    }

    const difInMilis =  Date.now() - this.plantInfo.lastWatered.getTime()
    const difInDays = difInMilis / (1000 * 60 * 60 * 24);

    return Math.trunc(difInDays);
  }

  value_to_color(value: number, max_value: number = 10) {
    const ratio = Math.min(value / max_value, 1);
    const hue = Math.trunc(120 - 120 * ratio);  // 120 = green, 0 = red;
    return `hsl(${hue}, 100%, 40%)`;
  }
}
