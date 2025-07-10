import { Component, Input, WritableSignal } from '@angular/core';
import { ValueToColorPipe } from '../value-to-color-pipe';
import plantInfo from '../models/plantInfo.model';
import { ComputeWateredDaysAgoPipe } from '../compute-watered-days-ago-pipe';
import { RouterLink } from '@angular/router';
import { PlantPicture } from '../plant-picture/plant-picture';

@Component({
    selector: 'app-plant-quick-info',
    imports: [
        ValueToColorPipe,
        ComputeWateredDaysAgoPipe,
        RouterLink,
        PlantPicture,
    ],
    templateUrl: './plant-quick-info.html',
})
export class PlantQuickInfo {
    @Input() plantInfo!: WritableSignal<plantInfo>;

    submitted() {
        console.log('submitted');
    }
}
