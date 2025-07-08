import { Component, Input, OnInit } from '@angular/core';
import { ValueToColorPipe } from "../value-to-color-pipe";
import plantInfo from '../models/plantInfo.model';
import { ComputeWateredDaysAgoPipe } from "../compute-watered-days-ago-pipe";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-plant-quick-info',
    imports: [ValueToColorPipe, ComputeWateredDaysAgoPipe, RouterLink],
    templateUrl: './plant-quick-info.html',
})
export class PlantQuickInfo {
    @Input() plantInfo!: plantInfo;
}
