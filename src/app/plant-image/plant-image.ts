import { Component, ElementRef, inject, Input, ViewChild, } from '@angular/core';
import plantInfo from '../models/plantInfo.model';
import { PlantsService } from '../plants-service';

@Component({
    selector: 'app-plant-image',
    imports: [],
    templateUrl: './plant-image.html',
    styleUrl: './plant-image.css'
})
export class PlantImage {
    service: PlantsService = inject(PlantsService);
    @Input() plant!: plantInfo;
    @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

    updateImage() {
        console.log(this.imageInput.nativeElement.files?.[0]);
        this.service.updatePlantImage(this.plant.id, this.imageInput.nativeElement.files?.[0])?.subscribe(
            () => {
                this.plant.imagePath += "?t=1";
            }
        );
    }

}
