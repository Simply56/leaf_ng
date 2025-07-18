import { Component, ElementRef, inject, Input, ViewChild, } from '@angular/core';
import plantInfo from '../models/plantInfo.model';
import { PlantsService } from '../plants-service';

@Component({
    selector: 'app-plant-image',
    imports: [],
    templateUrl: './plant-image.html',
})
export class PlantImage {
    service: PlantsService = inject(PlantsService);
    @Input() plant!: plantInfo;
    @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

    updateImage() {
        this.service.updatePlantImage(this.plant, this.imageInput.nativeElement.files?.[0]);
    }

}
