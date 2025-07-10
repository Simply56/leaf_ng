import { Component, Input, } from '@angular/core';
import plantInfo from '../models/plantInfo.model';

@Component({
    selector: 'app-plant-image',
    imports: [],
    templateUrl: './plant-image.html',
    styleUrl: './plant-image.css'
})
export class PlantImage {
    @Input() plant!: plantInfo;

}
