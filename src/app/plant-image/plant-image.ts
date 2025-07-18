import { Component, ElementRef, inject, Input, ViewChild, } from '@angular/core';
import plantInfo from '../models/plantInfo.model';
import { PlantsService } from '../plants-service';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-plant-image',
    imports: [NgOptimizedImage],
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
