import { Component, Input } from '@angular/core';
import { ValueToColorPipe } from '../value-to-color-pipe';
import plantInfo from '../models/plantInfo.model';
import { ComputeWateredDaysAgoPipe } from '../compute-watered-days-ago-pipe';
import { RouterLink } from '@angular/router';
import { PlantImage } from '../plant-image/plant-image';

@Component({
    selector: 'app-plant-quick-info',
    imports: [
        ValueToColorPipe,
        ComputeWateredDaysAgoPipe,
        RouterLink,
        PlantImage
    ],
    templateUrl: './plant-quick-info.html',
})
export class PlantQuickInfo {
    @Input() plant!: plantInfo;
}
